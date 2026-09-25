@echo off
rem Starts the L'AMOUR API on http://localhost:5080 with the .NET 8 SDK.
rem The "dotnet" found first on PATH on this machine is a runtime-only .NET 10 install (no SDK),
rem so prefer the user-level SDK in %USERPROFILE%\.dotnet when it exists.
set "DOTNET=%USERPROFILE%\.dotnet\dotnet.exe"
if not exist "%DOTNET%" set "DOTNET=dotnet"
cd /d "%~dp0LAmour.Api"
"%DOTNET%" run --launch-profile http
