# Backend Dockerfile for Flask API
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create models directory
RUN mkdir -p models

# Train models if dataset exists, otherwise models will be loaded at runtime
RUN if [ -f "spam mail.csv" ]; then \
        python train_model.py; \
    fi

# Expose port
EXPOSE 5000

# Run the application with gunicorn in production
# Use python app.py for development
CMD ["gunicorn", "app:app", "--config", "gunicorn_config.py"]

