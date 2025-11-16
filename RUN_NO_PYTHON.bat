@echo off
REM RAAH-SETU: Run without Python
REM Uses Node.js Express backend instead

cd /d "%~dp0"

echo.
echo ================================================
echo RAAH-SETU: Run Without Python
echo ================================================
echo.

REM Refresh PATH for Node.js
set "PATH=%ProgramFiles%\nodejs;%PATH%"
set "PATH=%APPDATA%\npm;%PATH%"

echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found
    echo Please install from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js: OK

echo Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm not found
    pause
    exit /b 1
)
echo npm: OK

echo.
echo Installing backend dependencies...
npm install express cors
if %errorlevel% neq 0 (
    echo Warning: npm install had issues, continuing anyway...
)

echo.
echo ================================================
echo Starting Services
echo ================================================
echo.

REM Start Node.js backend
echo Starting Node.js Backend on port 5000...
start "RAAH-SETU Backend (Node.js)" cmd /k "node server.js"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start React frontend
echo Starting React Frontend on port 8080...
start "RAAH-SETU Frontend" cmd /k "npm run dev"

REM Wait for frontend
timeout /t 5 /nobreak

REM Open browser
echo Opening application...
start http://localhost:8080

echo.
echo ================================================
echo Services Started!
echo ================================================
echo.
echo Backend:  http://127.0.0.1:5000
echo Frontend: http://localhost:8080
echo.
echo No Python needed! Running on pure Node.js
echo.
pause
