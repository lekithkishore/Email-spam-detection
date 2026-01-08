import { useState } from 'react';
import { Send, AlertTriangle } from 'lucide-react';
import { Email } from '../App';
import { detectSpam } from '../utils/spamDetector';

interface SenderInterfaceProps {
  onSendEmail: (email: Omit<Email, 'id' | 'timestamp'>) => void;
}

export function SenderInterface({ onSendEmail }: SenderInterfaceProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState<{
    isSpam: boolean;
    score: number;
    patterns: string[];
  } | null>(null);

  const handlePreview = () => {
    const result = detectSpam(subject, content);
    setPreview(result);
  };

  const handleSend = () => {
    if (!from || !to || !subject || !content) {
      alert('Please fill in all fields');
      return;
    }

    const result = detectSpam(subject, content);
    
    onSendEmail({
      from,
      to,
      subject,
      content,
      isSpam: result.isSpam,
      spamScore: result.score,
      detectedPatterns: result.patterns,
      modelPredictions: result.modelPredictions,
    });

    // Clear form
    setFrom('');
    setTo('');
    setSubject('');
    setContent('');
    setPreview(null);
    
    alert('Email sent successfully!');
  };

  const spamExamples = [
    {
      subject: '🎉 Congratulations! You Won ₹50,00,000!',
      content: 'Dear User, Your email ID has been selected as a winner of the International Mega Lottery 2025. To claim your ₹50,00,000 prize, reply with your full name, address, phone number, and bank details. Failure to respond within 24 hours will cancel your prize. Regards, Lottery Claims Dept.'
    },
    {
      subject: '⚠️ Urgent! Your SBI Account is Blocked',
      content: 'Dear Customer, Your SBI account has been temporarily suspended due to suspicious activity. Please verify your account immediately by clicking the link below: http://verify-sbi-security.com Failure to verify will result in permanent account closure. Thank you, SBI Support Team'
    },
    {
      subject: 'Work From Home – Earn ₹20,000 per week!',
      content: 'Hello, We selected you for a high-paying remote job. No interview required. Just register and pay a ₹999 security fee to start earning. Limited slots! Regards, HR Team, Global Job Services'
    },
    {
      subject: 'Meeting Tomorrow at 10 AM',
      content: 'Hi team, just a reminder about our project meeting tomorrow at 10 AM in Conference Room B. Please bring your progress reports and review the attached agenda. Thanks! Best regards, John'
    },
    {
      subject: 'Invoice #1234 - Payment Due',
      content: 'Dear Client, Please find attached invoice #1234 for services rendered in November. Payment is due by December 15th. Let me know if you have any questions. Thank you for your business. Best regards, Accounting Department'
    },
    {
      subject: 'Double Your Money in 24 Hours!',
      content: 'Dear Investor, Our AI-powered trading bot guarantees 200% profit in just a day. Start with only $50. Click below to deposit and watch your money grow! Join now: http://crypto-magic-profit.com'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Email Compose Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-gray-900 mb-6 flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-600" />
          Compose Email
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">From</label>
            <input
              type="email"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="sender@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">To</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="receiver@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Message</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here..."
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePreview}
              disabled={!subject || !content}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Spam Score
            </button>
            <button
              onClick={handleSend}
              disabled={!from || !to || !subject || !content}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Email
            </button>
          </div>
        </div>

        {/* Preview Result */}
        {preview && (
          <div className={`mt-6 p-4 rounded-lg border-2 ${
            preview.isSpam 
              ? 'bg-red-50 border-red-300' 
              : 'bg-green-50 border-green-300'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {preview.isSpam && <AlertTriangle className="w-5 h-5 text-red-600" />}
              <span className={preview.isSpam ? 'text-red-900' : 'text-green-900'}>
                {preview.isSpam ? 'Likely Spam' : 'Looks Legitimate'}
              </span>
            </div>
            <div className="text-sm text-gray-700 mb-2">
              Spam Score: <span className={preview.isSpam ? 'text-red-600' : 'text-green-600'}>
                {(preview.score * 100).toFixed(1)}%
              </span>
            </div>
            {preview.patterns.length > 0 && (
              <div className="text-sm text-gray-700">
                <div className="mb-1">Detected Patterns:</div>
                <div className="flex flex-wrap gap-2">
                  {preview.patterns.map((pattern, idx) => (
                    <span key={idx} className="bg-white px-2 py-1 rounded text-xs text-red-600">
                      {pattern}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Examples */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-gray-900 mb-4">Quick Test Examples</h2>
        <p className="text-sm text-gray-600 mb-6">
          Click on any example below to test the spam detection system:
        </p>

        <div className="space-y-4">
          {spamExamples.map((example, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSubject(example.subject);
                setContent(example.content);
                setFrom('test@example.com');
                setTo('receiver@example.com');
              }}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all"
            >
              <div className="text-sm text-gray-900 mb-2">{example.subject}</div>
              <div className="text-xs text-gray-600 line-clamp-2">{example.content}</div>
            </div>
          ))}
        </div>

        {/* Common Spam Patterns Info */}
        <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <h3 className="text-sm text-purple-900 mb-3">Common Spam Indicators</h3>
          <div className="space-y-2 text-xs text-gray-700">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5" />
              <div>Urgent language: "act now", "limited time", "expires soon"</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5" />
              <div>Money promises: "free money", "win prize", "cash reward"</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5" />
              <div>Suspicious links: "click here", "verify now", "confirm account"</div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5" />
              <div>Excessive caps, numbers, and special characters</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}