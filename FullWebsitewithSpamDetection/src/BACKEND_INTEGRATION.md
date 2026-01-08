# Flask Backend Integration Guide

This document explains how to connect the Python/Flask ML backend to this React frontend.

## ⚡ Your Dataset Format

Your `spam mail.csv` has this exact structure:

```csv
Category,Messages
ham,"Go until jurong point, crazy.. Available only in bugis n great world la e buffet..."
spam,"Free entry in 2 a wkly comp to win FA Cup Final Tkts 21st May 2005..."
ham,"U dun say so early hor... U c already then say..."
spam,"WINNER!! As a valued network customer you have been selected..."
```

**Columns:**
- **Column 1:** `Category` - Values: `ham` (legitimate) or `spam`
- **Column 2:** `Messages` - Email/SMS text content

The backend code is already configured to work with this exact format!

## Python Backend Setup

### 1. Project Structure

```
backend/
├── app.py                 # Flask application
├── models/
│   ├── spam_detector.py   # ML models implementation
│   ├── train_model.py     # Model training script
│   └── saved_models/      # Trained model files
├── data/
│   ├── spam mail.csv      # Training dataset
│   └── preprocessed/     # Preprocessed data
├── requirements.txt       # Python dependencies
└── config.py             # Configuration
```

### 2. Install Dependencies

```bash
pip install flask flask-cors pandas numpy scikit-learn nltk
```

Create `requirements.txt`:
```
flask==2.3.0
flask-cors==4.0.0
pandas==2.0.0
numpy==1.24.0
scikit-learn==1.3.0
nltk==3.8.0
```

### 3. Sample Flask Backend Code

**app.py:**
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from models.spam_detector import SpamDetector

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize ML models
detector = SpamDetector()
detector.load_models()

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict if email is spam"""
    data = request.json
    subject = data.get('subject', '')
    content = data.get('content', '')
    
    # Get predictions from all models
    predictions = detector.predict_all(subject, content)
    
    return jsonify({
        'isSpam': predictions['ensemble'] >= 0.5,
        'spamScore': predictions['ensemble'],
        'detectedPatterns': predictions['patterns'],
        'modelPredictions': {
            'naiveBayes': predictions['naive_bayes'],
            'svm': predictions['svm'],
            'randomForest': predictions['random_forest'],
            'logisticRegression': predictions['logistic_regression']
        }
    })

@app.route('/api/train', methods=['POST'])
def train():
    """Train models with new data"""
    data = request.json
    dataset_path = data.get('dataset_path', 'data/spam mail.csv')
    
    detector.train_models(dataset_path)
    
    return jsonify({'message': 'Models trained successfully'})

@app.route('/api/stats', methods=['GET'])
def stats():
    """Get model statistics"""
    stats = detector.get_stats()
    return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

**models/spam_detector.py:**
```python
import pandas as pd
import numpy as np
import pickle
import re
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

class SpamDetector:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=3000, ngram_range=(1, 3))
        self.models = {
            'naive_bayes': MultinomialNB(),
            'svm': SVC(kernel='linear', probability=True),
            'random_forest': RandomForestClassifier(n_estimators=100),
            'logistic_regression': LogisticRegression(max_iter=1000)
        }
        self.stemmer = PorterStemmer()
        self.stop_words = set(stopwords.words('english'))
        
        # Spam patterns for n-gram detection
        self.spam_patterns = [
            r'\b(win|won)\s+(money|\$|prize|cash)\b',
            r'\bfree\s+(money|cash|reward|gift)\b',
            r'\b(urgent|immediately|act\s+now)\b',
            r'\bclick\s+(here|now|this)\b',
            r'\b(verify|confirm)\s+(account|password)\b',
        ]
    
    def preprocess_text(self, text):
        """Preprocess email text"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and digits
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Tokenize
        tokens = text.split()
        
        # Remove stopwords and stem
        tokens = [self.stemmer.stem(word) for word in tokens 
                 if word not in self.stop_words]
        
        return ' '.join(tokens)
    
    def detect_patterns(self, text):
        """Detect spam patterns in text"""
        patterns_found = []
        for pattern in self.spam_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                patterns_found.append(pattern)
        return patterns_found
    
    def train_models(self, dataset_path):
        """Train all ML models"""
        # Load dataset
        df = pd.read_csv(dataset_path, encoding='latin-1')
        
        # Assuming columns: 'Category', 'Messages'
        # Category: 'spam' or 'ham'
        df['Category'] = df['Category'].map({'spam': 1, 'ham': 0})
        
        # Preprocess
        df['processed_text'] = df['Messages'].apply(self.preprocess_text)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            df['processed_text'], df['Category'], 
            test_size=0.2, random_state=42
        )
        
        # Vectorize
        X_train_vec = self.vectorizer.fit_transform(X_train)
        X_test_vec = self.vectorizer.transform(X_test)
        
        # Train each model
        results = {}
        for name, model in self.models.items():
            model.fit(X_train_vec, y_train)
            y_pred = model.predict(X_test_vec)
            
            results[name] = {
                'accuracy': accuracy_score(y_test, y_pred),
                'precision': precision_score(y_test, y_pred),
                'recall': recall_score(y_test, y_pred),
                'f1': f1_score(y_test, y_pred)
            }
        
        # Save models
        self.save_models()
        
        return results
    
    def predict_all(self, subject, content):
        """Get predictions from all models"""
        text = f"{subject} {content}"
        processed = self.preprocess_text(text)
        patterns = self.detect_patterns(text)
        
        # Vectorize
        text_vec = self.vectorizer.transform([processed])
        
        # Get predictions from each model
        predictions = {}
        for name, model in self.models.items():
            pred_proba = model.predict_proba(text_vec)[0]
            predictions[name] = float(pred_proba[1])  # Probability of spam
        
        # Ensemble prediction (average)
        ensemble = np.mean(list(predictions.values()))
        
        return {
            'naive_bayes': predictions['naive_bayes'],
            'svm': predictions['svm'],
            'random_forest': predictions['random_forest'],
            'logistic_regression': predictions['logistic_regression'],
            'ensemble': float(ensemble),
            'patterns': patterns
        }
    
    def save_models(self):
        """Save trained models"""
        with open('models/saved_models/vectorizer.pkl', 'wb') as f:
            pickle.dump(self.vectorizer, f)
        
        for name, model in self.models.items():
            with open(f'models/saved_models/{name}.pkl', 'wb') as f:
                pickle.dump(model, f)
    
    def load_models(self):
        """Load trained models"""
        try:
            with open('models/saved_models/vectorizer.pkl', 'rb') as f:
                self.vectorizer = pickle.load(f)
            
            for name in self.models.keys():
                with open(f'models/saved_models/{name}.pkl', 'rb') as f:
                    self.models[name] = pickle.load(f)
            
            print("Models loaded successfully")
        except FileNotFoundError:
            print("No saved models found. Please train models first.")
    
    def get_stats(self):
        """Get model statistics"""
        return {
            'totalFeatures': self.vectorizer.max_features,
            'ngramRange': self.vectorizer.ngram_range,
            'modelsLoaded': len(self.models)
        }
