@echo off
setlocal

set TARGET=%~1
if "%TARGET%"=="" set TARGET=help

if /i "%TARGET%"=="help" goto :help
if /i "%TARGET%"=="setup" goto :setup
if /i "%TARGET%"=="dev" goto :dev
if /i "%TARGET%"=="dev-backend" goto :dev_backend
if /i "%TARGET%"=="dev-frontend" goto :dev_frontend
if /i "%TARGET%"=="worker" goto :worker
if /i "%TARGET%"=="test" goto :test
if /i "%TARGET%"=="build" goto :build
if /i "%TARGET%"=="docker-up" goto :docker_up
if /i "%TARGET%"=="docker-down" goto :docker_down
if /i "%TARGET%"=="db-setup" goto :db_setup
if /i "%TARGET%"=="clean" goto :clean

echo Unknown target: %TARGET%
echo Run 'make.bat help' for available targets.
exit /b 1

:help
echo =====================================================================
echo                       DocForge / BookForge CLI                        
echo =====================================================================
echo Usage: make [target] or make.bat [target]
echo.
echo Available targets:
echo   setup        - Install backend requirements and frontend packages
echo   dev          - Start both backend and frontend servers in separate windows
echo   dev-backend  - Start FastAPI backend dev server [uvicorn]
echo   dev-frontend - Start Next.js frontend dev server [next]
echo   worker       - Start Celery worker for workflow orchestration
echo   test         - Run backend tests and frontend type checks
echo   build        - Build production bundle for frontend
echo   docker-up    - Start multi-container production stack with docker-compose
echo   docker-down  - Stop multi-container production stack
echo   db-setup     - Initialize PostgreSQL database and user
echo   clean        - Remove Python cache files
echo =====================================================================
exit /b 0

:setup
echo Installing backend requirements...
cd /d "%~dp0backend" && pip install -r requirements.txt
cd /d "%~dp0frontend" && npm install
exit /b 0

:dev
echo Starting FastAPI backend in a new window...
start "BookForge Backend API" cmd /k "cd /d "%~dp0backend" && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo Starting Next.js frontend in a new window...
start "BookForge Frontend UI" cmd /k "cd /d "%~dp0frontend" && npm run dev"
echo Development servers started in separate terminal windows.
exit /b 0

:dev_backend
echo Starting FastAPI backend server...
cd /d "%~dp0backend"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
exit /b %errorlevel%

:dev_frontend
echo Starting Next.js frontend server...
cd /d "%~dp0frontend"
npm run dev
exit /b %errorlevel%

:worker
echo Starting Celery worker...
cd /d "%~dp0backend"
celery -A app.workers.celery_app worker --loglevel=info --queues=priority,publisher,gpu,cpu,worker,large_doc
exit /b %errorlevel%

:test
echo Running backend pytest...
cd /d "%~dp0backend" && pytest
echo Running frontend type check...
cd /d "%~dp0frontend" && npx tsc --noEmit
exit /b 0

:build
echo Building frontend...
cd /d "%~dp0frontend" && npm run build
exit /b %errorlevel%

:docker_up
echo Starting multi-container production stack with docker-compose...
docker-compose up -d --build
exit /b %errorlevel%

:docker_down
echo Stopping multi-container production stack...
docker-compose down
exit /b %errorlevel%

:db_setup
echo Setting up database...
cd /d "%~dp0backend" && python setup_db.py
exit /b %errorlevel%

:clean
echo Cleaning Python cache...
for /d /r "%~dp0" %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d"
echo Clean completed.
exit /b 0
