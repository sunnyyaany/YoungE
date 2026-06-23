import { calculateTotalCompatibility } from './compatibility';
import { extractSaju } from './manseyeok';

describe('사주 궁합 엔진 (Phase 1) 테스트', () => {
  it('두 유저의 궁합 점수가 0~100 사이로 계산되어야 한다', () => {
    const userABirth = new Date('1995-05-15T12:00:00');
    const userBBirth = new Date('1996-08-20T15:00:00');

    // 1. 만세력 데이터 추출
    const userASaju = extractSaju(userABirth, 'M');
    const userBSaju = extractSaju(userBBirth, 'F');

    // 2. 궁합 계산
    const result = calculateTotalCompatibility(userASaju, userBSaju);

    // 3. 점수 검증
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(100);
    
    // 가중치별 세부 점수 출력 확인
    console.log(`[종합 궁합 점수]: ${result.totalScore}점`);
    console.log(`- 일간 궁합: ${result.details.ilganScore}점`);
    console.log(`- 오행 조화도: ${result.details.fiveElementsScore}점`);
    console.log(`- 지지 관계: ${result.details.jijiScore}점`);
    console.log(`- 바이오리듬 일치도: ${result.details.biorhythmScore}점`);
  });
});
