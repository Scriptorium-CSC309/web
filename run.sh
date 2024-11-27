#!/bin/bash

# run.sh

# Exit on error
set -e

# Default port
PORT=3000

# Check if a port is provided as an argument
if [ ! -z "$1" ]; then
  PORT=$1
fi

# Export the port so docker-compose can use it
export PORT

# Start the application
docker-compose up -d

echo "Application is running on http://localhost:$PORT"
