import { calculateFourPillars } from 'manseryeok';
import { SajuData } from './compatibility';

/**
 * 만세력 변환 어댑터 (manseryeok 라이브러리 실제 연동)
 * 생년월일시(Date)를 입력받아 정확한 사주 원국 데이터(SajuData)를 반환합니다.
 */
export function extractSaju(birthDate: Date, gender: 'M' | 'F'): SajuData {
  const birthInfo = {
    year: birthDate.getFullYear(),
    month: birthDate.getMonth() + 1,
    day: birthDate.getDate(),
    hour: birthDate.getHours(),
    minute: birthDate.getMinutes(),
    gender: gender === 'M' ? 'male' as const : 'female' as const,
    // 진태양시 및 야자시 보정 등 정밀 옵션 추가 가능
  };

  const fourPillars = calculateFourPillars(birthInfo);

  const elements = [
    fourPillars.yearElement.stem,
    fourPillars.yearElement.branch,
    fourPillars.monthElement.stem,
    fourPillars.monthElement.branch,
    fourPillars.dayElement.stem,
    fourPillars.dayElement.branch,
    fourPillars.hourElement.stem,
    fourPillars.hourElement.branch,
  ];

  const count = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
  for (const el of elements) {
    if (el in count) {
      count[el as keyof typeof count]++;
    }
  }

  return {
    ilgan: fourPillars.day.heavenlyStem,
    jiji: [
      fourPillars.year.earthlyBranch,
      fourPillars.month.earthlyBranch,
      fourPillars.day.earthlyBranch,
      fourPillars.hour.earthlyBranch,
    ],
    fiveElementsCount: count,
    birthDate: birthDate,
  };
}
