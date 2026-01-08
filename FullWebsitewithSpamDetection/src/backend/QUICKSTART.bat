@echo off
echo ============================================================
echo   EMAIL SPAM DETECTION - QUICK START
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

echo [1/4] Checking Python installation...
python --version
echo.

REM Check if dataset exists
if not exist "spam mail.csv" (
    echo ERROR: Dataset not found!
    echo Please place 'spam mail.csv' in this folder
    echo.
    pause
    exit /b 1
)

echo [2/4] Dataset found: spam mail.csv
echo.

REM Install dependencies
echo [3/4] Installing dependencies...
echo This may take a few minutes...
echo.
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

REM Train models
echo [4/4] Training models...
echo This will take 10-30 seconds...
echo.
python train_model.py
if errorlevel 1 (
    echo ERROR: Training failed
    pause
    exit /b 1
)
echo.

echo ============================================================
echo   SETUP COMPLETE!
echo ============================================================
echo.
echo You can now start the API server by running:
echo   python app.py
echo.
echo Or simply double-click: START_SERVER.bat
echo.
pause
