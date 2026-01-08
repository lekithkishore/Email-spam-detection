import { Email } from '../App';
import { BarChart3, TrendingUp, Target, Zap } from 'lucide-react';

interface ModelComparisonProps {
  emails: Email[];
}

export function ModelComparison({ emails }: ModelComparisonProps) {
  // Calculate metrics for each model
  const calculateMetrics = (modelName: keyof Email['modelPredictions']) => {
    if (emails.length === 0) return { accuracy: 0, precision: 0, recall: 0, f1: 0 };

    let tp = 0, fp = 0, tn = 0, fn = 0;

    emails.forEach(email => {
      const prediction = email.modelPredictions[modelName] >= 0.5;
      const actual = email.isSpam;

      if (prediction && actual) tp++;
      else if (prediction && !actual) fp++;
      else if (!prediction && !actual) tn++;
      else fn++;
    });

    const accuracy = (tp + tn) / (tp + fp + tn + fn);
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? 2 * (precision * recall) / (precision + recall) : 0;

    return { accuracy, precision, recall, f1 };
  };

  const models = [
    { name: 'naiveBayes', label: 'Naive Bayes', icon: BarChart3, color: 'blue' },
    { name: 'svm', label: 'SVM', icon: Target, color: 'purple' },
    { name: 'randomForest', label: 'Random Forest', icon: TrendingUp, color: 'green' },
    { name: 'logisticRegression', label: 'Logistic Regression', icon: Zap, color: 'orange' }
  ] as const;

  const modelMetrics = models.map(model => ({
    ...model,
    metrics: calculateMetrics(model.name)
  }));

  // Find best model
  const bestModel = modelMetrics.reduce((best, current) => 
    current.metrics.accuracy > best.metrics.accuracy ? current : best
  , modelMetrics[0]);

  const spamCount = emails.filter(e => e.isSpam).length;
  const legitCount = emails.filter(e => !e.isSpam).length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-sm text-gray-600">Total Analyzed</div>
          </div>
          <div className="text-gray-900">{emails.length}</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <Target className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-sm text-gray-600">Spam Detected</div>
          </div>
          <div className="text-gray-900">{spamCount}</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm text-gray-600">Legitimate</div>
          </div>
          <div className="text-gray-900">{legitCount}</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-sm text-gray-600">Best Model</div>
          </div>
          <div className="text-sm text-gray-900">{bestModel.label}</div>
        </div>
      </div>

      {/* Model Comparison */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-gray-900">Model Performance Comparison</h2>
          <p className="text-sm text-gray-600 mt-1">
            Comparative analysis of different ML models for spam detection
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modelMetrics.map(model => {
              const Icon = model.icon;
              const colorClasses = {
                blue: 'bg-blue-50 border-blue-200 text-blue-700',
                purple: 'bg-purple-50 border-purple-200 text-purple-700',
                green: 'bg-green-50 border-green-200 text-green-700',
                orange: 'bg-orange-50 border-orange-200 text-orange-700'
              };

              return (
                <div
                  key={model.name}
                  className={`p-6 rounded-lg border-2 ${colorClasses[model.color]}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6" />
                    <h3 className="text-gray-900">{model.label}</h3>
                    {model.name === bestModel.name && (
                      <span className="ml-auto text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded">
                        Best
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">Accuracy</span>
                        <span className="text-sm text-gray-900">
                          {(model.metrics.accuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                          style={{ width: `${model.metrics.accuracy * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">Precision</span>
                        <span className="text-sm text-gray-900">
                          {(model.metrics.precision * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-600"
                          style={{ width: `${model.metrics.precision * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">Recall</span>
                        <span className="text-sm text-gray-900">
                          {(model.metrics.recall * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                          style={{ width: `${model.metrics.recall * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">F1 Score</span>
                        <span className="text-sm text-gray-900">
                          {(model.metrics.f1 * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                          style={{ width: `${model.metrics.f1 * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metrics Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-gray-900 mb-4">Model Descriptions</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-gray-900 mb-1">Naive Bayes</div>
              <p className="text-gray-600">
                Probabilistic classifier based on Bayes' theorem. Fast and efficient for text classification.
              </p>
            </div>
            <div>
              <div className="text-gray-900 mb-1">SVM (Support Vector Machine)</div>
              <p className="text-gray-600">
                Finds optimal hyperplane to separate spam from legitimate emails. Good for high-dimensional data.
              </p>
            </div>
            <div>
              <div className="text-gray-900 mb-1">Random Forest</div>
              <p className="text-gray-600">
                Ensemble of decision trees. Robust and handles non-linear patterns well.
              </p>
            </div>
            <div>
              <div className="text-gray-900 mb-1">Logistic Regression</div>
              <p className="text-gray-600">
                Linear model for binary classification. Simple, interpretable, and effective.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-gray-900 mb-4">Metrics Explanation</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-gray-900 mb-1">Accuracy</div>
              <p className="text-gray-600">
                Percentage of correct predictions (both spam and legitimate) out of all predictions.
              </p>
            </div>
            <div>
              <div className="text-gray-900 mb-1">Precision</div>
              <p className="text-gray-600">
                Of all emails marked as spam, how many were actually spam. Higher is better.
              </p>
            </div>
            <div>
              <div className="text-gray-900 mb-1">Recall</div>
              <p className="text-gray-600">
                Of all actual spam emails, how many were correctly identified. Higher is better.
              </p>
            </div>
            <div>
              <div className="text-gray-900 mb-1">F1 Score</div>
              <p className="text-gray-600">
                Harmonic mean of precision and recall. Balances both metrics for overall performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* N-gram Patterns */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-gray-900 mb-4">Common N-gram Spam Patterns Detected</h3>
        <p className="text-sm text-gray-600 mb-6">
          These patterns are commonly found in spam emails and are used by our models for detection:
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'win money', 'free reward', 'urgent click', 'act now', 'limited time',
            'click here', 'verify account', 'confirm password', 'expire soon',
            'congratulations won', 'claim prize', 'special offer', 'risk free',
            'call now', 'order now', 'apply now', '100% free'
          ].map(pattern => (
            <div
              key={pattern}
              className="px-3 py-2 bg-red-50 text-red-700 rounded border border-red-200 text-sm text-center"
            >
              "{pattern}"
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
