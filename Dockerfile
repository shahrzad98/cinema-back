# ------------------------
# Stage 1: Build
# ------------------------
FROM node:24.13.1-alpine AS build

# Create and set the working directory
WORKDIR /app

# Copy dependency manifest files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy the rest of the project files
COPY . .

# Build the NestJS project
RUN npm run build

# ------------------------
# Stage 2: Production (final runtime image)
# ------------------------
FROM node:24.13.1-alpine

# Create a non-root user (for security)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Set the working directory
WORKDIR /app

# Copy required files from the build stage while preserving ownership
COPY --from=build --chown=nestjs:nodejs /app/package*.json ./
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist

# ------------------------
# Fix permissions for the data folder
# ------------------------
# Temporarily switch to root to adjust ownership under /app
USER root

# Change ownership of /app to the nestjs user (WORKDIR is created by root)
RUN chown -R nestjs:nodejs /app

# Create the data directory and assign it to nestjs
RUN mkdir -p /app/data && chown nestjs:nodejs /app/data

# Switch back to the non-root user
USER nestjs

# Expose the port the app runs on
EXPOSE 4000

# Run the app
CMD ["node", "dist/main"]