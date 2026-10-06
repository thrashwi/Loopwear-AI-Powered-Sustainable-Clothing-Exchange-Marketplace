# Loopwear Full-Stack Startup Script
$env:Path = "C:\Users\HP\AppData\Local\Programs\nodejs;" + $env:Path

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting Loopwear AI Sustainable Clothing Marketplace" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot/server'; `$env:Path = 'C:\Users\HP\AppData\Local\Programs\nodejs;' + `$env:Path; npm start"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot/client'; `$env:Path = 'C:\Users\HP\AppData\Local\Programs\nodejs;' + `$env:Path; npm run dev"

Write-Host ""
Write-Host "Frontend running at: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend running at:  http://localhost:5000" -ForegroundColor Yellow
Write-Host ""
