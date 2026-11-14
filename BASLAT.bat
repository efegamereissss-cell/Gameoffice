@echo off
chcp 65001 >nul
cd /d "%~dp0"
if exist "index.html" (
    start "" "index.html"
) else if exist "site\index.html" (
    start "" "site\index.html"
)
