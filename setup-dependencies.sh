#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Installing project dependencies...${NC}"

# Install production dependencies
npm install \
    argon2 \
    axios \
    bcryptjs \
    chart.js \
    compression \
    cors \
    dotenv \
    express \
    express-mongo-sanitize \
    express-rate-limit \
    helmet \
    hpp \
    ioredis \
    jsonwebtoken \
    mongoose \
    morgan \
    natural \
    node-cache \
    socket.io \
    technicalindicators \
    uuid \
    validator \
    winston \
    xss \
    xss-clean

# Install development dependencies
npm install --save-dev \
    @babel/core \
    @babel/preset-env \
    babel-loader \
    eslint \
    eslint-config-airbnb-base \
    eslint-plugin-import \
    jest \
    nodemon \
    supertest \
    webpack \
    webpack-cli

echo -e "${GREEN}Dependencies installed successfully!${NC}"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}.env file created. Please update it with your configuration.${NC}"
fi

# Initialize ESLint configuration
echo -e "${YELLOW}Initializing ESLint configuration...${NC}"
npx eslint --init

echo -e "${GREEN}Setup completed!${NC}"
echo -e "You can now run the following commands:"
echo -e "- ${YELLOW}npm run dev${NC}: Start development server"
echo -e "- ${YELLOW}npm test${NC}: Run tests"
echo -e "- ${YELLOW}npm run lint${NC}: Run ESLint"

# Market Data APIs
STOCK_MARKET_API=your_stock_api_url
FOREX_API=your_forex_api_url
CRYPTO_API=your_crypto_api_url

# Cache Configuration
REDIS_URL=your_redis_url
CACHE_TTL=300 