# ---------- Build stage ----------
FROM docker.arvancloud.ir/node:24.13.1-alpine AS builder

WORKDIR /app

# Install dependencies (use lockfile for reproducible builds)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ---------- Production stage ----------
FROM docker.arvancloud.ir/node:24.13.1-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy only package files and install prod dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built output from builder
COPY --from=builder /app/dist ./dist

# If you use non-TS assets (views, public, etc.), copy them too:
# COPY --from=builder /app/public ./public

EXPOSE 3000

# Run compiled app
CMD ["node", "dist/main.js"]
