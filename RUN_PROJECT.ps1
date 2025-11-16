# RAAH-SETU Project - Launch All Services
# This script starts Backend, Frontend, and Database services

Write-Host "=== RAAH-SETU Project Launcher ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will start:" -ForegroundColor Yellow
Write-Host "  1. MySQL Database (if needed)"
Write-Host "  2. Python Flask Backend (port 5000)"
Write-Host "  3. React Frontend dev server (port 8080)"
Write-Host ""
Write-Host "Press Ctrl+C in any terminal to stop a service" -ForegroundColor Green
Write-Host ""

# Refresh environment
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Check dependencies
Write-Host "Checking dependencies..." -ForegroundColor Cyan
$pythonOk = $false
$npmOk = $false

try {
    $pythonVersion = & python --version 2>&1
    Write-Host "✓ Python: $pythonVersion" -ForegroundColor Green
    $pythonOk = $true
}
catch {
    Write-Host "✗ Python not found. Please run INSTALL_DEPENDENCIES.ps1" -ForegroundColor Red
}

try {
    $npmVersion = & npm --version 2>&1
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
    $nodeVersion = & node --version 2>&1
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
    $npmOk = $true
}
catch {
    Write-Host "✗ npm/Node.js not found. Please run INSTALL_DEPENDENCIES.ps1" -ForegroundColor Red
}

if (-not $pythonOk -or -not $npmOk) {
    Write-Host ""
    Write-Host "Missing dependencies! Please run: .\INSTALL_DEPENDENCIES.ps1" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "All dependencies found! Launching services..." -ForegroundColor Green
Write-Host ""

# Get script location
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Step 1: Database Setup (MySQL)
Write-Host "--- Database Setup ---" -ForegroundColor Cyan
Write-Host "Checking MySQL Server..." -ForegroundColor Yellow

try {
    # Try to connect to MySQL
    $connectionTest = & mysql -h localhost -u root -e "SELECT 1" 2>&1 | Out-String
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ MySQL Server is running" -ForegroundColor Green
        
        # Create database and schema
        Write-Host "Setting up database schema..." -ForegroundColor Yellow
        Push-Location "$scriptPath\Backend"
        & python create_schema.py
        Pop-Location
        Write-Host "✓ Database schema created/verified" -ForegroundColor Green
    }
    else {
        Write-Host "⚠ MySQL Server not accessible. Some features may not work." -ForegroundColor Yellow
        Write-Host "  To fix: Ensure MySQL is installed and running" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "⚠ MySQL Server not found. Installing would require manual setup." -ForegroundColor Yellow
    Write-Host "  If you have MySQL installed, ensure it's running on localhost:3306" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "--- Starting Services ---" -ForegroundColor Cyan
Write-Host ""

# Step 2: Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Green
Write-Host "Backend: http://127.0.0.1:5000" -ForegroundColor Cyan
Push-Location "$scriptPath\Backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\Backend'; python api_enhanced.py"
Pop-Location
Start-Sleep -Seconds 2

# Step 3: Start Frontend
Write-Host "Starting Frontend Dev Server..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:8080" -ForegroundColor Cyan
Push-Location "$scriptPath"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath'; npm run dev"
Pop-Location
Start-Sleep -Seconds 2

# Step 4: Open browser
Write-Host ""
Write-Host "--- Opening Application ---" -ForegroundColor Cyan
Start-Sleep -Seconds 3
try {
    Start-Process "http://localhost:8080"
    Write-Host "✓ Opening browser to http://localhost:8080" -ForegroundColor Green
}
catch {
    Write-Host "Please open http://localhost:8080 in your browser" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Services Started ===" -ForegroundColor Green
Write-Host ""
Write-Host "Backend API: http://127.0.0.1:5000" -ForegroundColor Cyan
Write-Host "Frontend App: http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop services, close the terminal windows or press Ctrl+C" -ForegroundColor Yellow
Write-Host ""
Write-Host "Tip: Check the Backend and Frontend terminal windows for logs" -ForegroundColor Yellow
Write-Host ""
