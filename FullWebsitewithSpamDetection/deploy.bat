@echo off
REM Deployment script for Email Spam Detection (Windows)
REM Usage: deploy.bat [docker|manual]

setlocal enabledelayedexpansion

set DEPLOYMENT_TYPE=%1
if "%DEPLOYMENT_TYPE%"=="" set DEPLOYMENT_TYPE=docker

echo ==========================================
echo Email Spam Detection - Deployment Script
echo ==========================================
echo.

if "%DEPLOYMENT_TYPE%"=="docker" (
    echo 🐳 Deploying with Docker...
    
    REM Check if Docker is installed
    where docker >nul 2>&1
    if errorlevel 1 (
        echo ❌ Docker is not installed. Please install Docker first.
        exit /b 1
    )
    
    REM Check if Docker Compose is installed
    where docker-compose >nul 2>&1
    if errorlevel 1 (
        echo ❌ Docker Compose is not installed. Please install Docker Compose first.
        exit /b 1
    )
    
    REM Check if dataset exists
    if not exist "spam mail.csv" (
        echo ⚠️  Warning: spam mail.csv not found in project root.
        echo    Models will need to be trained manually or dataset uploaded.
    )
    
    REM Build and start containers
    echo 📦 Building and starting containers...
    docker-compose up --build -d
    
    echo.
    echo ✅ Deployment complete!
    echo.
    echo Frontend: http://localhost
    echo Backend API: http://localhost:5000
    echo Health Check: http://localhost:5000/api/health
    echo.
    echo View logs: docker-compose logs -f
    echo Stop services: docker-compose down
    
) else if "%DEPLOYMENT_TYPE%"=="manual" (
    echo 🔧 Manual deployment setup...
    
    REM Backend setup
    echo.
    echo 📦 Setting up backend...
    cd src\backend
    
    if not exist "venv" (
        echo Creating Python virtual environment...
        python -m venv venv
    )
    
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
    
    echo Installing dependencies...
    pip install -r requirements.txt
    pip install gunicorn
    
    if exist "spam mail.csv" (
        echo Training models...
        python train_model.py
    ) else (
        echo ⚠️  Warning: spam mail.csv not found. Models may not be trained.
    )
    
    echo.
    echo ✅ Backend setup complete!
    echo Start backend: cd src\backend ^&^& gunicorn app:app --config gunicorn_config.py
    
    REM Frontend setup
    echo.
    echo 📦 Setting up frontend...
    cd ..\..
    
    if not exist "node_modules" (
        echo Installing dependencies...
        call npm install
    )
    
    echo Building frontend...
    call npm run build
    
    echo.
    echo ✅ Frontend setup complete!
    echo Serve frontend: cd build ^&^& python -m http.server 8000
    
) else (
    echo ❌ Invalid deployment type: %DEPLOYMENT_TYPE%
    echo Usage: deploy.bat [docker^|manual]
    exit /b 1
)

endlocal

