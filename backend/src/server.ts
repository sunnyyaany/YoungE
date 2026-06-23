import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { calculateTotalCompatibility } from './algorithm/compatibility';
import { extractSaju } from './algorithm/manseyeok';
import { authenticateToken, AuthRequest, JWT_SECRET } from './middleware/auth';
import { generateDailyCard, generateCalendarFeed } from './algorithm/ai';

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 서버 상태 확인 API
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Yeoniassi API Server is running' });
});

// 1. (Mock) 휴대폰 본인 인증 검증 및 토큰 발급
app.post('/api/auth/verify', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, verificationCode } = req.body;
    
    // 로컬 개발 환경이므로 123456이면 인증 성공으로 처리
    if (verificationCode === '123456') {
      res.json({ message: 'Verification successful', phoneNumber, verified: true });
    } else {
      res.status(400).json({ error: 'Invalid verification code' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// 2. 신규 유저 생성 및 사주 프로필 등록 (회원가입)
app.post('/api/users/register', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, password, name, gender, birthDateString } = req.body;
    
    // 이미 존재하는 전화번호인지 확인
    const existingUser = await prisma.user.findUnique({ where: { phoneNumber } });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 생년월일 파싱
    const birthDate = new Date(birthDateString);
    
    // 만세력 추출 (어댑터 사용)
    const sajuData = extractSaju(birthDate, gender as 'M' | 'F');
    
    // DB 저장
    const user = await prisma.user.create({
      data: {
        phoneNumber,
        password: hashedPassword,
        name,
        gender,
        birthDate,
        sajuProfile: {
          create: {
            ilgan: sajuData.ilgan,
            jiji: JSON.stringify(sajuData.jiji),
            fiveElementsCount: JSON.stringify(sajuData.fiveElementsCount)
          }
        }
      },
      include: {
        sajuProfile: true
      }
    });

    // JWT 발급
    const token = jwt.sign({ id: user.id, phoneNumber: user.phoneNumber }, JWT_SECRET, { expiresIn: '7d' });

    // 보안상 비밀번호 제외하고 응답
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// 3. 로그인 API
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await prisma.user.findUnique({ where: { phoneNumber } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // JWT 발급
    const token = jwt.sign({ id: user.id, phoneNumber: user.phoneNumber }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Login successful', token, userId: user.id, tier: user.tier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// 4. 두 유저 간의 궁합 산출 (Phase 1 엔진 연동)
app.post('/api/match/calculate', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { userBId } = req.body;
    const userAId = req.user!.id; // JWT에서 추출된 로그인 유저 ID

    const userA = await prisma.user.findUnique({ where: { id: userAId }, include: { sajuProfile: true } });
    const userB = await prisma.user.findUnique({ where: { id: userBId }, include: { sajuProfile: true } });

    if (!userA || !userB || !userA.sajuProfile || !userB.sajuProfile) {
      return res.status(404).json({ error: 'User or SajuProfile not found' });
    }

    // DB 데이터 -> SajuData 포맷팅
    const sajuDataA = {
      ilgan: userA.sajuProfile.ilgan,
      fiveElementsCount: JSON.parse(userA.sajuProfile.fiveElementsCount),
      jiji: JSON.parse(userA.sajuProfile.jiji),
      birthDate: userA.birthDate
    };

    const sajuDataB = {
      ilgan: userB.sajuProfile.ilgan,
      fiveElementsCount: JSON.parse(userB.sajuProfile.fiveElementsCount),
      jiji: JSON.parse(userB.sajuProfile.jiji),
      birthDate: userB.birthDate
    };

    // 궁합 연산
    const result = calculateTotalCompatibility(sajuDataA, sajuDataB);

    // 매칭 기록 저장
    const matchHistory = await prisma.matchHistory.create({
      data: {
        userAId: userA.id,
        userBId: userB.id,
        totalScore: result.totalScore,
        ilganScore: result.details.ilganScore,
        fiveElementsScore: result.details.fiveElementsScore,
        jijiScore: result.details.jijiScore,
        biorhythmScore: result.details.biorhythmScore
      }
    });

    res.json({
      message: 'Match calculated',
      score: result.totalScore,
      details: result.details,
      historyId: matchHistory.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to calculate match' });
  }
});

// 5. 유저 매칭 알고리즘 API (로그인한 유저 기준 상위 매칭 추천)
app.get('/api/match/recommend', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userAId = req.user!.id;

    // 현재 유저 정보 조회
    const userA = await prisma.user.findUnique({ where: { id: userAId }, include: { sajuProfile: true } });
    if (!userA || !userA.sajuProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // 다른 모든 유저 정보 조회 (이성만 추천하기 위해 성별 필터링)
    const oppositeGender = userA.gender === 'M' ? 'F' : 'M';
    const potentialMatches = await prisma.user.findMany({
      where: {
        id: { not: userAId },
        gender: oppositeGender
      },
      include: { sajuProfile: true }
    });

    const sajuDataA = {
      ilgan: userA.sajuProfile.ilgan,
      fiveElementsCount: JSON.parse(userA.sajuProfile.fiveElementsCount),
      jiji: JSON.parse(userA.sajuProfile.jiji),
      birthDate: userA.birthDate
    };

    // 각 유저별로 궁합 계산
    const recommendations = potentialMatches.map(userB => {
      if (!userB.sajuProfile) return null;
      
      const sajuDataB = {
        ilgan: userB.sajuProfile.ilgan,
        fiveElementsCount: JSON.parse(userB.sajuProfile.fiveElementsCount),
        jiji: JSON.parse(userB.sajuProfile.jiji),
        birthDate: userB.birthDate
      };

      const result = calculateTotalCompatibility(sajuDataA, sajuDataB);
      return {
        userId: userB.id,
        name: userB.name,
        age: new Date().getFullYear() - new Date(userB.birthDate).getFullYear(),
        totalScore: result.totalScore,
        details: result.details
      };
    }).filter(r => r !== null);

    // 점수 순 내림차순 정렬
    recommendations.sort((a, b) => (b?.totalScore || 0) - (a?.totalScore || 0));

    // 상위 10명만 반환
    const topMatches = recommendations.slice(0, 10);

    res.json({ message: 'Recommendations fetched', matches: topMatches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// 6. 멤버십 구독 API (Mock)
app.post('/api/payment/subscribe', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    // 실제 PG 결제 모의 성공이라 가정하고 즉시 등급 업그레이드
    const user = await prisma.user.update({
      where: { id: userId },
      data: { tier: 'Pro' }
    });
    res.json({ message: 'Subscription successful', tier: user.tier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// 7. 일일 궁합/운세 카드 제공 API (AI 연동)
app.get('/api/content/daily-card', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { sajuProfile: true } });

    if (!user || !user.sajuProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const sajuData = {
      ilgan: user.sajuProfile.ilgan,
      jiji: JSON.parse(user.sajuProfile.jiji),
      fiveElementsCount: JSON.parse(user.sajuProfile.fiveElementsCount)
    };

    const cardContent = await generateDailyCard(sajuData, user.name);
    res.json({ message: 'Daily card generated', content: cardContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate daily card' });
  }
});

// 8. 대운/연운 기반 캘린더 피드 API (AI 연동)
app.get('/api/content/calendar', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({ where: { id: userId }, include: { sajuProfile: true } });

    if (!user || !user.sajuProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const sajuData = {
      ilgan: user.sajuProfile.ilgan,
      fiveElementsCount: JSON.parse(user.sajuProfile.fiveElementsCount)
    };

    const calendarContent = await generateCalendarFeed(sajuData, user.name);
    res.json({ message: 'Calendar feed generated', content: calendarContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate calendar feed' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
