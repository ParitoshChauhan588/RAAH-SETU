# RAAH-SETU Project - Automated Dependency Installation
# This script installs Python 3.11, Node.js, and npm on Windows

Write-Host "=== RAAH-SETU Project Setup ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will install:" -ForegroundColor Yellow
Write-Host "  1. Python 3.11"
Write-Host "  2. Node.js (includes npm)"
Write-Host "  3. MySQL Server (optional - you may already have it)"
Write-Host ""

# Check if running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "WARNING: This script should be run as Administrator for best results." -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
}

# Try winget first (requires Windows 11 or newer with App Installer)
function Install-WithWinget {
    param([string]$PackageId, [string]$PackageName)
    
    Write-Host "Attempting to install $PackageName with winget..." -ForegroundColor Green
    try {
        & winget install --id $PackageId --accept-package-agreements --accept-source-agreements -q 2>&1 | Out-Null
        Write-Host "✓ $PackageName installed successfully" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Failed to install $PackageName with winget" -ForegroundColor Red
        return $false
    }
}

# Function to download and run installers
function Download-And-Install {
    param([string]$Url, [string]$FileName, [string]$Arguments)
    
    $downloadPath = "$env:TEMP\$FileName"
    Write-Host "Downloading $FileName..." -ForegroundColor Green
    
    try {
        # Using Invoke-WebRequest to download
        Invoke-WebRequest -Uri $Url -OutFile $downloadPath -UseBasicParsing
        Write-Host "✓ Downloaded to $downloadPath" -ForegroundColor Green
        
        Write-Host "Installing $FileName..." -ForegroundColor Green
        & $downloadPath $Arguments
        Write-Host "✓ $FileName installation complete" -ForegroundColor Green
        
        # Cleanup
        Remove-Item $downloadPath -Force -ErrorAction SilentlyContinue
        return $true
    }
    catch {
        Write-Host "✗ Failed to download or install $FileName" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        return $false
    }
}

# Step 1: Install Python
Write-Host ""
Write-Host "--- Step 1: Installing Python 3.11 ---" -ForegroundColor Cyan

$pythonInstalled = $false

# Try winget first
if (Install-WithWinget "Python.Python.3.11" "Python 3.11") {
    $pythonInstalled = $true
}
else {
    # Fallback: Download from python.org
    Write-Host "Downloading Python 3.11 installer..." -ForegroundColor Yellow
    $pythonUrl = "https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe"
    $pythonArgs = "/quiet InstallAllUsers=1 PrependPath=1"
    
    if (Download-And-Install $pythonUrl "python-3.11.7-amd64.exe" $pythonArgs) {
        $pythonInstalled = $true
    }
}

if ($pythonInstalled) {
    Write-Host "Python installation complete!" -ForegroundColor Green
}
else {
    Write-Host "Could not auto-install Python. Manual installation required:" -ForegroundColor Red
    Write-Host "  1. Visit: https://www.python.org/downloads/"
    Write-Host "  2. Download Python 3.11"
    Write-Host "  3. Run installer and CHECK 'Add Python to PATH'"
    Write-Host ""
}

# Step 2: Install Node.js
Write-Host ""
Write-Host "--- Step 2: Installing Node.js ---" -ForegroundColor Cyan

$nodeInstalled = $false

# Try winget first
if (Install-WithWinget "OpenJS.NodeJS" "Node.js") {
    $nodeInstalled = $true
}
else {
    # Fallback: Download from nodejs.org
    Write-Host "Downloading Node.js installer..." -ForegroundColor Yellow
    $nodeUrl = "https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi"
    $nodeArgs = "/quiet"
    
    if (Download-And-Install $nodeUrl "node-v20.10.0-x64.msi" $nodeArgs) {
        $nodeInstalled = $true
    }
}

if ($nodeInstalled) {
    Write-Host "Node.js installation complete!" -ForegroundColor Green
}
else {
    Write-Host "Could not auto-install Node.js. Manual installation required:" -ForegroundColor Red
    Write-Host "  1. Visit: https://nodejs.org/"
    Write-Host "  2. Download LTS version"
    Write-Host "  3. Run installer (npm is included)"
    Write-Host ""
}

# Step 3: Verify installations
Write-Host ""
Write-Host "--- Step 3: Verifying Installations ---" -ForegroundColor Cyan
Write-Host "You may need to restart PowerShell for PATH changes to take effect" -ForegroundColor Yellow
Write-Host ""

# Refresh environment variables
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

$pythonOk = $false
$nodeOk = $false
$npmOk = $false

try {
    $pythonVersion = & python --version 2>&1
    Write-Host "✓ Python: $pythonVersion" -ForegroundColor Green
    $pythonOk = $true
}
catch {
    Write-Host "✗ Python not found in PATH" -ForegroundColor Red
}

try {
    $nodeVersion = & node --version 2>&1
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
    $nodeOk = $true
}
catch {
    Write-Host "✗ Node.js not found in PATH" -ForegroundColor Red
}

try {
    $npmVersion = & npm --version 2>&1
    Write-Host "✓ npm: $npmVersion" -ForegroundColor Green
    $npmOk = $true
}
catch {
    Write-Host "✗ npm not found in PATH" -ForegroundColor Red
}

# Step 4: Install project dependencies
Write-Host ""
Write-Host "--- Step 4: Installing Project Dependencies ---" -ForegroundColor Cyan

if ($pythonOk) {
    Write-Host "Installing Python packages..." -ForegroundColor Green
    Push-Location "$PSScriptRoot\Backend"
    & python -m pip install --upgrade pip
    & python -m pip install -r requirements.txt
    Pop-Location
    Write-Host "✓ Python packages installed" -ForegroundColor Green
}
else {
    Write-Host "⚠ Skipping Python packages - Python not available" -ForegroundColor Yellow
}

if ($npmOk) {
    Write-Host "Installing npm packages..." -ForegroundColor Green
    Push-Location "$PSScriptRoot"
    & npm install
    Pop-Location
    Write-Host "✓ npm packages installed" -ForegroundColor Green
}
else {
    Write-Host "⚠ Skipping npm packages - npm not available" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "=== Setup Summary ===" -ForegroundColor Cyan
Write-Host "Python: $(if ($pythonOk) { '✓ Ready' } else { '✗ Not Available' })" -ForegroundColor $(if ($pythonOk) { "Green" } else { "Red" })
Write-Host "Node.js: $(if ($nodeOk) { '✓ Ready' } else { '✗ Not Available' })" -ForegroundColor $(if ($nodeOk) { "Green" } else { "Red" })
Write-Host "npm: $(if ($npmOk) { '✓ Ready' } else { '✗ Not Available' })" -ForegroundColor $(if ($npmOk) { "Green" } else { "Red" })
Write-Host ""

if ($pythonOk -and $npmOk) {
    Write-Host "All dependencies installed! Ready to run the project." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Run: .\RUN_PROJECT.ps1" -ForegroundColor Yellow
    Write-Host ""
}
else {
    Write-Host "Some dependencies are missing. Please install manually:" -ForegroundColor Yellow
    Write-Host ""
    if (-not $pythonOk) {
        Write-Host "Python 3.11: https://www.python.org/downloads/" -ForegroundColor Yellow
    }
    if (-not $npmOk) {
        Write-Host "Node.js: https://nodejs.org/" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "Setup script completed." -ForegroundColor Cyan
