async function runTest() {
  console.log("1. 서버 헬스체크 확인 중...");
  const healthRes = await fetch("http://localhost:3000/health");
  const health = await healthRes.json();
  console.log("   결과:", health.message, "\n");

  console.log("2. 남자 유저 생성 및 사주 프로필 등록 (1995-05-15)...");
  const resA = await fetch("http://localhost:3000/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "이연희",
      gender: "M",
      birthDateString: "1995-05-15T12:00:00"
    })
  });
  const dataA = await resA.json();
  const userAId = dataA.user.id;
  console.log(`   생성 완료! User A ID: ${userAId}`);
  console.log(`   사주 원국: ${dataA.user.sajuProfile.ilgan} 일간\n`);

  console.log("3. 여자 유저 생성 및 사주 프로필 등록 (1996-08-20)...");
  const resB = await fetch("http://localhost:3000/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "홍길동",
      gender: "F",
      birthDateString: "1996-08-20T15:00:00"
    })
  });
  const dataB = await resB.json();
  const userBId = dataB.user.id;
  console.log(`   생성 완료! User B ID: ${userBId}\n`);

  console.log("4. 대망의 두 사람 매칭 궁합 점수 산출...");
  const resMatch = await fetch("http://localhost:3000/api/match/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userAId: userAId,
      userBId: userBId
    })
  });
  const matchData = await resMatch.json();

  console.log("   [궁합 결과]");
  console.log(`   종합 점수: ${matchData.score}점`);
  console.log(`   - 일간 점수: ${matchData.details.ilganScore}점`);
  console.log(`   - 오행 보완도: ${matchData.details.fiveElementsScore}점`);
  console.log(`   - 지지 관계: ${matchData.details.jijiScore}점`);
  console.log(`   - 바이오리듬: ${matchData.details.biorhythmScore}점`);
  console.log(`   (매칭 기록 DB 저장 완료, ID: ${matchData.historyId})\n`);
  
  console.log("=== 통합 테스트 통과 완료 ===");
}

runTest().catch(console.error);
