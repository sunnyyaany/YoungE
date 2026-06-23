/**
 * 연이아씨 API 연동 유틸리티
 * 백엔드 서버와의 모든 통신을 담당합니다.
 */

const API_BASE_URL = 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  data?: any;
}

/**
 * 기본 Fetch Wrapper 함수
 * 로컬 스토리지에서 토큰을 가져와 Authorization 헤더에 자동 추가합니다.
 */
async function fetchClient(endpoint: string, { data, headers: customHeaders, ...customConfig }: RequestOptions = {}) {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': data ? 'application/json' : '',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...customHeaders,
    },
    ...customConfig,
  };

  // Content-Type이 빈 문자열이면 제거 (FormData 등 사용할 때 대비)
  if ((config.headers as Record<string, string>)['Content-Type'] === '') {
    delete (config.headers as Record<string, string>)['Content-Type'];
  }

  return window.fetch(`${API_BASE_URL}${endpoint}`, config)
    .then(async response => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const responseData = isJson ? await response.json() : null;

      if (response.ok) {
        return responseData;
      }

      // 에러 처리
      const errorMessage = responseData?.message || response.statusText;
      return Promise.reject(new Error(errorMessage));
    });
}

export const authAPI = {
  // 로그인
  login: (phone: string) => fetchClient('/auth/login', { data: { phone } }),
  // 회원가입 (사주 정보 포함)
  register: (userData: any) => fetchClient('/users/register', { data: userData }),
};

export const matchAPI = {
  // 운명의 카드 (추천 매치 리스트)
  getRecommendations: () => fetchClient('/match/recommend'),
  // 특정 유저와의 상세 궁합 계산
  calculateMatch: (targetUserId: string) => fetchClient('/match/calculate', { data: { targetUserId } }),
};

export const contentAPI = {
  // 오늘의 운명 카드 (일일 운세)
  getDailyCard: () => fetchClient('/content/daily-card'),
  // 운세 캘린더 피드
  getCalendar: () => fetchClient('/content/calendar'),
};

export const paymentAPI = {
  // 에로스 채널 등 프리미엄 멤버십 구독 (Mock 결제)
  subscribe: (tier: string) => fetchClient('/payment/subscribe', { data: { tier } }),
};
