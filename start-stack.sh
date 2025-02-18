#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Starting the application stack...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Start the stack with Docker Compose
echo -e "${YELLOW}Starting Docker containers...${NC}"
docker-compose up -d

# Wait for MongoDB to be ready
echo -e "${YELLOW}Waiting for MongoDB to be ready...${NC}"
sleep 5

# Start Backend
echo -e "${YELLOW}Starting backend server...${NC}"
cd backend
if ! npm install; then
    echo -e "${RED}Failed to install backend dependencies${NC}"
    exit 1
fi
npm run dev &

# Start Frontend
echo -e "${YELLOW}Starting frontend application...${NC}"
cd ../frontend/client
if ! npm install; then
    echo -e "${RED}Failed to install frontend dependencies${NC}"
    exit 1
fi
npm start

echo -e "${GREEN}Application stack started successfully!${NC}"
echo -e "Frontend: http://localhost:3000"
echo -e "Backend: http://localhost:5000"
echo -e "MongoDB: mongodb://localhost:27017" 