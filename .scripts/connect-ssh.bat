@echo off
setlocal enabledelayedexpansion

REM Colors for output (not natively supported in cmd, so using plain text)
REM Usage:
REM connect-ssh.bat --app <app-name> --space <space-name> --org <org-name>
REM Ensure you are logged into Cloud Foundry before running this script.

set "app="
set "space="
set "org="

:parse_args
if "%~1"=="" goto after_parse
if "%~1"=="--app" (
    set "app=%~2"
    shift
    shift
    goto parse_args
)
if "%~1"=="-a" (
    set "app=%~2"
    shift
    shift
    goto parse_args
)
if "%~1"=="--space" (
    set "space=%~2"
    shift
    shift
    goto parse_args
)
if "%~1"=="-s" (
    set "space=%~2"
    shift
    shift
    goto parse_args
)
if "%~1"=="--org" (
    set "org=%~2"
    shift
    shift
    goto parse_args
)
if "%~1"=="-o" (
    set "org=%~2"
    shift
    shift
    goto parse_args
)
echo Error: Unsupported flag %~1
exit /b 1

:after_parse

if "%app%"=="" (
    echo Error: --app parameter must be defined.
    exit /b 1
)

if not "%org%"=="" if not "%space%"=="" (
    echo Targeting org: %org%, space: %space%
    cf target -o "%org%" -s "%space%"
)

echo Checking SSH support for app '%app%'...
for /f "delims=" %%A in ('cf ssh-enabled "%app%" 2^>^&1') do set "ssh_status=%%A"

echo %ssh_status% | findstr /i "ssh support is disabled" >nul
if not errorlevel 1 (
    echo SSH is disabled for app '%app%'. Enabling SSH...
    cf enable-ssh "%app%"
    echo Restarting app '%app%' to apply SSH changes...
    cf restart "%app%"
) else (
    echo SSH is already enabled for '%app%'.
)

echo Sending signal to allow remote debugging...
cf ssh "%app%" --command "kill -usr1 $(pgrep -f .bin/cds-serve)"

echo Establishing SSH tunnel to %app%.
echo (Ctrl+C or type 'exit' to disconnect)...

REM Start SSH tunnel in the background
start "SSH Tunnel" cmd /c cf ssh "%app%" -L 9229:127.0.0.1:9229 -N

:wait_for_exit
set /p input="> Type 'exit' to disconnect: "
if /i "%input%"=="exit" goto cleanup
goto wait_for_exit

:cleanup
echo Disconnecting SSH tunnel...
REM Find and kill the SSH tunnel window
for /f "tokens=2 delims=," %%a in ('tasklist /v /fo csv ^| findstr /i "SSH Tunnel"') do taskkill /PID %%a >nul 2>&1
echo Disabling SSH for '%app%'...
cf disable-ssh "%app%"
echo Done.
exit /b 0