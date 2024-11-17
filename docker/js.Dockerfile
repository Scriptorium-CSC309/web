# nodejs-executor:20

# Use the official Node.js 20 image as the base
FROM node:20

# Create a non-root user for security
RUN adduser --disabled-password --gecos '' appuser

# Switch to the new user
USER appuser
