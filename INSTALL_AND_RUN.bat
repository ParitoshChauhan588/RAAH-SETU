@echo off
REM RAAH-SETU Project - Setup and Run Script for Windows
REM This batch script installs dependencies and runs the project

setlocal enabledelayedexpansion

echo.
echo === RAAH-SETU Project Setup and Run ===
echo.
echo Step 1: Checking for Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python not found. Installing...
    powershell -Command "Start-Process 'https://www.python.org/downloads/' -UseShellExecute"
    echo Please install Python 3.11+ and add to PATH
    pause
    exit /b 1
)
echo Python is installed

echo.
echo Step 2: Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js not found. Installing...
    powershell -Command "Start-Process 'https://nodejs.org/' -UseShellExecute"
    echo Please install Node.js and npm
    pause
    exit /b 1
)
echo Node.js is installed
npm --version >nul 2>&1

echo.
echo Step 3: Installing Python dependencies...
cd Backend
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Failed to install Python dependencies
    pause
    exit /b 1
)
cd ..
echo Python dependencies installed

echo.
echo Step 4: Installing npm dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install npm dependencies
    pause
    exit /b 1
)
echo npm dependencies installed

echo.
echo Step 5: Setting up database...
cd Backend
python create_schema.py
cd ..

echo.
echo === All dependencies installed! ===
echo.
echo Step 6: Launching services...
echo.
echo Opening 3 terminals for Backend, Frontend, and Logs...
echo.

REM Start Backend server
start "RAAH-SETU Backend" cmd /k "cd Backend && python api_enhanced.py"

REM Wait a bit for backend to start
timeout /t 2 /nobreak

REM Start Frontend dev server
start "RAAH-SETU Frontend" cmd /k "npm run dev"

REM Wait a bit for frontend to start
timeout /t 3 /nobreak

REM Open browser
powershell -Command "Start-Process 'http://localhost:8080'"

echo.
echo === Services Started ===
echo.
echo Backend: http://127.0.0.1:5000
echo Frontend: http://localhost:8080
echo.
echo Check the opened terminal windows for logs
echo Press any key to exit this setup window...
pause
