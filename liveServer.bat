@echo off
setlocal enabledelayedexpansion
title Live Server Controller

:LOOP
cls
echo ===========================
echo     LIVE SERVER MODE
echo ===========================
echo.

set /p projectPath=Enter project path: 
set "projectPath=%projectPath:"=%"

if not exist "%projectPath%" (
    echo Invalid path!
    pause
    goto LOOP
)

cd /d "%projectPath%"

echo.
echo Starting server...

:: start live-server in a new hidden cmd window with unique title
start "LIVESERVER_WINDOW" /min cmd /c live-server --port=5500

echo Server started.
echo Press Q then Enter to stop

:WAIT
set /p input=Running... (Q to stop): 

if /i "%input%"=="q" (
    echo Stopping server...

    :: kill only the window we started
    taskkill /FI "WINDOWTITLE eq LIVESERVER_WINDOW*" /F >nul 2>&1

    echo Stopped.
    timeout /t 1 >nul
    goto LOOP
)

goto WAIT