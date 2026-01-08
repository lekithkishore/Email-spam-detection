#!/bin/bash

# Deployment script for Email Spam Detection
# Usage: ./deploy.sh [docker|manual]

set -e

DEPLOYMENT_TYPE=${1:-docker}

echo "=========================================="
echo "Email Spam Detection - Deployment Script"
echo "=========================================="
echo ""

if [ "$DEPLOYMENT_TYPE" = "docker" ]; then
    echo "🐳 Deploying with Docker..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if dataset exists
    if [ ! -f "spam mail.csv" ]; then
        echo "⚠️  Warning: spam mail.csv not found in project root."
        echo "   Models will need to be trained manually or dataset uploaded."
    fi
    
    # Build and start containers
    echo "📦 Building and starting containers..."
    docker-compose up --build -d
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "Frontend: http://localhost"
    echo "Backend API: http://localhost:5000"
    echo "Health Check: http://localhost:5000/api/health"
    echo ""
    echo "View logs: docker-compose logs -f"
    echo "Stop services: docker-compose down"
    
elif [ "$DEPLOYMENT_TYPE" = "manual" ]; then
    echo "🔧 Manual deployment setup..."
    
    # Backend setup
    echo ""
    echo "📦 Setting up backend..."
    cd src/backend
    
    if [ ! -d "venv" ]; then
        echo "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    echo "Activating virtual environment..."
    source venv/bin/activate 2>/dev/null || source venv/Scripts/activate
    
    echo "Installing dependencies..."
    pip install -r requirements.txt
    pip install gunicorn
    
    if [ -f "spam mail.csv" ]; then
        echo "Training models..."
        python train_model.py
    else
        echo "⚠️  Warning: spam mail.csv not found. Models may not be trained."
    fi
    
    echo ""
    echo "✅ Backend setup complete!"
    echo "Start backend: cd src/backend && gunicorn app:app --config gunicorn_config.py"
    
    # Frontend setup
    echo ""
    echo "📦 Setting up frontend..."
    cd ../..
    
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies..."
        npm install
    fi
    
    echo "Building frontend..."
    npm run build
    
    echo ""
    echo "✅ Frontend setup complete!"
    echo "Serve frontend: cd build && python -m http.server 8000"
    
else
    echo "❌ Invalid deployment type: $DEPLOYMENT_TYPE"
    echo "Usage: ./deploy.sh [docker|manual]"
    exit 1
fi

