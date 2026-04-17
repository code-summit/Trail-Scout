@echo off
REM Quick Start Script for Trail Scout (Windows)

echo 🥾 Welcome to Trail Scout Setup!
echo ==================================

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% found

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm run install-all

REM Create .env file if it doesn't exist
if not exist "backend\.env" (
    echo.
    echo ⚙️  Creating .env file...
    copy backend\.env.example backend\.env
    echo ⚠️  Please update backend\.env with your MongoDB URI and other settings
)

echo.
echo ✅ Setup complete!
echo.
echo To start development:
echo   npm run dev
echo.
echo Or use Docker:
echo   docker-compose up
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
