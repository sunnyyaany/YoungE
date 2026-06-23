$ErrorActionPreference = "Stop"

Write-Host "1. 서버 헬스체크 확인 중..."
$health = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get
Write-Host "   결과: $($health.message)"
Write-Host ""

Write-Host "2. 남자 유저 생성 및 사주 프로필 등록 (1995-05-15)..."
$bodyA = @{
    name = "이연희"
    gender = "M"
    birthDateString = "1995-05-15T12:00:00"
} | ConvertTo-Json
$resA = Invoke-RestMethod -Uri "http://localhost:3000/api/users/register" -Method Post -Body $bodyA -ContentType "application/json"
$userAId = $resA.user.id
Write-Host "   생성 완료! User A ID: $userAId"
Write-Host "   사주 원국: $($resA.user.sajuProfile.ilgan) 일간"
Write-Host ""

Write-Host "3. 여자 유저 생성 및 사주 프로필 등록 (1996-08-20)..."
$bodyB = @{
    name = "홍길동"
    gender = "F"
    birthDateString = "1996-08-20T15:00:00"
} | ConvertTo-Json
$resB = Invoke-RestMethod -Uri "http://localhost:3000/api/users/register" -Method Post -Body $bodyB -ContentType "application/json"
$userBId = $resB.user.id
Write-Host "   생성 완료! User B ID: $userBId"
Write-Host ""

Write-Host "4. 대망의 두 사람 매칭 궁합 점수 산출..."
$bodyMatch = @{
    userAId = $userAId
    userBId = $userBId
} | ConvertTo-Json
$resMatch = Invoke-RestMethod -Uri "http://localhost:3000/api/match/calculate" -Method Post -Body $bodyMatch -ContentType "application/json"

Write-Host "   [궁합 결과]"
Write-Host "   종합 점수: $($resMatch.score)점"
Write-Host "   - 일간 점수: $($resMatch.details.ilganScore)점"
Write-Host "   - 오행 보완도: $($resMatch.details.fiveElementsScore)점"
Write-Host "   - 지지 관계: $($resMatch.details.jijiScore)점"
Write-Host "   - 바이오리듬: $($resMatch.details.biorhythmScore)점"
Write-Host "   (매칭 기록 DB 저장 완료, ID: $($resMatch.historyId))"
Write-Host ""
Write-Host "=== 통합 테스트 통과 완료 ==="
