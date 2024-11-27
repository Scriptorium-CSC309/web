#!/bin/bash

# cleanup.sh

# Exit on error
set -e

echo "==============================="
echo "          Cleaning Up          "
echo "==============================="

# Load environment variables from .env file
set -o allexport
source .env
set +o allexport

# Stop and remove containers, networks, and volumes created by docker-compose
docker-compose down --volumes --remove-orphans

# Remove specific Docker volumes if they exist
docker volume rm app-node-modules || true
docker volume rm app-sqlite-db || true

# Remove executor images
docker rmi "$PYTHON_IMAGE_TAG" || true
docker rmi "$OPENJDK_IMAGE_TAG" || true
docker rmi "$GCC_IMAGE_TAG" || true
docker rmi "$CPP_IMAGE_TAG" || true
docker rmi "$NODE_IMAGE_TAG" || true
docker rmi "$TS_IMAGE_TAG" || true
docker rmi "$CSHARP_IMAGE_TAG" || true
docker rmi "$RUBY_IMAGE_TAG" || true
docker rmi "$PHP_IMAGE_TAG" || true
docker rmi "$GO_IMAGE_TAG" || true

# Remove dangling images (optional)
# docker image prune -f

# Remove dangling volumes (optional)
# docker volume prune -f

echo "Cleanup complete."
  