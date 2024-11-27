#!/bin/sh

# entrypoint.sh

# Exit immediately if a command exits with a non-zero status
set -e

# Run database migrations
npx prisma migrate deploy

# Seed the database
node scripts/createAdmin.js
# node scripts/seed.js

# Start the application using PM2
npm start
