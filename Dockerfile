# syntax=docker/dockerfile:1

# Stage 1: Build stage
FROM node:18-alpine AS build
WORKDIR /usr/src/app

# Accept build arguments
ARG VITE_WEATHER_API_KEY
ARG VITE_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
ARG VITE_APP_NAME="Weather Dashboard"

# Set environment variables from build args
ENV VITE_WEATHER_API_KEY=$VITE_WEATHER_API_KEY
ENV VITE_WEATHER_API_URL=$VITE_WEATHER_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME

# Copy package files for better layer caching
COPY package*.json ./
RUN npm ci && npm cache clean --force

# Copy source code and build
COPY . ./
RUN npm run build

# Stage 2: Development stage
FROM node:18-alpine AS development
WORKDIR /usr/src/app

# Install all dependencies for development
COPY package*.json ./
RUN npm install

# Copy source code
COPY . ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S frontend -u 1001 -G nodejs
RUN chown -R frontend:nodejs /usr/src/app
USER frontend

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Stage 3: Production stage with nginx
FROM nginxinc/nginx-unprivileged:1.25-alpine AS production

# Copy built artifacts from build stage
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]