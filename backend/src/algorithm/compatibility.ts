import { WEIGHTS, FiveElement, SANG_SAENG, SANG_GEUK, ELEMENTS_MAP } from './constants';

// 유저의 사주 원국 및 오행 데이터 인터페이스
export interface SajuData {
  ilgan: string; // 일간 (예: '갑', '병')
  fiveElementsCount: Record<FiveElement, number>; // 오행 개수 (예: { 목: 2, 화: 1, 토: 3, 금: 1, 수: 1 })
  jiji: string[]; // 지지 4글자 (연, 월, 일, 시)
  birthDate: Date; // 생년월일시 (바이오리듬 계산용)
}

/**
 * 1. 일간 궁합 점수 계산 (C_il)
 * 상생(생해주는 관계)이면 높은 점수, 상극(극하는 관계)이면 낮은 점수, 같으면 중간 점수 부여
 * @returns 0 ~ 100 사이의 점수
 */
export function calculateIlganScore(userA: SajuData, userB: SajuData): number {
  const elementA = ELEMENTS_MAP[userA.ilgan];
  const elementB = ELEMENTS_MAP[userB.ilgan];

  if (elementA === elementB) return 70; // 같은 오행 (비견/겁재) - 무난함

  // A가 B를 생해주거나 B가 A를 생해주는 경우
  if (SANG_SAENG[elementA] === elementB || SANG_SAENG[elementB] === elementA) {
    return 90; // 상생 관계 - 매우 좋음
  }

  // A가 B를 극하거나 B가 A를 극하는 경우
  if (SANG_GEUK[elementA] === elementB || SANG_GEUK[elementB] === elementA) {
    return 40; // 상극 관계 - 노력이 필요함
  }

  return 50; // 그 외
}

/**
 * 2. 오행 조화도 계산 (C_five)
 * 서로에게 부족한 오행을 상대방이 가지고 있는지 평가 (상호 보완성)
 * @returns 0 ~ 100 사이의 점수
 */
export function calculateFiveElementsHarmony(userA: SajuData, userB: SajuData): number {
  let harmonyScore = 50; // 기본 점수
  const elements: FiveElement[] = ['목', '화', '토', '금', '수'];

  elements.forEach((el) => {
    // A에게 부족한 오행(0개)을 B가 많이(2개 이상) 가지고 있을 때 보완 점수 추가
    if (userA.fiveElementsCount[el] === 0 && userB.fiveElementsCount[el] >= 2) {
      harmonyScore += 15;
    }
    // B에게 부족한 오행을 A가 많이 가지고 있을 때 보완 점수 추가
    if (userB.fiveElementsCount[el] === 0 && userA.fiveElementsCount[el] >= 2) {
      harmonyScore += 15;
    }
    
    // 둘 다 특정 오행이 너무 많은 경우 (3개 이상) 충돌 가능성으로 점수 차감
    if (userA.fiveElementsCount[el] >= 3 && userB.fiveElementsCount[el] >= 3) {
      harmonyScore -= 10;
    }
  });

  return Math.min(Math.max(harmonyScore, 0), 100); // 0~100점 사이로 제한
}

/**
 * 3. 지지 관계성 분석 (C_rel)
 * 합(合)이 많으면 가산점, 충/형/해/파 가 많으면 감점
 * (간이 로직으로 구현. 실제 구현시에는 삼합, 방합, 육합 등 상세 테이블 매핑 필요)
 * @returns 0 ~ 100 사이의 점수
 */
export function calculateJijiRelations(userA: SajuData, userB: SajuData): number {
  let relScore = 60; // 기본 점수 60점에서 시작
  
  // TODO: 실제 지지 합/충 테이블과 비교하는 로직 구현 필요
  // 현재는 임시로 일지(태어난 날의 지지)가 같은 그룹에 속하는지로 간이 계산
  const iljiA = userA.jiji[2]; // 연, 월, '일', 시
  const iljiB = userB.jiji[2];
  
  if (iljiA && iljiB) {
      // 육합 등 기본 합이 맞는 케이스 (예시)
      if ((iljiA === '자' && iljiB === '축') || (iljiA === '축' && iljiB === '자')) relScore += 30;
      // 충이 발생하는 케이스 (예시: 자오충)
      if ((iljiA === '자' && iljiB === '오') || (iljiA === '오' && iljiB === '자')) relScore -= 30;
  }
  
  return Math.min(Math.max(relScore, 0), 100);
}

/**
 * 4. 바이오리듬 보정 (C_bio)
 * 두 사람의 생년월일 차이를 기반으로 신체, 감성, 지성 주기의 일치도 산출
 * @returns 0 ~ 100 사이의 점수
 */
export function calculateBiorhythm(userA: SajuData, userB: SajuData): number {
  // 두 사람의 생일 간의 일수 차이 계산
  const diffTime = Math.abs(userA.birthDate.getTime() - userB.birthDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 신체(23일), 감성(28일), 지성(33일) 주기
  const physicalDiff = (diffDays % 23) / 23;
  const emotionalDiff = (diffDays % 28) / 28;
  const intellectualDiff = (diffDays % 33) / 33;

  // 주기가 비슷할수록(차이가 0에 가까울수록) 1에 가깝게 변환
  const physicalSync = 1 - Math.abs(0.5 - physicalDiff) * 2;
  const emotionalSync = 1 - Math.abs(0.5 - emotionalDiff) * 2;
  const intellectualSync = 1 - Math.abs(0.5 - intellectualDiff) * 2;

  // 종합 바이오리듬 일치도 (감성 주기에 가중치를 조금 더 둠)
  const totalSync = (physicalSync * 30) + (emotionalSync * 40) + (intellectualSync * 30);

  return Math.min(Math.max(Math.round(totalSync), 0), 100);
}

/**
 * 최종 종합 궁합 점수 산출 (C_total)
 * 기획서의 수식: C_total = w_il*C_il + w_five*C_five + w_rel*C_rel + w_bio*C_bio
 */
export function calculateTotalCompatibility(userA: SajuData, userB: SajuData) {
  const cIl = calculateIlganScore(userA, userB);
  const cFive = calculateFiveElementsHarmony(userA, userB);
  const cRel = calculateJijiRelations(userA, userB);
  const cBio = calculateBiorhythm(userA, userB);

  const cTotal = 
    (WEIGHTS.ILGAN * cIl) + 
    (WEIGHTS.FIVE_ELEMENTS * cFive) + 
    (WEIGHTS.JIJI_RELATIONS * cRel) + 
    (WEIGHTS.BIORHYTHM * cBio);

  return {
    totalScore: Math.round(cTotal),
    details: {
      ilganScore: cIl,
      fiveElementsScore: cFive,
      jijiScore: cRel,
      biorhythmScore: cBio
    }
  };
}
