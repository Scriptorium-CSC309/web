#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "==============================="
echo "       Application Setup       "
echo "==============================="

# Function to check if a command exists
command_exists () {
    command -v "$1" >/dev/null 2>&1 ;
}

# Function to check version
check_version () {
    local cmd=$1
    local min_version=$2
    local flag=$3
    local regex=$4

    if command_exists "$cmd"; then
        local version_output
        version_output=$($cmd $flag 2>&1)

        # Extract the version number using regex
        local version
        if command_exists grep && grep -oP "$regex" <<< "$version_output" > /dev/null 2>&1; then
            # Use Perl-compatible regex to extract the version number
            version=$(echo "$version_output" | grep -oP "$regex" | head -1 | sed 's/[vV]//')
        else
            # Alternative extraction if grep -P is not available
            version=$(echo "$version_output" | grep -oE "$regex" | head -1 | sed 's/[vV]//')
        fi

        # Fallback if version extraction failed
        if [[ -z "$version" ]]; then
            # Attempt to extract the first numeric value in the version string
            version=$(echo "$version_output" | grep -oE '[0-9]+' | head -1)
        fi

        if [[ -z "$version" ]]; then
            echo "Unable to determine the version of $cmd."
            exit 1
        fi

        # Extract the major version number by taking the first numeric component
        major_version=$(echo "$version" | grep -oE '[0-9]+' | head -1)

        if [[ -z "$major_version" ]]; then
            echo "Unable to determine the major version of $cmd."
            exit 1
        fi

        if (( major_version < min_version )); then
            echo "Error: $cmd version $min_version or higher is required. Detected version: $version"
            exit 1
        else
            echo "$cmd version $version detected."
        fi
    else
        echo "Error: $cmd is not installed."
        exit 1
    fi
}

# 0. Define the Next.js project directory
PROJECT_DIR="web"  

# Check if project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo "Error: Project directory '$PROJECT_DIR' does not exist."
    exit 1
fi

# Change to the Next.js project directory
cd "$PROJECT_DIR"

# 1. Load environment variables from .env if it exists
if [ -f .env ]; then
    set -a
    source .env
    set +a
    echo "Environment variables loaded from .env"
fi

# 2. Check for required compilers/interpreters
echo "Checking for required compilers and interpreters..."

# Check Node.js (version 20+)
check_version "node" 20 "--version" "v([0-9]+)\.([0-9]+)\.([0-9]+)"

# Check gcc
if command_exists gcc; then
    echo "gcc is installed. Version: $(gcc --version | head -n1)"
else
    echo "Error: gcc is not installed."
    exit 1
fi

# Check g++
if command_exists g++; then
    echo "g++ is installed. Version: $(g++ --version | head -n1)"
else
    echo "Error: g++ is not installed."
    exit 1
fi

# Check Python (version 3.10+)
check_version "python3" 3 "--version" "Python ([0-9]+)\.([0-9]+)\.([0-9]+)"

# Check Java (version 20+)
check_version "java" 20 "-version" "java version \"([0-9]+)(?:\.[0-9]+)?(?:\.[0-9]+)?\""

echo "All required compilers and interpreters are installed."

# 3. Install required packages via npm
echo "Installing npm packages..."
npm install

# 4. Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# 5. Check if Admin Credentials are Set
if [[ -z "$ADMIN_EMAIL" || -z "$ADMIN_PASSWORD" || -z "$ADMIN_NAME" ]]; then
    echo "Error: ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_NAME environment variables must be set."
    echo "You can set them in your environment or in a .env file."
    echo "Example:"
    echo "export ADMIN_EMAIL='admin@example.com'"
    echo "export ADMIN_PASSWORD='Admin@123'"
    echo "export ADMIN_NAME='Admin User'"
    exit 1
fi

# 6. Create an admin user
echo "Creating admin user..."
node ./scripts/createAdmin.js

echo "==============================="
echo "      Setup Completed!         "
echo "==============================="

# Provide admin credentials information
echo "========================================="
echo " Admin User Credentials (from createAdmin.js):"
echo " Email: $ADMIN_EMAIL"
echo " Password: $ADMIN_PASSWORD"
echo " Please change these credentials after initial setup."
echo "========================================="
