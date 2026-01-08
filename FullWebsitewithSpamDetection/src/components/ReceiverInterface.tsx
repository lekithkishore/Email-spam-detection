import { useState } from 'react';
import { Email } from '../App';
import { Inbox, Archive, AlertTriangle, CheckCircle, Clock, User, Mail } from 'lucide-react';

interface ReceiverInterfaceProps {
  emails: Email[];
}

type FilterType = 'all' | 'inbox' | 'spam';

export function ReceiverInterface({ emails }: ReceiverInterfaceProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const filteredEmails = emails.filter(email => {
    if (filter === 'inbox') return !email.isSpam;
    if (filter === 'spam') return email.isSpam;
    return true;
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const spamCount = emails.filter(e => e.isSpam).length;
  const inboxCount = emails.filter(e => !e.isSpam).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 sticky top-32">
          <h2 className="text-gray-900 mb-4">Mailbox</h2>
          
          <div className="space-y-2">
            <button
              onClick={() => setFilter('all')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Archive className="w-4 h-4" />
                <span>All Mail</span>
              </div>
              <span className="text-sm bg-gray-200 px-2 py-0.5 rounded-full">
                {emails.length}
              </span>
            </button>

            <button
              onClick={() => setFilter('inbox')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                filter === 'inbox'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Inbox className="w-4 h-4" />
                <span>Inbox</span>
              </div>
              <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {inboxCount}
              </span>
            </button>

            <button
              onClick={() => setFilter('spam')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                filter === 'spam'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4" />
                <span>Spam</span>
              </div>
              <span className="text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                {spamCount}
              </span>
            </button>
          </div>

          {/* Filter Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-700 mb-3">Classification Info</div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-gray-600">Legitimate: Score &lt; 50%</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 text-red-600" />
                <span className="text-gray-600">Spam: Score ≥ 50%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email List and Detail */}
      <div className="lg:col-span-2 space-y-6">
        {/* Email List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-gray-900">
              {filter === 'all' && 'All Emails'}
              {filter === 'inbox' && 'Inbox'}
              {filter === 'spam' && 'Spam Folder'}
            </h2>
          </div>

          {filteredEmails.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <div className="text-gray-900 mb-2">No emails yet</div>
              <p className="text-sm text-gray-600">
                Send some emails from the Sender tab to see them here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredEmails.map(email => (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedEmail?.id === email.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className={`mt-1 p-2 rounded-full ${
                      email.isSpam ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      {email.isSpam ? (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>

                    {/* Email Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-700 truncate">{email.from}</span>
                        <Clock className="w-3 h-3 text-gray-400 ml-auto" />
                        <span className="text-xs text-gray-500">
                          {email.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-gray-900 mb-1 truncate">{email.subject}</div>
                      <div className="text-sm text-gray-600 line-clamp-1">{email.content}</div>
                      
                      {/* Spam Score Badge */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          email.isSpam 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {email.isSpam ? 'SPAM' : 'SAFE'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Confidence: {(email.spamScore * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Email Detail */}
        {selectedEmail && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className={`px-6 py-4 border-b ${
              selectedEmail.isSpam 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {selectedEmail.isSpam ? (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                <span className={selectedEmail.isSpam ? 'text-red-900' : 'text-green-900'}>
                  {selectedEmail.isSpam ? 'Spam Email Detected' : 'Legitimate Email'}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">From</div>
                  <div className="text-gray-900">{selectedEmail.from}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">To</div>
                  <div className="text-gray-900">{selectedEmail.to}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Subject</div>
                  <div className="text-gray-900">{selectedEmail.subject}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Date</div>
                  <div className="text-gray-900">{selectedEmail.timestamp.toLocaleString()}</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="text-sm text-gray-600 mb-2">Message</div>
                <div className="text-gray-800 whitespace-pre-wrap">{selectedEmail.content}</div>
              </div>

              {/* ML Analysis */}
              <div className="border-t border-gray-200 pt-4">
                <div className="text-gray-900 mb-4">ML Model Analysis</div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {Object.entries(selectedEmail.modelPredictions).map(([model, score]) => (
                    <div key={model} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-sm text-gray-700 mb-2 capitalize">
                        {model.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              score >= 0.5 ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${score * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-700">{(score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedEmail.detectedPatterns.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-sm text-red-900 mb-2">Detected Spam Patterns</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmail.detectedPatterns.map((pattern, idx) => (
                        <span key={idx} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                          {pattern}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}