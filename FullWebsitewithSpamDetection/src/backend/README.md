# Email Spam Detection - Backend API

Complete Flask backend for training and serving spam detection ML models.

## 📁 Project Structure

```
backend/
├── app.py                 # Flask API server
├── spam_detector.py       # ML models implementation
├── train_model.py         # Training script
├── requirements.txt       # Python dependencies
├── spam mail.csv         # YOUR DATASET (place here)
└── models/               # Trained models (auto-created)
    ├── vectorizer.pkl
    ├── naive_bayes.pkl
    ├── svm.pkl
    ├── random_forest.pkl
    ├── logistic_regression.pkl
    └── training_stats.pkl
```

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Or install individually:
```bash
pip install flask flask-cors pandas numpy scikit-learn
```

### Step 2: Place Your Dataset

Put your `spam mail.csv` file in the `backend/` directory.

**Expected CSV format:**
```
Category,Messages
ham,"Go until jurong point, crazy.. Available only in bugis n great world..."
spam,"Free entry in 2 a wkly comp to win FA Cup Final Tkts..."
ham,"U dun say so early hor... U c already then say..."
spam,"WINNER!! As a valued customer, you have been selected..."
```

- **Column 1:** `Category` (values: `ham` or `spam`)
- **Column 2:** `Messages` (email/SMS text content)

### Step 3: Train Models

```bash
python train_model.py
```

This will:
- Load `spam mail.csv`
- Preprocess the data
- Train 4 ML models (Naive Bayes, SVM, Random Forest, Logistic Regression)
- Save trained models to `models/` directory
- Display performance metrics

Expected output:
```
==============================================================
 EMAIL SPAM DETECTION - MODEL TRAINING 
==============================================================

Loading dataset from: spam mail.csv
Dataset loaded: 5572 emails
  - Ham (legitimate): 4825
  - Spam: 747

Training Naive Bayes...
  Test Accuracy:       0.9830 (98.30%)
  Precision:           0.9756 (97.56%)
  Recall:              0.8889 (88.89%)
  F1 Score:            0.9302 (93.02%)

Training SVM...
  Test Accuracy:       0.9893 (98.93%)
  Precision:           0.9878 (98.78%)
  Recall:              0.9111 (91.11%)
  F1 Score:            0.9479 (94.79%)

Training Random Forest...
  Test Accuracy:       0.9884 (98.84%)
  Precision:           1.0000 (100.00%)
  Recall:              0.8889 (88.89%)
  F1 Score:            0.9412 (94.12%)

Training Logistic Regression...
  Test Accuracy:       0.9857 (98.57%)
  Precision:           0.9878 (98.78%)
  Recall:              0.8889 (88.89%)
  F1 Score:            0.9356 (93.56%)

Best Model: SVM
Accuracy: 98.93%

✓ Models trained and saved successfully!
```

## 🖥️ Run the API Server

```bash
python app.py
```

Server will start at: `http://localhost:5000`

## 📡 API Endpoints

### 1. Health Check
```http
GET http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "running",
  "models_loaded": true
}
```

### 2. Predict Spam
```http
POST http://localhost:5000/api/predict
Content-Type: application/json

{
  "subject": "Congratulations! You won!",
  "content": "Click here to claim your prize now!"
}
```

**Response:**
```json
{
  "isSpam": true,
  "spamScore": 0.87,
  "detectedPatterns": ["win money", "click here", "contains URL"],
  "modelPredictions": {
    "naiveBayes": 0.92,
    "svm": 0.85,
    "randomForest": 0.89,
    "logisticRegression": 0.82
  }
}
```

### 3. Get Statistics
```http
GET http://localhost:5000/api/stats
```

**Response:**
```json
{
  "dataset": {
    "total_emails": 5572,
    "spam_emails": 747,
    "ham_emails": 4825,
    "train_size": 4457,
    "test_size": 1115
  },
  "features": {
    "total_features": 3000,
    "vectorization": "TF-IDF",
    "ngram_range": "(1, 3)"
  },
  "models": {
    "naive_bayes": {
      "accuracy": 0.983,
      "precision": 0.976,
      "recall": 0.889,
      "f1_score": 0.930
    },
    "svm": {
      "accuracy": 0.989,
      "precision": 0.988,
      "recall": 0.911,
      "f1_score": 0.948
    },
    "random_forest": {
      "accuracy": 0.988,
      "precision": 1.0,
      "recall": 0.889,
      "f1_score": 0.941
    },
    "logistic_regression": {
      "accuracy": 0.986,
      "precision": 0.988,
      "recall": 0.889,
      "f1_score": 0.936
    }
  }
}
```

