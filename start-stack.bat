@echo off
echo Starting the application stack...

:: Check if Docker is running
docker info > nul 2>&1
if errorlevel 1 (
    echo Docker is not running. Please start Docker first.
    exit /b 1
)

:: Start the stack with Docker Compose
echo Starting Docker containers...
docker-compose up -d

:: Wait for MongoDB to be ready
echo Waiting for MongoDB to be ready...
timeout /t 5 /nobreak > nul

:: Start Backend
echo Starting backend server...
cd backend
call npm install
if errorlevel 1 (
    echo Failed to install backend dependencies
    exit /b 1
)
start npm run dev

:: Start Frontend
echo Starting frontend application...
cd ..\frontend\client
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    exit /b 1
)
start npm start

echo Application stack started successfully!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo MongoDB: mongodb://localhost:27017
pause 