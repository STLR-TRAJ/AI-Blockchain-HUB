@echo off
echo Setting up MongoDB...

:: Check if MongoDB is installed
mongod --version > nul 2>&1
if errorlevel 1 (
    echo MongoDB is not installed. Installing MongoDB...
    :: Download MongoDB installer
    powershell -Command "& {Invoke-WebRequest -Uri 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-6.0.12-signed.msi' -OutFile 'mongodb-installer.msi'}"
    
    :: Install MongoDB
    msiexec /i mongodb-installer.msi /quiet /qn
    
    :: Create data directory
    mkdir "C:\data\db"
)

:: Start MongoDB service
net start MongoDB

:: Create database and user
echo Creating database and user...
mongo admin --eval "db.createUser({user: '%MONGODB_USER%', pwd: '%MONGODB_PASSWORD%', roles: ['readWrite']})"

echo MongoDB setup completed!
pause 