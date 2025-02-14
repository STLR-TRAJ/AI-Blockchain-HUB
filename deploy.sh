#!/bin/bash

# Build the Docker images
docker-compose build

# Start the services
docker-compose up -d

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to start..."
sleep 10

# Initialize the database
docker-compose exec mongodb mongosh ai_blockchain_hub /docker-entrypoint-initdb.d/init-mongo.js

# Show the running containers
docker-compose ps 