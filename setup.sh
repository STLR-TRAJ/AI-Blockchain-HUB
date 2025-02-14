#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Setting up AI Blockchain Hub...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install

# Create necessary directories
echo -e "${GREEN}Creating necessary directories...${NC}"
mkdir -p public/assets
mkdir -p public/css
mkdir -p public/js

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${GREEN}Creating .env file...${NC}"
    cp .env.example .env
    echo "Please update .env with your credentials"
fi

# Build Docker containers
echo -e "${GREEN}Building Docker containers...${NC}"
docker-compose build

# Start services
echo -e "${GREEN}Starting services...${NC}"
docker-compose up -d

# Wait for MongoDB to be ready
echo -e "${YELLOW}Waiting for MongoDB to start...${NC}"
sleep 10

# Initialize database
echo -e "${GREEN}Initializing database...${NC}"
docker-compose exec mongodb mongosh ai_blockchain_hub /docker-entrypoint-initdb.d/init-mongo.js

echo -e "${GREEN}Setup completed!${NC}"
echo -e "Backend API running on: ${YELLOW}http://localhost:5000${NC}"
echo -e "MongoDB running on: ${YELLOW}mongodb://localhost:27017${NC}" 