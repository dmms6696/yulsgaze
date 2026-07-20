$Git = "C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
$Repo = "C:\Users\user\Documents\Codex\2026-07-02\files-mentioned-by-the-user-google\outputs\yul-story-game"
$SafeRepo = "C:/Users/user/Documents/Codex/2026-07-02/files-mentioned-by-the-user-google/outputs/yul-story-game"

Set-Location $Repo

Write-Host ""
Write-Host "율의 시선 게임 프로젝트를 GitHub에 올립니다." -ForegroundColor Cyan
Write-Host "GitHub 로그인 창이 뜨면 dmms6696 계정으로 로그인하세요." -ForegroundColor Yellow
Write-Host ""

& $Git -c safe.directory=$SafeRepo push -u origin main

if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "push가 실패했습니다." -ForegroundColor Red
  Write-Host "오류에 shorttrackarchive 또는 permission denied가 보이면, 현재 컴퓨터가 다른 GitHub 계정으로 로그인된 상태입니다." -ForegroundColor Yellow
  Write-Host ""
  Write-Host "해결 방법:" -ForegroundColor Cyan
  Write-Host "1. Windows 검색에서 '자격 증명 관리자'를 엽니다."
  Write-Host "2. 'Windows 자격 증명'으로 들어갑니다."
  Write-Host "3. github.com 또는 git:https://github.com 항목을 삭제합니다."
  Write-Host "4. 이 스크립트를 다시 실행하고 dmms6696 계정으로 로그인합니다."
  Write-Host ""
}
