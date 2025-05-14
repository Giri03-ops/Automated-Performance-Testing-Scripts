@echo off
REM ------------  load .env  ------------
for /f "usebackq tokens=1,2 delims==" %%a in ("%~dp0.env") do set "%%a=%%b"

setlocal enabledelayedexpansion

REM ---------- build dynamic names ----------
for /f %%t in ('powershell -NoLogo -NoProfile -Command "Get-Date -UFormat \"%%Y-%%m-%%d_%%H-%%M-%%S\""') do set "STAMP=%%t"

set "RUN_FOLDER=%RESULTS_DIR%\%STAMP%"
set "HTML_DIR=%RUN_FOLDER%\html_report"
set "JTL_LOG=%RUN_FOLDER%\%STAMP%_results.jtl"
set "CSV_SUMMARY=%RUN_FOLDER%\%STAMP%_summary_report.csv"

REM ---------- create folders --------------
if not exist "%RUN_FOLDER%" mkdir "%RUN_FOLDER%"
if not exist "%HTML_DIR%"  mkdir "%HTML_DIR%"

echo JMeter: Start test
jmeter -n -t "%TEST_PLAN_FILE%" -l "%JTL_LOG%" -JcsvDir="%DATA_DIR%" -e -o "%HTML_DIR%"

echo Generating CSV summary report...
jmeter -g "%JTL_LOG%" -o "%HTML_DIR%" -f >nul
copy "%JTL_LOG%" "%CSV_SUMMARY%" >nul

echo.
echo Test complete – results are in:
echo   %RUN_FOLDER%
echo   Summary CSV: %CSV_SUMMARY%
start "" "%HTML_DIR%\%STAMP%\index.html"

pause
endlocal
