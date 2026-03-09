@echo off
setlocal EnableExtensions

cd /d "%~dp0"

call :ensure_command pnpm || goto :end
call :ensure_command node || goto :end
call :prepare_envs
call :ensure_install

:menu
cls
echo ==========================================
echo SeyrDijital Local Dev Launcher
echo ==========================================
echo.
echo 1. Start web only
echo 2. Start mobile only
echo 3. Start web + mobile
echo 4. Run typecheck + test + build
echo 5. Run legacy fetch + apply
echo 0. Exit
echo.
set "CHOICE="
set /p CHOICE=Select an option: 

if "%CHOICE%"=="1" goto :web
if "%CHOICE%"=="2" goto :mobile
if "%CHOICE%"=="3" goto :all
if "%CHOICE%"=="4" goto :checks
if "%CHOICE%"=="5" goto :legacy
if "%CHOICE%"=="0" goto :end

echo.
echo Invalid option.
pause
goto :menu

:web
echo.
echo Starting web on http://localhost:3000
call pnpm dev:web
goto :end

:mobile
echo.
echo Starting Expo mobile dev server
call pnpm dev:mobile
goto :end

:all
echo.
echo Opening web and mobile in separate windows
start "SeyrDijital Web" cmd /k "cd /d ""%~dp0"" && pnpm dev:web"
start "SeyrDijital Mobile" cmd /k "cd /d ""%~dp0"" && pnpm dev:mobile"
echo.
echo Web and mobile windows were opened.
echo If Supabase env values are empty, admin uses development fallback mode.
pause
goto :end

:checks
echo.
echo Running typecheck...
call pnpm typecheck || goto :failed
echo.
echo Running tests...
call pnpm test || goto :failed
echo.
echo Running production build...
call pnpm build || goto :failed
echo.
echo All checks completed successfully.
pause
goto :end

:legacy
echo.
echo Fetching legacy content snapshot...
call pnpm import:legacy || goto :failed
echo.
echo Applying legacy snapshot...
call pnpm import:legacy:apply || goto :failed
echo.
echo Legacy import completed.
pause
goto :end

:ensure_command
where %1 >nul 2>nul
if errorlevel 1 (
  echo.
  echo Required command not found: %1
  echo Install it first, then run this file again.
  pause
  exit /b 1
)
exit /b 0

:prepare_envs
if not exist "apps\web\.env.local" (
  if exist "apps\web\.env.example" (
    copy /Y "apps\web\.env.example" "apps\web\.env.local" >nul
    echo Created apps\web\.env.local from example.
  )
)

if not exist ".env.local" (
  if exist ".env.example" (
    copy /Y ".env.example" ".env.local" >nul
    echo Created .env.local from example.
  )
)

if not exist "apps\mobile\.env" (
  if exist "apps\mobile\.env.example" (
    copy /Y "apps\mobile\.env.example" "apps\mobile\.env" >nul
    echo Created apps\mobile\.env from example.
  )
)
exit /b 0

:ensure_install
if exist "node_modules" exit /b 0

echo.
echo node_modules not found. Running pnpm install...
call pnpm install || goto :failed
exit /b 0

:failed
echo.
echo Command failed.
pause
exit /b 1

:end
endlocal
