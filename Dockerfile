# Multi-stage build for Disaster Vision application

# Backend stage
FROM python:3.10-slim as backend

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application code
COPY backend/ .

# Create logs directory
RUN mkdir -p logs

# Expose backend port
EXPOSE 8000

# Command to run backend
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# Frontend stage
FROM node:18-alpine as frontend

WORKDIR /app

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci --only=production

# Copy frontend source code
COPY frontend/ .

# Build frontend
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine as production

# Copy built frontend from frontend stage
COPY --from=frontend /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose frontend port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
