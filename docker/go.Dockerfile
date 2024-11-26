FROM golang:1.19-alpine

RUN adduser --disabled-password --gecos '' appuser

# Switch to the new user
USER appuser