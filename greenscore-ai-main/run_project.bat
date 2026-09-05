@echo off
title GREENScore AI - Unified Launch Server
echo ====================================================================
echo             GREENScore AI - Municipal Command System
echo       "Predict. Prioritize. Optimize. Act. Measure."
echo ====================================================================
echo.

set PATH=C:\Program Files\nodejs;%PATH%

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "GREENScore Backend (FastAPI)" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo [2/2] Starting React + Vite Frontend on http://localhost:5173 ...
start "GREENScore Frontend (Vite)" cmd /k "cd /d %~dp0frontend && set PATH=C:\Program Files\nodejs;%%PATH%% && npm run dev"

echo.
echo ====================================================================
echo  Servers are starting in separate windows!
echo.
echo  - Frontend Web UI:  http://localhost:5173
echo  - Backend API Docs: http://localhost:8000/docs
echo.
echo  Demo Logins:
echo    - Super Admin: admin / admin123
echo    - Officer:     officer_sanitation / officer123
echo    - Citizen:     citizen / citizen123
echo ====================================================================
echo.
pause
