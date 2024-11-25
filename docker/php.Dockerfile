# Use the official PHP image from Docker Hub
FROM php:8.1-cli-alpine

RUN adduser --disabled-password --gecos '' appuser

# Switch to the non-root user
USER appuser