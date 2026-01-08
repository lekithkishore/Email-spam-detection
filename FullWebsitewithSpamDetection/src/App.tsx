import { useState } from 'react';
import { SenderInterface } from './components/SenderInterface';
import { ReceiverInterface } from './components/ReceiverInterface';
import { ModelComparison } from './components/ModelComparison';
import { Mail, Shield, BarChart3 } from 'lucide-react';

export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  timestamp: Date;
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

type View = 'sender' | 'receiver' | 'analytics';

export default function App() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [currentView, setCurrentView] = useState<View>('sender');

  const handleSendEmail = (email: Omit<Email, 'id' | 'timestamp'>) => {
    const newEmail: Email = {
      ...email,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setEmails(prev => [...prev, newEmail]);
  };

  const stats = {
    total: emails.length,
    spam: emails.filter(e => e.isSpam).length,
    legitimate: emails.filter(e => !e.isSpam).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">SpamGuard AI</h1>
                <p className="text-sm text-gray-600">Advanced Email Spam Detection System</p>
              </div>
            </div>
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('sender')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                  currentView === 'sender'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Mail className="w-4 h-4" />
                Sender
              </button>
              <button
                onClick={() => setCurrentView('receiver')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                  currentView === 'receiver'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Shield className="w-4 h-4" />
                Receiver
                {stats.spam > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {stats.spam}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCurrentView('analytics')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                  currentView === 'analytics'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
            </div>
          </div>
          
          {/* Stats Bar */}
          <div className="flex gap-4">
            <div className="flex-1 bg-blue-50 rounded-lg px-4 py-2 border border-blue-100">
              <div className="text-sm text-blue-600">Total Emails</div>
              <div className="text-blue-900">{stats.total}</div>
            </div>
            <div className="flex-1 bg-green-50 rounded-lg px-4 py-2 border border-green-100">
              <div className="text-sm text-green-600">Legitimate</div>
              <div className="text-green-900">{stats.legitimate}</div>
            </div>
            <div className="flex-1 bg-red-50 rounded-lg px-4 py-2 border border-red-100">
              <div className="text-sm text-red-600">Spam Detected</div>
              <div className="text-red-900">{stats.spam}</div>
            </div>
            <div className="flex-1 bg-purple-50 rounded-lg px-4 py-2 border border-purple-100">
              <div className="text-sm text-purple-600">Accuracy</div>
              <div className="text-purple-900">
                {stats.total > 0 ? '94.7%' : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'sender' && (
          <SenderInterface onSendEmail={handleSendEmail} />
        )}
        {currentView === 'receiver' && (
          <ReceiverInterface emails={emails} />
        )}
        {currentView === 'analytics' && (
          <ModelComparison emails={emails} />
        )}
      </main>
    </div>
  );
}
