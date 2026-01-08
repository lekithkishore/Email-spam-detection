"""
Test script for the Spam Detection API
Run this after starting the server with: python app.py
"""

import requests
import json

API_URL = 'http://localhost:5000'

def test_health():
    """Test health endpoint"""
    print("\n" + "="*60)
    print("Testing Health Endpoint")
    print("="*60)
    
    response = requests.get(f'{API_URL}/api/health')
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_spam_email():
    """Test with obvious spam"""
    print("\n" + "="*60)
    print("Testing Spam Detection - Spam Email")
    print("="*60)
    
    data = {
        "subject": "URGENT: You Won $1,000,000!",
        "content": "Congratulations! Your email has been selected to win $1,000,000. Click here immediately to claim your prize before it expires. Limited time offer!"
    }
    
    print(f"\nInput:")
    print(f"  Subject: {data['subject']}")
    print(f"  Content: {data['content'][:80]}...")
    
    response = requests.post(f'{API_URL}/api/predict', json=data)
    result = response.json()
    
    print(f"\nResult:")
    print(f"  Is Spam: {result['isSpam']}")
    print(f"  Spam Score: {result['spamScore']:.2%}")
    print(f"  Patterns: {', '.join(result['detectedPatterns'])}")
    print(f"\n  Model Predictions:")
    for model, score in result['modelPredictions'].items():
        print(f"    {model}: {score:.2%}")
    
    return result['isSpam'] == True

def test_legitimate_email():
    """Test with legitimate email"""
    print("\n" + "="*60)
    print("Testing Spam Detection - Legitimate Email")
    print("="*60)
    
    data = {
        "subject": "Team Meeting Tomorrow",
        "content": "Hi team, just a reminder about our project meeting tomorrow at 10 AM in Conference Room B. Please bring your progress reports. Thanks!"
    }
    
    print(f"\nInput:")
    print(f"  Subject: {data['subject']}")
    print(f"  Content: {data['content']}")
    
    response = requests.post(f'{API_URL}/api/predict', json=data)
    result = response.json()
    
    print(f"\nResult:")
    print(f"  Is Spam: {result['isSpam']}")
    print(f"  Spam Score: {result['spamScore']:.2%}")
    print(f"  Patterns: {', '.join(result['detectedPatterns']) if result['detectedPatterns'] else 'None detected'}")
    print(f"\n  Model Predictions:")
    for model, score in result['modelPredictions'].items():
        print(f"    {model}: {score:.2%}")
    
    return result['isSpam'] == False

def test_indian_spam():
    """Test with Indian spam patterns"""
    print("\n" + "="*60)
    print("Testing Spam Detection - Indian Spam")
    print("="*60)
    
    data = {
        "subject": "⚠️ Urgent! Your SBI Account is Blocked",
        "content": "Dear Customer, Your SBI account has been suspended due to suspicious activity. Verify your account immediately by clicking below. Failure to verify will result in permanent account closure."
    }
    
    print(f"\nInput:")
    print(f"  Subject: {data['subject']}")
    print(f"  Content: {data['content']}")
    
    response = requests.post(f'{API_URL}/api/predict', json=data)
    result = response.json()
    
    print(f"\nResult:")
    print(f"  Is Spam: {result['isSpam']}")
    print(f"  Spam Score: {result['spamScore']:.2%}")
    print(f"  Patterns: {', '.join(result['detectedPatterns'])}")
    print(f"\n  Model Predictions:")
    for model, score in result['modelPredictions'].items():
        print(f"    {model}: {score:.2%}")
    
    return result['isSpam'] == True

def test_stats():
    """Test stats endpoint"""
    print("\n" + "="*60)
    print("Testing Statistics Endpoint")
    print("="*60)
    
    response = requests.get(f'{API_URL}/api/stats')
    stats = response.json()
    
    if 'dataset' in stats:
        print(f"\nDataset Info:")
        print(f"  Total Emails: {stats['dataset']['total_emails']}")
        print(f"  Spam: {stats['dataset']['spam_emails']}")
        print(f"  Ham: {stats['dataset']['ham_emails']}")
        print(f"  Train Size: {stats['dataset']['train_size']}")
        print(f"  Test Size: {stats['dataset']['test_size']}")
        
        print(f"\nModel Performance:")
        for model, metrics in stats['models'].items():
            print(f"  {model.replace('_', ' ').title()}:")
            print(f"    Accuracy:  {metrics['accuracy']:.2%}")
            print(f"    Precision: {metrics['precision']:.2%}")
            print(f"    Recall:    {metrics['recall']:.2%}")
            print(f"    F1 Score:  {metrics['f1_score']:.2%}")
    else:
        print(json.dumps(stats, indent=2))
    
    return response.status_code == 200

def main():
    print("\n" + "="*60)
    print(" EMAIL SPAM DETECTION API - TEST SUITE ")
    print("="*60)
    print("\nMake sure the API server is running:")
    print("  python app.py")
    print("\n" + "="*60)
    
    try:
        results = []
        
        # Run tests
        results.append(("Health Check", test_health()))
        results.append(("Spam Email Detection", test_spam_email()))
        results.append(("Legitimate Email Detection", test_legitimate_email()))
        results.append(("Indian Spam Detection", test_indian_spam()))
        results.append(("Statistics", test_stats()))
        
        # Print summary
        print("\n" + "="*60)
        print(" TEST SUMMARY ")
        print("="*60)
        
        for test_name, passed in results:
            status = "✓ PASSED" if passed else "✗ FAILED"
            print(f"  {test_name:.<45} {status}")
        
        total = len(results)
        passed = sum(1 for _, p in results if p)
        
        print("\n" + "="*60)
        print(f" Total: {passed}/{total} tests passed")
        print("="*60 + "\n")
        
    except requests.exceptions.ConnectionError:
        print("\n✗ ERROR: Could not connect to API server")
        print("  Make sure the server is running: python app.py")
        print("  Server should be at: http://localhost:5000\n")
    except Exception as e:
        print(f"\n✗ ERROR: {e}\n")

if __name__ == '__main__':
    main()
