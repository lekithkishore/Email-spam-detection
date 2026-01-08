/**
 * API-based Spam Detection
 * Connects to Python Flask backend for real ML model predictions
 * Falls back to pattern-based detection if API is unavailable
 */

import { detectSpam as patternBasedDetection } from './spamDetector';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ApiSpamResult {
  isSpam: boolean;
  spamScore: number;
  detectedPatterns: string[];
  modelPredictions: {
    naiveBayes: number;
    svm: number;
    randomForest: number;
    logisticRegression: number;
  };
}

/**
 * Detect spam using the Flask API backend
 * Falls back to pattern-based detection if API is unavailable
 */
export async function detectSpamWithAPI(subject: string, content: string): Promise<ApiSpamResult> {
  try {
    const response = await fetch(`${API_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, content }),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const result = await response.json();
    
    return {
      isSpam: result.isSpam,
      spamScore: result.spamScore,
      detectedPatterns: result.detectedPatterns,
      modelPredictions: {
        naiveBayes: result.modelPredictions.naiveBayes,
        svm: result.modelPredictions.svm,
        randomForest: result.modelPredictions.randomForest,
        logisticRegression: result.modelPredictions.logisticRegression,
      },
    };
  } catch (error) {
    console.warn('API unavailable, using pattern-based detection:', error);
    // Fallback to pattern-based detection
    return patternBasedDetection(subject, content);
  }
}

/**
 * Check if the API backend is available
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/health`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.status === 'running' && data.models_loaded === true;
  } catch (error) {
    return false;
  }
}

/**
 * Get training statistics from the backend
 */
export async function getTrainingStats() {
  try {
    const response = await fetch(`${API_URL}/api/stats`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching training stats:', error);
    return null;
  }
}

/**
 * Auto-detect whether to use API or pattern-based detection
 * Call this once when the app loads
 */
export async function initializeDetector(): Promise<'api' | 'pattern'> {
  const isApiAvailable = await checkAPIHealth();
  
  if (isApiAvailable) {
    console.log('✓ Using ML API backend for spam detection');
    return 'api';
  } else {
    console.log('⚠ API unavailable, using pattern-based detection');
    return 'pattern';
  }
}

// Export for backwards compatibility
export { detectSpam as patternBasedDetection } from './spamDetector';
