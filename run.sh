#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "==============================="
echo "        Starting Server         "
echo "==============================="

# Function to check if a command exists
command_exists () {
    command -v "$1" >/dev/null 2>&1 ;
}

# 1. Load environment variables from .env if it exists
if [ -f .env ]; then
    echo "Loading environment variables from .env..."
    set -a
    source .env
    set +a
    echo "Environment variables loaded."
else
    echo "Warning: .env file not found. Ensure environment variables are set."
fi

# 2. Check if NODE_ENV is set, default to production
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV=production
    echo "NODE_ENV not set. Defaulting to production."
else
    echo "NODE_ENV is set to '$NODE_ENV'."
fi

# 3. Verify that required environment variables are set
if [[ -z "$ADMIN_EMAIL" || -z "$ADMIN_PASSWORD" || -z "$ADMIN_NAME" ]]; then
    echo "Error: ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME environment variables must be set."
    echo "Please ensure they are defined in the .env file or exported in your environment."
    exit 1
fi

# 4. Check if required commands are available
echo "Verifying required commands..."

for cmd in node npm; do
    if command_exists $cmd; then
        echo "$cmd is installed."
    else
        echo "Error: $cmd is not installed."
        exit 1
    fi
done

# 5. Build the Next.js application
echo "Building the Next.js application..."
npm run build

# 6. Start the Next.js server
echo "Starting the Next.js server..."
npm run start

# 7. Log success
echo "==============================="
echo "      Server Started Successfully!      "
echo "==============================="