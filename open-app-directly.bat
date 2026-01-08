@echo off
setlocal enabledelayedexpansion
title CRM Application Launcher

echo.
echo ==========================================
echo    LAUNCHING YOUR CRM APPLICATION
echo ==========================================
echo.

REM Resolve paths
set "ROOT=%~dp0"
set "DIST=%ROOT%dist"
set "INDEX=%DIST%\index.html"

echo 🔍 Checking for application files...

if not exist "%INDEX%" (
    echo ❌ Error: App files not found!
    echo    Looking for: %INDEX%
    echo.
    echo 🔧 Run this first:
    echo    npm install
    echo    npm run build
    echo.
    pause
    exit /b 1
)

echo ✅ App files found!
echo 📁 Location: %INDEX%
echo.

REM Try to use a tiny static server so React Router + fetch work correctly
echo 🌐 Starting a local server for the built app...
echo.

EM Prefer npx serve if available
where npx >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npx not found. Please install Node.js.
    pause
    exit /b 1
)

REM Pick a port (5173 is often used by Vite; choose 5174 by default)
set "PORT=5174"

echo 🚀 Serving dist on http://localhost:%PORT%
echo.

REM Start server in a new window so this script can continue
start "CRM Static Server" cmd /c "npx --yes serve -s "%DIST%" -l %PORT%"

REM Give server a moment to start
timeout /t 2 /nobreak >nul

echo ✅ Opening browser...
start "" "http://localhost:%PORT%"

echo.
echo 📝 If you see a blank page, verify build output and console errors.
echo.
pause
endlocal