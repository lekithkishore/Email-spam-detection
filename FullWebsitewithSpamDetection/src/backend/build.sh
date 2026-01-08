#!/bin/bash
# Build script for Render deployment
# This script ensures models are trained before starting the server

set -e

echo "=========================================="
echo "Building Spam Detection Backend"
echo "=========================================="

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Check if dataset exists
if [ -f "spam mail.csv" ]; then
    echo "Dataset found. Training models..."
    python train_model.py
else
    echo "WARNING: spam mail.csv not found!"
    echo "Models will not be trained. Please ensure dataset is available."
    # Create models directory anyway
    mkdir -p models
fi

# Verify models directory exists
mkdir -p models

echo "=========================================="
echo "Build complete!"
echo "=========================================="

