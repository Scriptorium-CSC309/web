# Use the official Ruby image from the Docker Hub
FROM ruby:3.2-alpine

RUN adduser --disabled-password --gecos '' appuser

# Switch to the non-root user
USER appuser