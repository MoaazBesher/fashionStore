@echo off
title Fashion Store - Automated Tests
echo ==============================================
echo     Running Fashion Store Automated Tests
echo ==============================================
echo.

:: Check if Node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Navigate to test directory
cd /d "%~dp0test"

echo Running tests... Please wait...
node run-tests.js

if %errorlevel% equ 0 (
    echo.
    echo Tests completed successfully!
    echo Opening HTML report...
    start "" "test.html"
) else (
    echo.
    echo Tests failed to run or encountered an error.
)

echo.
pause
