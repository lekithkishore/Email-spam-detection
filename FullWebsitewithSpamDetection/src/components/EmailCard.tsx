import { useState } from 'react';
import { Email } from '../App';
import { Mail, Clock, User, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface EmailCardProps {
  email: Email;
}

export function EmailCard({ email }: EmailCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const spamPercentage = (email.spamScore || 0) * 100;

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 transition-all ${
        email.isSpam 
          ? 'border-red-500' 
          : 'border-green-500'
      }`}
    >
      {/* Header */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Classification Badge */}
            <div className="flex items-center gap-2 mb-2">
              {email.isSpam ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  SPAM
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                  LEGITIMATE
                </span>
              )}
              <span className="text-xs text-gray-500">
                {email.detectionMethod}
              </span>
            </div>

            {/* Subject */}
            <h3 className="mb-1 truncate pr-4">{email.subject}</h3>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {email.from}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(email.timestamp)}
              </div>
            </div>
          </div>

          {/* Spam Score */}
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <div className={`text-2xl ${
                email.isSpam ? 'text-red-600' : 'text-green-600'
              }`}>
                {spamPercentage.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500">spam score</div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* Email Body */}
          <div className="p-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>Message Body:</span>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700 whitespace-pre-wrap">{email.body}</p>
            </div>
          </div>

          {/* Spam Score Visualization */}
          <div className="p-4 bg-white">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-gray-600">Spam Probability</span>
              <span className={email.isSpam ? 'text-red-600' : 'text-green-600'}>
                {spamPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  email.isSpam 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                    : 'bg-gradient-to-r from-green-400 to-green-600'
                }`}
                style={{ width: `${spamPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Legitimate</span>
              <span>Spam</span>
            </div>
          </div>

          {/* Detection Features */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200">
            <h4 className="text-sm mb-3 text-gray-700">🔍 Detection Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded p-3">
                <div className="text-gray-600 mb-1">Model Used:</div>
                <div className="text-blue-700">{email.detectionMethod}</div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="text-gray-600 mb-1">Classification:</div>
                <div className={email.isSpam ? 'text-red-700' : 'text-green-700'}>
                  {email.isSpam ? 'Spam (> 50% threshold)' : 'Ham (≤ 50% threshold)'}
                </div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="text-gray-600 mb-1">Features Analyzed:</div>
                <div className="text-gray-700">N-grams, TF-IDF, Keywords</div>
              </div>
              <div className="bg-white rounded p-3">
                <div className="text-gray-600 mb-1">Processing Time:</div>
                <div className="text-gray-700">~45ms</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
