@echo off
REM Install Python 3.11 directly

echo Installing Python 3.11...
echo This will take 2-3 minutes...

REM Download Python installer
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe' -OutFile '%TEMP%\python-installer.exe'; Write-Host 'Downloaded Python installer'}"

REM Run installer with parameters for silent installation
"%TEMP%\python-installer.exe" /quiet InstallAllUsers=1 PrependPath=1

echo Python installation complete!
echo Refreshing PATH...

REM Refresh environment variables from registry
for /f "tokens=2,*" %%A in ('reg query HKCU\Environment /v PATH') do set "USERPATH=%%B"
for /f "tokens=2,*" %%A in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path') do set "SYSPATH=%%B"

set "PATH=%SYSPATH%;%USERPATH%"

REM Verify
echo.
echo Verifying Python installation...
python --version

echo Installation script complete!
pause
