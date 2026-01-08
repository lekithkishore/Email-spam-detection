"""
Spam Detector - Machine Learning Models
Trains on spam mail.csv with columns: Category, Messages
"""

import pandas as pd
import numpy as np
import pickle
import re
import os
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import warnings
warnings.filterwarnings('ignore')

class SpamDetector:
    def __init__(self):
        self.vectorizer = None
        self.models = {}
        self.models_loaded = False
        self.training_stats = {}
        
        # Spam patterns for additional detection
        self.spam_patterns = [
            r'\b(win|won|winner)\s+(money|\$|₹|prize|cash)',
            r'\b(free|claim|collect)\s+(money|cash|reward|prize)',
            r'\b(urgent|immediately|act\s+now)',
            r'\b(click|verify|confirm)\s+(here|now|account)',
            r'\b(account|password)\s+(suspended|blocked|verify)',
            r'\blottery\b',
            r'\bcongratulations?\b',
            r'\bselected\b',
            r'https?://[^\s]+',  # URLs
        ]
    
    def preprocess_text(self, text):
        """
        Preprocess email text
        - Convert to lowercase
        - Remove extra whitespace
        - Keep special characters for pattern matching
        """
        if pd.isna(text):
            return ""
        
        # Convert to string and lowercase
        text = str(text).lower()
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text
    
    def extract_features(self, text):
        """Extract additional features beyond TF-IDF"""
        features = {}
        
        # Length features
        features['char_count'] = len(text)
        features['word_count'] = len(text.split())
        features['avg_word_length'] = np.mean([len(word) for word in text.split()]) if text.split() else 0
        
        # Special character features
        features['exclamation_count'] = text.count('!')
        features['question_count'] = text.count('?')
        features['dollar_count'] = text.count('$')
        features['rupee_count'] = text.count('₹')
        
        # Capital letters ratio
        if len(text) > 0:
            features['caps_ratio'] = sum(1 for c in text if c.isupper()) / len(text)
        else:
            features['caps_ratio'] = 0
        
        # URL count
        features['url_count'] = len(re.findall(r'https?://[^\s]+', text))
        
        return features
    
    def detect_patterns(self, text):
        """Detect spam patterns in text"""
        patterns_found = []
        for pattern in self.spam_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                patterns_found.append(pattern)
        return patterns_found
    
    def load_dataset(self, csv_path):
        """
        Load dataset from CSV
        Expected format: Category, Messages
        Category values: 'ham' or 'spam'
        """
        print(f"Loading dataset from: {csv_path}")
        
        # Read CSV file
        df = pd.read_csv(csv_path, encoding='latin-1')
        
        # Check if columns exist
        if 'Category' not in df.columns or 'Messages' not in df.columns:
            # Try to handle different column names
            if len(df.columns) >= 2:
                df.columns = ['Category', 'Messages'] + list(df.columns[2:])
            else:
                raise ValueError("CSV must have at least 2 columns: Category and Messages")
        
        # Keep only required columns
        df = df[['Category', 'Messages']]
        
        # Remove any NaN values
        df = df.dropna()
        
        # Convert category to binary (0 = ham, 1 = spam)
        df['label'] = df['Category'].map({'ham': 0, 'spam': 1})
        
        # Remove any rows where mapping failed
        df = df.dropna(subset=['label'])
        df['label'] = df['label'].astype(int)
        
        print(f"Dataset loaded: {len(df)} emails")
        print(f"  - Ham (legitimate): {(df['label'] == 0).sum()}")
        print(f"  - Spam: {(df['label'] == 1).sum()}")
        
        return df
    
    def train_models(self, dataset_path):
        """Train all ML models"""
        print("\n" + "=" * 60)
        print("TRAINING SPAM DETECTION MODELS")
        print("=" * 60)
        
        # Load dataset
        df = self.load_dataset(dataset_path)
        
        # Preprocess
        print("\nPreprocessing text...")
        df['processed_text'] = df['Messages'].apply(self.preprocess_text)
        
        # Split data
        print("Splitting data (80% train, 20% test)...")
        X_train, X_test, y_train, y_test = train_test_split(
            df['processed_text'], 
            df['label'], 
            test_size=0.2, 
            random_state=42,
            stratify=df['label']  # Maintain class distribution
        )
        
        print(f"Training set: {len(X_train)} emails")
        print(f"Test set: {len(X_test)} emails")
        
        # Vectorize using TF-IDF
        print("\nVectorizing text with TF-IDF...")
        self.vectorizer = TfidfVectorizer(
            max_features=3000,
            ngram_range=(1, 3),  # unigrams, bigrams, trigrams
            min_df=2,
            max_df=0.9,
            stop_words='english'
        )
        
        X_train_vec = self.vectorizer.fit_transform(X_train)
        X_test_vec = self.vectorizer.transform(X_test)
        
        print(f"Feature vector shape: {X_train_vec.shape}")
        
        # Initialize models
        self.models = {
            'naive_bayes': MultinomialNB(alpha=0.1),
            'svm': SVC(kernel='linear', probability=True, C=1.0, random_state=42),
            'random_forest': RandomForestClassifier(
                n_estimators=100, 
                max_depth=50,
                random_state=42,
                n_jobs=-1
            ),
            'logistic_regression': LogisticRegression(
                max_iter=1000, 
                C=1.0,
                random_state=42,
                n_jobs=-1
            )
        }
        
        # Train each model and evaluate
        print("\n" + "=" * 60)
        print("TRAINING MODELS")
        print("=" * 60)
        
        results = {}
        
        for name, model in self.models.items():
            print(f"\nTraining {name.replace('_', ' ').title()}...")
            
            # Train
            model.fit(X_train_vec, y_train)
            
            # Predict
            y_pred_train = model.predict(X_train_vec)
            y_pred_test = model.predict(X_test_vec)
            
            # Calculate metrics
            train_accuracy = accuracy_score(y_train, y_pred_train)
            test_accuracy = accuracy_score(y_test, y_pred_test)
            precision = precision_score(y_test, y_pred_test)
            recall = recall_score(y_test, y_pred_test)
            f1 = f1_score(y_test, y_pred_test)
            
            # Confusion matrix
            cm = confusion_matrix(y_test, y_pred_test)
            
            results[name] = {
                'train_accuracy': float(train_accuracy),
                'test_accuracy': float(test_accuracy),
                'precision': float(precision),
                'recall': float(recall),
                'f1_score': float(f1),
                'confusion_matrix': cm.tolist()
            }
            
            print(f"  Training Accuracy:   {train_accuracy:.4f} ({train_accuracy*100:.2f}%)")
            print(f"  Test Accuracy:       {test_accuracy:.4f} ({test_accuracy*100:.2f}%)")
            print(f"  Precision:           {precision:.4f} ({precision*100:.2f}%)")
            print(f"  Recall:              {recall:.4f} ({recall*100:.2f}%)")
            print(f"  F1 Score:            {f1:.4f} ({f1*100:.2f}%)")
            print(f"  Confusion Matrix:")
            print(f"    True Neg:  {cm[0][0]}  |  False Pos: {cm[0][1]}")
            print(f"    False Neg: {cm[1][0]}  |  True Pos:  {cm[1][1]}")
        
        # Store training statistics
        self.training_stats = {
            'dataset_size': len(df),
            'train_size': len(X_train),
            'test_size': len(X_test),
            'spam_count': int((df['label'] == 1).sum()),
            'ham_count': int((df['label'] == 0).sum()),
            'feature_count': X_train_vec.shape[1],
            'results': results
        }
        
        # Save models
        print("\n" + "=" * 60)
        print("SAVING MODELS")
        print("=" * 60)
        self.save_models()
        
        self.models_loaded = True
        
        print("\n✓ Training completed successfully!")
        print("=" * 60 + "\n")
        
        return results
    
    def predict_all(self, subject, content):
        """Get predictions from all models"""
        if not self.models_loaded:
            raise Exception("Models not loaded. Please train or load models first.")
        
        # Combine subject and content
        text = f"{subject} {content}"
        processed = self.preprocess_text(text)
        
        # Detect patterns
        patterns = self.detect_patterns(text)
        pattern_descriptions = [
            'win money', 'free money', 'urgent', 'click here', 
            'account suspended', 'lottery', 'congratulations', 
            'selected', 'contains URL'
        ]
        detected = [pattern_descriptions[i] for i, p in enumerate(self.spam_patterns) if re.search(p, text, re.IGNORECASE)]
        
        # Vectorize
        text_vec = self.vectorizer.transform([processed])
        
        # Get predictions from each model
        predictions = {}
        for name, model in self.models.items():
            pred_proba = model.predict_proba(text_vec)[0]
            predictions[name] = float(pred_proba[1])  # Probability of spam
        
        # Ensemble prediction (weighted average - Random Forest gets highest weight)
        ensemble = (
            predictions['naive_bayes'] * 0.20 +
            predictions['svm'] * 0.25 +
            predictions['random_forest'] * 0.35 +
            predictions['logistic_regression'] * 0.20
        )
        
        return {
            'naive_bayes': predictions['naive_bayes'],
            'svm': predictions['svm'],
            'random_forest': predictions['random_forest'],
            'logistic_regression': predictions['logistic_regression'],
            'ensemble': float(ensemble),
            'patterns': detected
        }
    
    def save_models(self):
        """Save trained models to disk"""
        # Create models directory if it doesn't exist
        os.makedirs('models', exist_ok=True)
        
        # Save vectorizer
        with open('models/vectorizer.pkl', 'wb') as f:
            pickle.dump(self.vectorizer, f)
        print("  ✓ Saved vectorizer")
        
        # Save each model
        for name, model in self.models.items():
            with open(f'models/{name}.pkl', 'wb') as f:
                pickle.dump(model, f)
            print(f"  ✓ Saved {name}")
        
        # Save training stats
        with open('models/training_stats.pkl', 'wb') as f:
            pickle.dump(self.training_stats, f)
        print("  ✓ Saved training statistics")
    
    def load_models(self):
        """Load trained models from disk"""
        try:
            # Load vectorizer
            with open('models/vectorizer.pkl', 'rb') as f:
                self.vectorizer = pickle.load(f)
            
            # Load models
            model_names = ['naive_bayes', 'svm', 'random_forest', 'logistic_regression']
            for name in model_names:
                with open(f'models/{name}.pkl', 'rb') as f:
                    self.models[name] = pickle.load(f)
            
            # Load training stats
            if os.path.exists('models/training_stats.pkl'):
                with open('models/training_stats.pkl', 'rb') as f:
                    self.training_stats = pickle.load(f)
            
            self.models_loaded = True
            print("✓ Models loaded successfully")
            
        except FileNotFoundError as e:
            print(f"✗ Error loading models: {e}")
            print("Please train models first by running: python train_model.py")
            self.models_loaded = False
    
    def get_stats(self):
        """Get model statistics"""
        if not self.training_stats:
            return {
                'message': 'No training statistics available. Please train models first.'
            }
        
        stats = {
            'dataset': {
                'total_emails': self.training_stats.get('dataset_size', 0),
                'spam_emails': self.training_stats.get('spam_count', 0),
                'ham_emails': self.training_stats.get('ham_count', 0),
                'train_size': self.training_stats.get('train_size', 0),
                'test_size': self.training_stats.get('test_size', 0),
            },
            'features': {
                'total_features': self.training_stats.get('feature_count', 0),
                'vectorization': 'TF-IDF',
                'ngram_range': '(1, 3)'
            },
            'models': {}
        }
        
        # Add model results
        if 'results' in self.training_stats:
            for model_name, results in self.training_stats['results'].items():
                stats['models'][model_name] = {
                    'accuracy': results['test_accuracy'],
                    'precision': results['precision'],
                    'recall': results['recall'],
                    'f1_score': results['f1_score']
                }
        
        return stats

if __name__ == "__main__":
    # Test the detector
    detector = SpamDetector()
    
    # Train if dataset exists
    if os.path.exists('spam mail.csv'):
        detector.train_models('spam mail.csv')
    else:
        print("Dataset 'spam mail.csv' not found!")
        print("Please place your dataset in the same directory as this script.")
