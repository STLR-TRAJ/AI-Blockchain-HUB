@echo off
echo Setting up project...

:: Setup MongoDB
call setup-mongodb.bat

:: Create project structure
mkdir ai-blockchain-hub\backend ai-blockchain-hub\frontend

:: Backend setup
cd ai-blockchain-hub\backend
call npm init -y

:: Copy backend files
xcopy ..\..\JS\* . /E /I /Y
copy ..\..\server.js .
copy ..\..\package.json .

:: Install backend dependencies
call npm install

:: Initialize database
call node scripts/init-db.js

:: Frontend setup (React)
cd ..\frontend
call npx create-react-app client
cd client

:: Install frontend dependencies
call npm install @material-ui/core @material-ui/icons ^
    axios chart.js react-chartjs-2 socket.io-client ^
    redux react-redux @reduxjs/toolkit react-router-dom ^
    tailwindcss@latest postcss@latest autoprefixer@latest ^
    @headlessui/react @heroicons/react

:: Create necessary directories
mkdir src\components src\pages src\services src\utils src\store src\hooks

:: Initialize Tailwind CSS
call npx tailwindcss init -p

:: Copy environment files
copy ..\..\..\frontend\client\.env .env

echo Project structure created successfully!
echo Next steps:
echo 1. cd ai-blockchain-hub
echo 2. start-stack.bat
pause 