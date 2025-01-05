@echo off
:: start.bat - Windows script to start both frontend and backend

:: Start the backend
start cmd /k "cd clearTask.Server && dotnet run"

:: Wait for a moment to let the backend initialize
::timeout /t 5

:: Start the frontend
::start cmd /k "cd cleartask.client && npm run dev"

echo Both services are starting...