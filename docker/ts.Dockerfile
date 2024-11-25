# nodejs-executor:20

# Use the official Node.js 20 image as the base
FROM node:20-alpine

# Create a non-root user for security
RUN adduser --disabled-password --gecos '' appuser

# Update package lists and install coreutils
RUN apk add --no-cache coreutils
# RUN apt-get update && \
#     apt-get install -y coreutils && \
#     rm -rf /var/lib/apt/lists/*

RUN npm install -g typescript ts-node @types/node

# Switch to the new user
USER appuser