#!/bin/bash

# startup.sh

# Exit on error
set -e

echo "==============================="
echo "       Application Setup       "
echo "==============================="

# Load environment variables from .env file
set -o allexport
source .env
set +o allexport

# Build executor images
docker build -f ./docker/python.Dockerfile -t "$PYTHON_IMAGE_TAG" .
docker build -f ./docker/java.Dockerfile -t "$OPENJDK_IMAGE_TAG" .
docker build -f ./docker/c.Dockerfile -t "$GCC_IMAGE_TAG" .
docker build -f ./docker/cpp.Dockerfile -t "$CPP_IMAGE_TAG" .
docker build -f ./docker/js.Dockerfile -t "$NODE_IMAGE_TAG" .
docker build -f ./docker/ts.Dockerfile -t "$TS_IMAGE_TAG" .
docker build -f ./docker/csharp.Dockerfile -t "$CSHARP_IMAGE_TAG" .
docker build -f ./docker/ruby.Dockerfile -t "$RUBY_IMAGE_TAG" .
docker build -f ./docker/php.Dockerfile -t "$PHP_IMAGE_TAG" .
docker build -f ./docker/go.Dockerfile -t "$GO_IMAGE_TAG" .

# 3. Install required packages via npm
echo "Installing npm packages..."
npm install

# 4. Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# 5. Check if Admin Credentials are Set
if [[ -z "$ADMIN_EMAIL" || -z "$ADMIN_PASSWORD" || -z "$ADMIN_NAME" ]]; then
    echo "Error: ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME environment variables must be set."
    echo "You can set them in your environment or in a .env file."
    echo "Example:"
    echo "export ADMIN_EMAIL='admin@example.com'"
    echo "export ADMIN_PASSWORD='Admin@123'"
    echo "export ADMIN_NAME='Admin User'"
    exit 1
fi

# 6. Create an admin user
echo "Creating admin user..."
node ./scripts/createAdmin.js

echo "==============================="
echo "      Setup Completed!         "
echo "==============================="

# Provide admin credentials information
echo "========================================="
echo " Admin User Credentials (from createAdmin.js):"
echo " Email: $ADMIN_EMAIL"
echo " Password: $ADMIN_PASSWORD"
echo " Please change these credentials after initial setup."
echo "========================================="