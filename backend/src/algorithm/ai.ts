import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateDailyCard(sajuProfile: any, name: string): Promise<string> {
  const prompt = `
당신은 '연이아씨'라는 현대적이고 세련된 사주/명리 기반 데이팅 플랫폼의 전속 타로/사주 마스터입니다.
사용자 이름: ${name}
사주 원국 데이터:
- 일간: ${sajuProfile.ilgan}
- 지지: ${sajuProfile.jiji}
- 오행 분포: ${sajuProfile.fiveElementsCount}

위 사주 데이터를 바탕으로 오늘 하루의 연애운과 인간관계 운세를 3~4문장으로 친근하고 부드러운 '해요체'로 작성해주세요.
명리학 용어(예: 겁재, 편관 등)를 너무 어렵지 않게 조금만 섞어서 신뢰감을 주되, 전반적인 분위기는 긍정적이고 트렌디하게 만들어주세요.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 300,
      }
    });
    
    return response.text || '오늘의 운세를 불러오는데 실패했습니다.';
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('AI 카드 생성 중 오류가 발생했습니다.');
  }
}

export async function generateCalendarFeed(sajuProfile: any, name: string): Promise<string> {
  const prompt = `
당신은 '연이아씨' 플랫폼의 전속 사주 마스터입니다.
사용자 이름: ${name}
사주 원국 데이터:
- 일간: ${sajuProfile.ilgan}
- 오행 분포: ${sajuProfile.fiveElementsCount}

이번 달의 전반적인 연애 흐름(대운/연운을 가정한 월간 운세)과, 어떤 성향의 이성을 만나면 좋은지 조언을 3문장으로 작성해주세요.
결정적인 만남이 언제쯤 있을지 가벼운 기대감을 주는 멘트로 마무리해주세요. (해요체 사용)
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 300,
      }
    });
    
    return response.text || '월간 운세를 불러오는데 실패했습니다.';
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('AI 캘린더 피드 생성 중 오류가 발생했습니다.');
  }
}
