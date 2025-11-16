@echo off
REM RAAH-SETU Project Runner
REM This script starts all services after installing dependencies

cd /d "%~dp0"

echo.
echo ================================================
echo RAAH-SETU: Starting Project
echo ================================================
echo.

REM Refresh PATH
set "PATH=%ProgramFiles%\nodejs;%PATH%"
set "PATH=%LocalAppData%\Microsoft\WindowsApps;%PATH%"

REM Check installations
echo Checking dependencies...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found
    echo Please visit: https://nodejs.org/
    pause
    exit /b 1
)

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm not found
    pause
    exit /b 1
)

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Note: Python not in PATH, will use local installation
)

echo Node.js version:
node --version

echo npm version:
npm --version

echo.
echo ================================================
echo Installing Dependencies
echo ================================================
echo.

REM Install npm packages if not already installed
if not exist "node_modules\" (
    echo Installing npm dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo Failed to install npm dependencies
        pause
        exit /b 1
    )
) else (
    echo npm dependencies already installed
)

REM Install Python packages
echo.
echo Installing Python dependencies...
cd Backend
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install Python dependencies
    cd ..
    pause
    exit /b 1
)

REM Create database
echo.
echo Setting up database...
python create_schema.py
cd ..

echo.
echo ================================================
echo Starting Services
echo ================================================
echo.

REM Start Backend
echo Starting Backend Server...
start "RAAH-SETU Backend" cmd /k "cd Backend && python api_enhanced.py"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start Frontend
echo Starting Frontend Dev Server...
start "RAAH-SETU Frontend" cmd /k "npm run dev"

REM Wait for frontend to start
timeout /t 4 /nobreak

REM Open browser
echo.
echo Opening application in browser...
start http://localhost:8080

echo.
echo ================================================
echo SUCCESS! Services are running
echo ================================================
echo.
echo Backend API:  http://127.0.0.1:5000
echo Frontend App: http://localhost:8080
echo.
echo Press any key to close this window...
pause
