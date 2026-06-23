# 연이아씨 개발 태스크 트래커

- `[ ]` uncompleted tasks
- `[/]` in progress tasks (custom notation)
- `[x]` completed tasks

## Phase 1: 사주 궁합 계산 코어 엔진

- `[x]` 백엔드 프로젝트 초기화 (Node.js + TypeScript)
- `[x]` 만세력 오픈소스 라이브러리 연동 및 구조화 함수 작성
    - `[x]` 생년월일시 -> 천간/지지/오행/십성/신살 추출
- `[x]` 가중치 기반 연산 모듈 개발 (`src/algorithm/compatibility.ts`)
    - `[x]` 일간 상생/상극 연산 ($C_{il}$)
    - `[x]` 오행 조화도 및 결핍 보완 분석 ($C_{five}$)
    - `[x]` 지지 관계성 분석 ($C_{rel}$)
    - `[x]` 바이오리듬 연산 ($C_{bio}$)
- `[x]` 종합 점수 ($C_{total}$) 산출 로직 구현 및 가중치($w$) 테스트
- `[x]` 알고리즘 자동화 테스트 작성

## Phase 2: 엔터프라이즈 API 및 DB 구축
- `[x]` Prisma ORM 및 SQLite 데이터베이스 세팅
    - `[x]` User, SajuProfile, MatchHistory 스키마 정의
- `[x]` Express API 서버 프레임워크 구축
    - `[x]` `POST /api/users/register` 엔드포인트 구현 (유저 생성)
    - `[x]` `POST /api/match/calculate` 엔드포인트 구현 (궁합 엔진 연동)
- `[x]` 통합 테스트 및 API 응답 검증 (Postman/Curl/Fetch)
- `[x]` 인증 및 회원가입 API 구현 (본인인증 기반)
- `[x]` 유저 매칭 알고리즘 API 연동

## Phase 3: AI 에이전트 및 유료화 시스템 도입
- `[x]` 구독/결제 시스템 연동 (Mock API 기반 멤버십 업그레이드)
- `[x]` AI 운세/궁합 콘텐츠 생성 프롬프트 및 로직 개발
- `[x]` 일일 궁합 카드 생성 API 구현 (`GET /api/content/daily-card`)
- `[x]` 대운/연운 기반 캘린더 피드 생성 API 구현 (`GET /api/content/calendar`)

## Phase 4: 모바일 애플리케이션 (프론트엔드) 개발
- `[x]` Vite + React 프로젝트 초기화 및 라우터 설정
- `[x]` 바닐라 CSS 기반 프리미엄 다크 모드 디자인 시스템 구축
- `[x]` 온보딩 및 로그인 화면 구현 (사주 입력 포함)
- `[x]` 메인 대시보드 (오행 레이더 차트, 일일 운세 카드) 구현
- `[x]` 유저 매칭 및 프로필 스와이프 화면 구현
- `[x]` 백엔드 API 연동 통신 유틸리티 작성

## Phase 5: 프론트엔드-백엔드 실제 데이터 연동 (통합)
- `[x]` 로그인 화면 (`Login.tsx`) 연동 및 토큰 저장
- `[x]` 회원가입 화면 (`Register.tsx`) 연동 (사주 생성 포함)
- `[x]` 메인 대시보드 (`Dashboard.tsx`) 오늘의 운세/사주 데이터 연동
- `[x]` 운명의 카드 (`Match.tsx`) 추천 매칭 유저 API 연동

## Phase 6: 실제 AI(LLM) API 통신망 연동
- `[x]` OpenAI / Google Gemini API Key 환경변수 세팅
- `[x]` 타로 운세 카드 생성 프롬프트 실서비스 연동

## Phase 7: 실제 만세력 라이브러리 교체
- `[x]` 오픈소스 만세력 라이브러리(`manseryeok-js` 등) npm 설치 및 연동
- `[x]` 생년월일시 -> 사주 원국 추출 정확도 테스트

## Phase 8: 프로덕션 배포 세팅 (Launch)
- `[x]` 로컬 SQLite -> PostgreSQL 데이터베이스 마이그레이션 가이드
- `[x]` 백엔드 서버 클라우드 배포 (AWS/Render) 파일 세팅
- `[x]` 프론트엔드 Vercel/Netlify 호스팅 및 도메인 연결 파일 세팅
