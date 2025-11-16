@echo off
REM Auto-install Python and Node.js, then run project

echo ======================================
echo RAAH-SETU: Automatic Installation
echo ======================================
echo.

REM Download and install Python
echo Installing Python 3.11...
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe' -OutFile '%TEMP%\python-installer.exe'; Start-Process '%TEMP%\python-installer.exe' -ArgumentList '/quiet InstallAllUsers=1 PrependPath=1' -Wait}"

REM Download and install Node.js
echo Installing Node.js...
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi' -OutFile '%TEMP%\node-installer.msi'; Start-Process msiexec -ArgumentList '/i %TEMP%\node-installer.msi /quiet' -Wait}"

REM Refresh environment
echo Refreshing environment...
setlocal enabledelayedexpansion
for /f "tokens=2,*" %%A in ('reg query HKCU\Environment /v PATH') do set "USERPATH=%%B"
for /f "tokens=2,*" %%A in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path') do set "SYSPATH=%%B"
set "PATH=!USERPATH!;!SYSPATH!"

REM Verify installation
echo.
echo Verifying installations...
python --version
node --version
npm --version

REM Install dependencies
echo.
echo Installing project dependencies...
cd "%~dp0"
call pip install -r Backend\requirements.txt
call npm install

REM Create database
echo.
echo Setting up database...
python Backend\create_schema.py

REM Start services
echo.
echo ======================================
echo Starting RAAH-SETU Services
echo ======================================
echo.

start "RAAH-SETU Backend" cmd /k "cd Backend && python api_enhanced.py"
timeout /t 2

start "RAAH-SETU Frontend" cmd /k "npm run dev"
timeout /t 3

echo Opening browser...
start http://localhost:8080

echo.
echo ======================================
echo Services started!
echo Backend: http://127.0.0.1:5000
echo Frontend: http://localhost:8080
echo ======================================
echo.

pause
