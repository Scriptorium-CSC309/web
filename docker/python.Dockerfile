# python-executor:3.10

FROM python:3.10-slim

WORKDIR /usr/src/app

# Create a non-root user for security
RUN adduser --disabled-password --gecos '' appuser

# Switch to the non-root user
USER appuser
