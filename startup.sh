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

  # Build the application image
  docker-compose build

  echo "==============================="
  echo "       Startup Complete        "
  echo "==============================="
