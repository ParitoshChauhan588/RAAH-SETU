# Download and install Node.js
Write-Host "Downloading Node.js v20.10.0..."
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ProgressPreference = 'SilentlyContinue'

$tempPath = "$env:TEMP\node-installer.msi"
Invoke-WebRequest -Uri 'https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi' -OutFile $tempPath

Write-Host "Installing Node.js (please wait 1-2 minutes)..."
Start-Process msiexec.exe -ArgumentList "/i `"$tempPath`" /quiet" -Wait

Write-Host "Node.js installation complete!"
Write-Host "Refreshing PATH..."

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verify
Write-Host ""
Write-Host "Verifying installation..."
node --version
npm --version

Write-Host ""
Write-Host "Ready to run project!"
