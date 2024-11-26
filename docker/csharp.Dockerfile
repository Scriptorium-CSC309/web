# Use the official .NET SDK image as the base
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine

# Create a non-root user for security
RUN adduser --disabled-password --gecos '' appuser
# Switch to the new user
USER appuser

WORKDIR /home/appuser

RUN dotnet new console -n tempApp

# # Install dotnet-script tool for running C# files as scripts
# RUN dotnet tool install -g dotnet-script

# Set environment path for dotnet tools





