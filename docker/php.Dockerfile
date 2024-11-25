# Use the official PHP image from Docker Hub
FROM php:cli

RUN adduser --disabled-password --gecos '' appuser

# Switch to the non-root user
USER appuser