# Dockerfile

# # Stage 1: Build the application
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# Stage 2: Run the application
FROM node:22-alpine AS runner

# Set working directory
WORKDIR /app

# Install Docker CLI in the runner stage
RUN apk add --no-cache docker-cli

# Copy application files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

# Copy the entrypoint script
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh

# Ensure the entrypoint script is executable
RUN chmod +x ./entrypoint.sh

# Expose port 3000
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Set the entrypoint
ENTRYPOINT ["./entrypoint.sh"]
