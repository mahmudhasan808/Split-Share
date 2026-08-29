@echo off
echo =========================================
echo       Starting SplitShare Servers...
echo =========================================

echo.
echo [1/2] Starting the Backend Server (Port 4000)...
start "SplitShare Backend" cmd /c "cd backend && npm run dev"

echo [2/2] Starting the Frontend Server (Port 5173)...
start "SplitShare Frontend" cmd /c "npm run dev"

echo.
echo Waiting for servers to initialize...
timeout /t 6 /nobreak > NUL

echo.
echo Opening SplitShare in your default web browser...
start http://localhost:5173

echo.
echo =========================================
echo Both servers are now running in separate windows!
echo If you close those windows, the servers will stop.
echo =========================================
pause
