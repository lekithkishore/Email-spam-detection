import { useState } from 'react';
import { Email } from '../App';
import { EmailCard } from './EmailCard';
import { Shield, Mail, TrendingUp } from 'lucide-react';

interface ReceiverProps {
  emails: Email[];
}

export function Receiver({ emails }: ReceiverProps) {
  const [filter, setFilter] = useState<'all' | 'inbox' | 'spam'>('all');

  const spamEmails = emails.filter(email => email.isSpam);
  const inboxEmails = emails.filter(email => !email.isSpam);

  const displayEmails = 
    filter === 'spam' ? spamEmails :
    filter === 'inbox' ? inboxEmails :
    emails;

  const spamCount = spamEmails.length;
  const inboxCount = inboxEmails.length;
  const spamRate = emails.length > 0 ? (spamCount / emails.length * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Emails</p>
              <p className="text-3xl">{emails.length}</p>
            </div>
            <Mail className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Spam Detected</p>
              <p className="text-3xl text-red-600">{spamCount}</p>
            </div>
            <Shield className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Spam Rate</p>
              <p className="text-3xl text-orange-600">{spamRate}%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-md p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2.5 px-4 rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Emails ({emails.length})
          </button>
          <button
            onClick={() => setFilter('inbox')}
            className={`flex-1 py-2.5 px-4 rounded-md transition-colors ${
              filter === 'inbox'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            ✅ Inbox ({inboxCount})
          </button>
          <button
            onClick={() => setFilter('spam')}
            className={`flex-1 py-2.5 px-4 rounded-md transition-colors ${
              filter === 'spam'
                ? 'bg-red-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🚫 Spam ({spamCount})
          </button>
        </div>
      </div>

      {/* Email List */}
      <div className="space-y-4">
        {displayEmails.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No emails in this category</p>
          </div>
        ) : (
          displayEmails.map(email => (
            <EmailCard key={email.id} email={email} />
          ))
        )}
      </div>

      {/* Model Comparison Info */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg mb-3">🧠 ML Models Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4">
            <strong className="text-purple-700">Naive Bayes</strong>
            <p className="text-gray-600 mt-1">
              Probabilistic classifier based on Bayes theorem. Fast and efficient for text classification.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <strong className="text-blue-700">Logistic Regression</strong>
            <p className="text-gray-600 mt-1">
              Linear model for binary classification. Works well with TF-IDF features.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <strong className="text-green-700">SVM (Support Vector Machine)</strong>
            <p className="text-gray-600 mt-1">
              Finds optimal hyperplane to separate spam from ham. High accuracy on small datasets.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <strong className="text-orange-700">Random Forest</strong>
            <p className="text-gray-600 mt-1">
              Ensemble of decision trees. Robust and handles non-linear patterns well.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
