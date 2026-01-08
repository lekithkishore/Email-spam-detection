#!/bin/bash

echo "============================================================"
echo "  EMAIL SPAM DETECTION - QUICK START"
echo "============================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8+ from https://www.python.org/"
    exit 1
fi

echo "[1/4] Checking Python installation..."
python3 --version
echo ""

# Check if dataset exists
if [ ! -f "spam mail.csv" ]; then
    echo "ERROR: Dataset not found!"
    echo "Please place 'spam mail.csv' in this folder"
    exit 1
fi

echo "[2/4] Dataset found: spam mail.csv"
echo ""

# Install dependencies
echo "[3/4] Installing dependencies..."
echo "This may take a few minutes..."
echo ""
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo ""

# Train models
echo "[4/4] Training models..."
echo "This will take 10-30 seconds..."
echo ""
python3 train_model.py
if [ $? -ne 0 ]; then
    echo "ERROR: Training failed"
    exit 1
fi
echo ""

echo "============================================================"
echo "  SETUP COMPLETE!"
echo "============================================================"
echo ""
echo "You can now start the API server by running:"
echo "  python3 app.py"
echo ""
echo "Or simply run: ./start_server.sh"
echo ""
