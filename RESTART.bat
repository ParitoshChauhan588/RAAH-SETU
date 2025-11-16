@echo off
REM Comprehensive RAAH-SETU Restart Script

cd /d "%~dp0"

echo.
echo ================================================
echo RAAH-SETU: Restart Services
echo ================================================
echo.

REM Refresh PATH from registry
for /f "tokens=2,*" %%A in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path') do (
    set "SYSPATH=%%B"
)
for /f "tokens=2,*" %%A in ('reg query HKCU\Environment /v PATH') do (
    set "USERPATH=%%B"
)

set "PATH=%SYSPATH%;%USERPATH%;%ProgramFiles%\nodejs;C:\Program Files\Python311;C:\Program Files (x86)\Python311"

echo Checking for required tools...

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found in PATH
    echo PATH: %PATH%
    echo Please ensure Node.js is installed from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js OK: 
node --version

REM Check Python - try multiple methods
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Trying alternative Python paths...
    if exist "C:\Program Files\Python311\python.exe" (
        set "PYTHON=C:\Program Files\Python311\python.exe"
    ) else if exist "C:\Program Files (x86)\Python311\python.exe" (
        set "PYTHON=C:\Program Files (x86)\Python311\python.exe"
    ) else if exist "%USERPROFILE%\AppData\Local\Programs\Python\Python311\python.exe" (
        set "PYTHON=%USERPROFILE%\AppData\Local\Programs\Python\Python311\python.exe"
    ) else (
        echo ERROR: Python not found
        echo Please install Python from https://www.python.org/
        pause
        exit /b 1
    )
    echo Found Python at: !PYTHON!
) else (
    set "PYTHON=python"
    echo Python OK:
    python --version
)

REM Kill existing processes on ports
echo.
echo Stopping existing services...
for /f "tokens=5" %%A in ('netstat -ano ^| findstr :5000') do (
    echo Stopping process %%A
    taskkill /PID %%A /F /T >nul 2>&1
)
for /f "tokens=5" %%A in ('netstat -ano ^| findstr :8080') do (
    echo Stopping process %%A
    taskkill /PID %%A /F /T >nul 2>&1
)

timeout /t 2 /nobreak

echo.
echo ================================================
echo Starting Services
echo ================================================
echo.

REM Start Backend
echo Starting Backend...
start "RAAH-SETU Backend Server" cmd /k "cd /d %CD%\Backend && !PYTHON! api_enhanced.py"

timeout /t 3

REM Start Frontend
echo Starting Frontend...
start "RAAH-SETU Frontend Server" cmd /k "cd /d %CD% && npm run dev"

timeout /t 5

REM Open browser
echo Opening application...
start http://localhost:8080

echo.
echo ================================================
echo Services Restarted!
echo ================================================
echo Backend:  http://127.0.0.1:5000
echo Frontend: http://localhost:8080
echo.
echo Check the terminal windows for any errors
pause
