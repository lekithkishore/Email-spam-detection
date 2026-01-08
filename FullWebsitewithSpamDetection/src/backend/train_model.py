"""
Train Spam Detection Models
Run this script first to train models on spam mail.csv

Usage:
    python train_model.py
"""

from spam_detector import SpamDetector
import os
import sys

def main():
    print("\n" + "=" * 60)
    print(" EMAIL SPAM DETECTION - MODEL TRAINING ")
    print("=" * 60 + "\n")
    
    # Check if dataset exists (try multiple locations)
    # Try current directory first, then parent directories
    possible_paths = [
        'spam mail.csv',
        '../spam mail.csv',
        '../../spam mail.csv',
        'FullWebsitewithSpamDetection/spam mail.csv'
    ]
    
    dataset_path = None
    for path in possible_paths:
        if os.path.exists(path):
            dataset_path = path
            break
    
    if not dataset_path:
        print(f"ERROR: Dataset 'spam mail.csv' not found!")
        print("\nPlease make sure 'spam mail.csv' is accessible.")
        print("Tried locations:", possible_paths)
        print("Dataset should have two columns: Category, Messages")
        print("Category values should be: 'ham' or 'spam'")
        sys.exit(1)
    
    print(f"Found dataset at: {dataset_path}")
    
    # Initialize detector
    detector = SpamDetector()
    
    # Train models
    try:
        results = detector.train_models(dataset_path)
        
        # Print summary
        print("\n" + "=" * 60)
        print(" TRAINING SUMMARY ")
        print("=" * 60)
        
        print("\nModel Performance on Test Set:")
        print("-" * 60)
        
        for model_name, metrics in results.items():
            model_display = model_name.replace('_', ' ').title()
            print(f"\n{model_display}:")
            print(f"  Accuracy:  {metrics['test_accuracy']*100:.2f}%")
            print(f"  Precision: {metrics['precision']*100:.2f}%")
            print(f"  Recall:    {metrics['recall']*100:.2f}%")
            print(f"  F1 Score:  {metrics['f1_score']*100:.2f}%")
        
        # Find best model
        best_model = max(results.items(), key=lambda x: x[1]['test_accuracy'])
        print("\n" + "-" * 60)
        print(f"Best Model: {best_model[0].replace('_', ' ').title()}")
        print(f"Accuracy: {best_model[1]['test_accuracy']*100:.2f}%")
        print("-" * 60)
        
        print("\n✓ Models trained and saved successfully!")
        print("\nYou can now run the Flask API server:")
        print("  python app.py")
        print("\n" + "=" * 60 + "\n")
        
    except Exception as e:
        print(f"\nERROR during training: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
