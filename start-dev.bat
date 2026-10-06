@echo off
echo ========================================================
echo   Starting Loopwear AI Sustainable Clothing Marketplace
echo ========================================================
set PATH=C:\Users\HP\AppData\Local\Programs\nodejs;%PATH%

start "Loopwear Server (Port 5000)" cmd /k "cd /d "%~dp0server" && npm start"
start "Loopwear Client (Port 5173)" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo Both Server and Client are launching!
echo Frontend will be live at: http://localhost:5173
echo Backend will be live at:  http://localhost:5000
echo.
pause
