#!/bin/bash
# Build script specifically for Render deployment
set -e

echo "=========================================="
echo "Render Build Script - Spam Detection Backend"
echo "=========================================="

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Find and copy dataset file
echo "Locating dataset file..."
if [ -f "../../spam mail.csv" ]; then
    echo "Found dataset at ../../spam mail.csv"
    cp "../../spam mail.csv" .
elif [ -f "../spam mail.csv" ]; then
    echo "Found dataset at ../spam mail.csv"
    cp "../spam mail.csv" .
elif [ -f "spam mail.csv" ]; then
    echo "Found dataset in current directory"
else
    echo "WARNING: spam mail.csv not found!"
    echo "Models will need to be trained manually or dataset uploaded."
    mkdir -p models
    exit 0
fi

# Train models
echo "Training ML models..."
python train_model.py

echo "=========================================="
echo "Build complete!"
echo "=========================================="

