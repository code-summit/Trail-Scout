@echo off
REM Voice Setup Script for Trail Scout (Windows)

echo 🎤 Trail Scout Voice Agent Setup
echo ==================================
echo.

REM Check if running in backend directory
if not exist "backend\.env" (
    echo ⚠️  backend\.env not found
    echo Creating from template...
    copy backend\.env.example backend\.env
    echo ✅ Created backend\.env
    echo.
)

echo To set up voice agent:
echo 1. Create account at vocalbridgeai.com
echo 2. Create a 'Trail Scout' agent
echo 3. Copy your API key from the dashboard
echo.

setlocal enabledelayedexpansion
set /p api_key="Enter your Vocal Bridge API key (vb_...): "

if not "!api_key!"=="" (
    REM Check if key already exists
    findstr /M "VOCAL_BRIDGE_API_KEY" backend\.env >nul
    if errorlevel 1 (
        echo VOCAL_BRIDGE_API_KEY=!api_key!>> backend\.env
        echo ✅ Added VOCAL_BRIDGE_API_KEY to backend\.env
    ) else (
        REM Replace existing key
        powershell -Command "(Get-Content backend\.env) -replace 'VOCAL_BRIDGE_API_KEY=.*', 'VOCAL_BRIDGE_API_KEY=!api_key!' | Set-Content backend\.env"
        echo ✅ Updated VOCAL_BRIDGE_API_KEY in backend\.env
    )
) else (
    echo ❌ No API key provided
    exit /b 1
)

echo.
echo 🚀 Voice agent is ready!
echo.
echo Next steps:
echo 1. npm run dev
echo 2. Open http://localhost:3000
echo 3. Click 'Start Voice Chat' and grant microphone permission
echo 4. Say: 'Hello, what trails would you recommend?'
echo.