### 4. Retrain Models
```http
POST http://localhost:5000/api/retrain
Content-Type: application/json

{
  "dataset_path": "spam mail.csv"
}
```

## 🧪 Test with cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Predict spam
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"subject":"URGENT: Click here now!","content":"You won $1000000. Claim your prize immediately!"}'

# Get stats
curl http://localhost:5000/api/stats
```

## 🧪 Test with Python

```python
import requests

# Predict spam
response = requests.post('http://localhost:5000/api/predict', json={
    'subject': 'Meeting Tomorrow',
    'content': 'Hi team, reminder about our meeting tomorrow at 10 AM.'
})

print(response.json())
# Output: {'isSpam': False, 'spamScore': 0.12, ...}
```

## 🔗 Connect to React Frontend

Update the frontend to use the real API:

```typescript
// In your React app, create: /utils/apiSpamDetector.ts

const API_URL = 'http://localhost:5000';

export async function detectSpamWithAPI(subject: string, content: string) {
  try {
    const response = await fetch(`${API_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, content })
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Fallback to pattern-based detection
    throw error;
  }
}
```

## 📊 Model Details

### TF-IDF Vectorization
- **Max Features:** 3000
- **N-grams:** 1-3 (unigrams, bigrams, trigrams)
- **Min Document Frequency:** 2
- **Max Document Frequency:** 90%
- **Stop Words:** English

### Models Trained
1. **Naive Bayes (MultinomialNB)** - Fast, probabilistic
2. **SVM (Linear Kernel)** - High accuracy, good boundary separation
3. **Random Forest (100 trees)** - Ensemble method, robust
4. **Logistic Regression** - Linear, interpretable

### Ensemble Prediction
Final prediction uses weighted average:
- Naive Bayes: 20%
- SVM: 25%
- Random Forest: 35% (highest weight)
- Logistic Regression: 20%

## 🐛 Troubleshooting

### "Dataset not found" error
- Make sure `spam mail.csv` is in the `backend/` directory
- Check that the file is named exactly `spam mail.csv` (with space)

### "Models not loaded" error
- Run `python train_model.py` first to train models
- Check that `models/` directory was created with `.pkl` files

### Import errors
- Make sure all dependencies are installed: `pip install -r requirements.txt`
- Use Python 3.8 or higher

### Port 5000 already in use
- Change port in `app.py`: `app.run(port=5001)`
- Or kill the process using port 5000

## 🚀 Production Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Environment Variables
```bash
export FLASK_ENV=production
export PORT=5000
```

### Deploy to Heroku
```bash
# Add Procfile
echo "web: gunicorn app:app" > Procfile

# Deploy
heroku create your-spam-api
git push heroku main
```

## 📝 Dataset Format Notes

Your dataset should be a CSV with exactly this format:

```csv
Category,Messages
ham,"Normal message here"
spam,"Spam message here"
```

- **Category:** Must be either `ham` or `spam` (lowercase)
- **Messages:** Email or SMS text content
- Encoding: UTF-8 or Latin-1 (auto-detected)

## 🔒 Security Notes

- Don't expose this API publicly without authentication
- Add rate limiting for production use
- Use HTTPS in production
- Don't log sensitive email content
- Sanitize all inputs

## 📚 Additional Resources

- [Scikit-learn Documentation](https://scikit-learn.org/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [TF-IDF Explanation](https://en.wikipedia.org/wiki/Tf%E2%80%93idf)

## ✅ Checklist

- [ ] Python 3.8+ installed
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Dataset `spam mail.csv` placed in backend directory
- [ ] Models trained (`python train_model.py`)
- [ ] API server running (`python app.py`)
- [ ] Tested with cURL or browser
- [ ] Frontend connected (optional)

## 🎯 Expected Performance

With a typical spam dataset:
- **Accuracy:** 98-99%
- **Precision:** 97-100%
- **Recall:** 88-95%
- **F1 Score:** 93-95%

Your results may vary based on dataset quality and size.