```

**models/train_model.py:**
```python
from spam_detector import SpamDetector

def main():
    print("Training spam detection models...")
    
    detector = SpamDetector()
    
    # Train on SMS Spam Collection dataset
    # Download from: https://www.kaggle.com/uciml/sms-spam-collection-dataset
    results = detector.train_models('data/spam mail.csv')
    
    print("\nTraining Results:")
    for model_name, metrics in results.items():
        print(f"\n{model_name.upper()}:")
        print(f"  Accuracy:  {metrics['accuracy']:.4f}")
        print(f"  Precision: {metrics['precision']:.4f}")
        print(f"  Recall:    {metrics['recall']:.4f}")
        print(f"  F1 Score:  {metrics['f1']:.4f}")

if __name__ == '__main__':
    main()
```

### 4. Dataset Sources

**SMS Spam Collection:**
- Download: https://www.kaggle.com/uciml/sms-spam-collection-dataset
- Format: CSV with columns: label, text

**Enron Email Dataset:**
- Download: https://www.kaggle.com/wcukierski/enron-email-dataset
- Larger dataset for better training

**SpamAssassin Public Corpus:**
- Download: https://spamassassin.apache.org/old/publiccorpus/

### 5. Frontend Integration

Update the frontend to call the Flask API instead of using the mock detector:

**utils/spamDetector.ts** (Modified):
```typescript
const BACKEND_URL = 'http://localhost:5000';

export async function detectSpam(subject: string, content: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, content }),
    });
    
    if (!response.ok) {
      throw new Error('Backend request failed');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error calling backend:', error);
    // Fallback to local detection
    return localDetectSpam(subject, content);
  }
}

// Keep the local detection as fallback
function localDetectSpam(subject: string, content: string) {
  // ... existing implementation
}
```

## Running the Full Stack Application

### Terminal 1 - Flask Backend:
```bash
cd backend
python app.py
# Server runs on http://localhost:5000
```

### Terminal 2 - React Frontend:
```bash
npm start
# Or in Figma Make, it runs automatically
```

## API Endpoints

### POST /api/predict
Predict if email is spam

**Request:**
```json
{
  "subject": "Congratulations! You won!",
  "content": "Click here to claim your prize..."
}
```

**Response:**
```json
{
  "isSpam": true,
  "spamScore": 0.87,
  "detectedPatterns": ["win prize", "click here"],
  "modelPredictions": {
    "naiveBayes": 0.92,
    "svm": 0.85,
    "randomForest": 0.89,
    "logisticRegression": 0.82
  }
}
```

### POST /api/train
Train models with dataset

**Request:**
```json
{
  "dataset_path": "data/spam mail.csv"
}
```

### GET /api/stats
Get model statistics

**Response:**
```json
{
  "totalFeatures": 3000,
  "ngramRange": [1, 3],
  "modelsLoaded": 4
}
```

## Model Comparison Results (Expected)

Based on SMS Spam Collection dataset:

| Model | Accuracy | Precision | Recall | F1 Score |
|-------|----------|-----------|--------|----------|
| Naive Bayes | 94.7% | 95.2% | 89.1% | 92.0% |
| SVM | 96.3% | 97.8% | 91.5% | 94.5% |
| Random Forest | 97.1% | 98.1% | 93.2% | 95.6% |
| Logistic Regression | 95.2% | 96.5% | 90.8% | 93.5% |

## Deployment

### Backend (Flask):
- Use Gunicorn for production: `gunicorn -w 4 app:app`
- Deploy to: Heroku, AWS, Google Cloud, or DigitalOcean
- Environment variables for configuration

### Frontend (React):
- Update BACKEND_URL to production URL
- Build: `npm run build`
- Deploy to: Vercel, Netlify, or AWS S3

## Security Notes

⚠️ **Important:** 
- Never expose sensitive data through the API
- Implement rate limiting to prevent abuse
- Use authentication for production
- Sanitize all inputs to prevent injection attacks
- Use HTTPS in production
- Don't store actual email content without user consent

## Testing

```python
# Test the API
import requests

response = requests.post('http://localhost:5000/api/predict', json={
    'subject': 'URGENT: Claim your prize now!',
    'content': 'You have won $1,000,000. Click here immediately!'
})

print(response.json())
```