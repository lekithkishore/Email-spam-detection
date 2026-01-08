"""
Flask Backend for Email Spam Detection
Ready to run with spam mail.csv dataset
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from spam_detector import SpamDetector
import os

app = Flask(__name__)
# Enable CORS for React frontend - allow all origins in production
# For production, you can restrict to specific domains
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize spam detector
detector = SpamDetector()

# Check if models are trained
if os.path.exists('models/vectorizer.pkl'):
    print("Loading pre-trained models...")
    detector.load_models()
    print("Models loaded successfully!")
else:
    print("No trained models found. Please run train_model.py first.")

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'running',
        'models_loaded': detector.models_loaded
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Predict if email is spam
    
    Request body:
    {
        "subject": "Email subject",
        "content": "Email content"
    }
    """
    try:
        data = request.json
        subject = data.get('subject', '')
        content = data.get('content', '')
        
        if not subject and not content:
            return jsonify({'error': 'Please provide subject or content'}), 400
        
        # Get predictions from all models
        predictions = detector.predict_all(subject, content)
        
        return jsonify({
            'isSpam': predictions['ensemble'] >= 0.5,
            'spamScore': float(predictions['ensemble']),
            'detectedPatterns': predictions['patterns'],
            'modelPredictions': {
                'naiveBayes': float(predictions['naive_bayes']),
                'svm': float(predictions['svm']),
                'randomForest': float(predictions['random_forest']),
                'logisticRegression': float(predictions['logistic_regression'])
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def stats():
    """Get model statistics and training info"""
    try:
        stats = detector.get_stats()
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/retrain', methods=['POST'])
def retrain():
    """
    Retrain models (use with caution in production)
    
    Request body:
    {
        "dataset_path": "spam mail.csv"  (optional, defaults to spam mail.csv)
    }
    """
    try:
        data = request.json or {}
        dataset_path = data.get('dataset_path', 'spam mail.csv')
        
        if not os.path.exists(dataset_path):
            return jsonify({'error': f'Dataset not found: {dataset_path}'}), 404
        
        print(f"Training models with dataset: {dataset_path}")
        results = detector.train_models(dataset_path)
        
        return jsonify({
            'message': 'Models trained successfully',
            'results': results
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    print("=" * 60)
    print("Email Spam Detection API Server")
    print("=" * 60)
    print(f"Server running on: http://0.0.0.0:{port}")
    print(f"Health check: http://0.0.0.0:{port}/api/health")
    print("=" * 60)
    app.run(debug=debug, host='0.0.0.0', port=port)
