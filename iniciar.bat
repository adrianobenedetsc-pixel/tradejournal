@echo off
cd /d "%~dp0"
start "" cmd /c "timeout /t 5 >nul & start http://localhost:3000/"
npm run dev