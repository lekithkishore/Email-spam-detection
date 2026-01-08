import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Email } from '../App';
import { detectSpamAPI } from '../utils/spamDetector';

interface SenderProps {
  onSendEmail: (email: Email) => void;
}

export function Sender({ onSendEmail }: SenderProps) {
  const [from, setFrom] = useState('sender@example.com');
  const [to, setTo] = useState('receiver@example.com');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      alert('Please fill in subject and body');
      return;
    }

    setIsSending(true);

    // Simulate ML model detection (in production, calls Flask API)
    const detection = await detectSpamAPI(subject, body);

    const email: Email = {
      id: Date.now().toString(),
      from,
      to,
      subject,
      body,
      timestamp: new Date(),
      isSpam: detection.isSpam,
      spamScore: detection.spamScore,
      detectionMethod: detection.detectionMethod,
    };

    // Simulate API call delay
    setTimeout(() => {
      onSendEmail(email);
      setIsSending(false);
      
      // Clear form
      setSubject('');
      setBody('');
      
      alert(`Email sent! ML Detection: ${detection.isSpam ? 'SPAM' : 'LEGITIMATE'} (${(detection.spamScore * 100).toFixed(1)}% confidence)`);
    }, 800);
  };

  const fillSpamExample = () => {
    setSubject('URGENT: You Won $1,000,000!!!');
    setBody('Congratulations! You are the lucky winner! Click now to claim your FREE REWARD! This is a limited time offer! Win money today! Act immediately before it expires! Call now for instant access!!!');
  };

  const fillLegitExample = () => {
    setSubject('Project Update - Q4 Review');
    setBody('Hi team, I wanted to share the latest updates on our Q4 project. We have made significant progress and are on track to meet our deadlines. Please review the attached documents and let me know if you have any questions. Thanks!');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl mb-1">📧 Send Email</h2>
          <p className="text-gray-600 text-sm">
            Compose and send emails - ML model will classify on receiver's end
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fillSpamExample}
            className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            Fill Spam Example
          </button>
          <button
            onClick={fillLegitExample}
            className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
          >
            Fill Legit Example
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* From */}
        <div>
          <label className="block text-sm mb-2 text-gray-700">From</label>
          <input
            type="email"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        {/* To */}
        <div>
          <label className="block text-sm mb-2 text-gray-700">To</label>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="recipient@email.com"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm mb-2 text-gray-700">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter subject..."
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm mb-2 text-gray-700">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px] resize-y"
            placeholder="Type your message here..."
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={isSending}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              Processing with ML Models...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Email
            </>
          )}
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>🤖 ML Detection:</strong> When you send an email, it will be automatically
          analyzed using machine learning models (Naive Bayes, SVM, Random Forest, etc.)
          and classified as spam or legitimate based on n-gram patterns and features.
        </p>
      </div>
    </div>
  );
}
