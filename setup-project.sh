#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Creating project structure...${NC}"

# Create project structure
mkdir -p ai-blockchain-hub/{backend,frontend}

# Backend setup (Express + Node)
cd ai-blockchain-hub/backend
npm init -y

# Copy backend files
cp -r ../../JS/* .
cp ../../server.js .
cp ../../package.json .

# Frontend setup (React)
cd ../frontend
npx create-react-app client
cd client

# Install frontend dependencies
npm install @material-ui/core @material-ui/icons \
    axios chart.js react-chartjs-2 socket.io-client \
    redux react-redux @reduxjs/toolkit react-router-dom \
    tailwindcss@latest postcss@latest autoprefixer@latest \
    @headlessui/react @heroicons/react

# Create necessary directories
mkdir -p src/{components,pages,services,utils,store,hooks}

# Initialize Tailwind CSS
npx tailwindcss init -p

# Copy environment files
cp ../../../.env .env

echo -e "${GREEN}Project structure created successfully!${NC}"
echo -e "Next steps:"
echo -e "1. cd ai-blockchain-hub"
echo -e "2. ./start-stack.sh" 