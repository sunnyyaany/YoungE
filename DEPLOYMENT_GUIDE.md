# 연이아씨 (YoungE) 프로덕션 배포 가이드 🚀

로컬 개발 환경에서 완성된 연이아씨 플랫폼을 실제 인터넷 상에 런칭하기 위한 가이드입니다. 
백엔드는 **Render**, 프론트엔드는 **Vercel**을 사용하여 빠르고 무료로 배포할 수 있도록 설정 파일이 모두 준비되어 있습니다.

## 1. 백엔드 배포 (Render.com)

Render는 클라우드 서버와 PostgreSQL 데이터베이스를 매우 쉽게 배포할 수 있는 플랫폼입니다. `backend/render.yaml` 파일과 `backend/Dockerfile`이 이미 설정되어 있습니다.

### 준비 사항
1. [Render.com](https://render.com) 에 회원가입 후 로그인합니다.
2. 현재 작업 중인 `YoungE` 폴더를 GitHub 레포지토리로 푸시합니다.

### 배포 방법
1. Render 대시보드에서 **New > Blueprint**를 클릭합니다.
2. 연결된 GitHub 계정에서 푸시한 `YoungE` 레포지토리를 선택합니다.
3. Render가 프로젝트 내부의 `render.yaml`을 자동 인식하여 아래 2가지를 자동 생성합니다:
   - **PostgreSQL Database** (`yeoniassi-db`)
   - **Web Service** (`yeoniassi-api`)
4. 배포 중 또는 배포 완료 후, 웹 서비스 환경 변수(`Environment Variables`) 설정 창에서 다음 변수들을 직접 입력합니다:
   - `GEMINI_API_KEY`: 발급받으신 Gemini API 키
   - `JWT_SECRET`: 강력한 임의의 문자열 (예: `my-super-secret-key-123!`)
5. 배포가 완료되면 Render에서 제공하는 백엔드 URL (예: `https://yeoniassi-api.onrender.com`)을 복사합니다.

---

## 2. 프론트엔드 배포 (Vercel)

Vercel은 React(Vite) 앱 배포에 가장 최적화된 플랫폼입니다. `frontend/vercel.json` 파일에 SPA(Single Page Application) 라우팅 설정이 완료되어 있습니다.

### 준비 사항
1. [Vercel.com](https://vercel.com) 에 회원가입 후 로그인합니다.

### 배포 방법
1. Vercel 대시보드에서 **Add New > Project**를 클릭합니다.
2. `YoungE` 레포지토리를 가져옵니다(Import).
3. **Framework Preset**은 `Vite`로 자동 인식됩니다.
4. **Root Directory** 우측의 Edit 버튼을 눌러 `frontend` 폴더를 선택합니다.
5. **Environment Variables (환경 변수)** 설정창을 열고 다음 변수를 입력합니다:
   - **Name**: `VITE_API_URL`
   - **Value**: Render 백엔드 주소 + `/api` (예: `https://yeoniassi-api.onrender.com/api`)
6. `Deploy` 버튼을 누르면 1분 내로 배포가 완료되고 호스팅 URL이 제공됩니다!

🎉 **이제 연이아씨가 전 세계 어디서든 스마트폰으로 접속 가능해졌습니다!**
