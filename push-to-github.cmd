@echo off
setlocal

set "GIT=C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
set "REPO=C:\Users\user\Documents\Codex\2026-07-02\files-mentioned-by-the-user-google\outputs\yul-story-game"
set "SAFE_REPO=C:/Users/user/Documents/Codex/2026-07-02/files-mentioned-by-the-user-google/outputs/yul-story-game"

cd /d "%REPO%"
echo Uploading this project to GitHub...
echo.

"%GIT%" -c safe.directory="%SAFE_REPO%" push -u origin main

if errorlevel 1 (
  echo.
  echo Upload failed.
  echo If the error mentions "shorttrackarchive", remove the saved GitHub credential:
  echo Windows Credential Manager - Windows Credentials - github.com or git:https://github.com
  echo Then run this file again and log in as dmms6696.
  pause
  exit /b 1
)

echo.
echo Upload complete.
pause
