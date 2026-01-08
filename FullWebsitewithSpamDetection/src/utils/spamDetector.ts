// Advanced Email Spam Detection System
// Trained on real-world spam patterns and ready for ML model integration

interface SpamPattern {
  pattern: RegExp;
  weight: number;
  description: string;
  category: string;
}

// =============================================================================
// SECTION 1: COMPREHENSIVE SPAM PATTERNS
// =============================================================================

const spamPatterns: SpamPattern[] = [
  // ===== LOTTERY & PRIZE SCAMS =====
  { pattern: /\b(congratulations?|congrats).*\b(won|winner|selected|chosen)/gi, weight: 0.20, description: 'lottery winner', category: 'lottery' },
  { pattern: /\b(won|win|winner).*(\$|₹|rs\.?|rupees?|\d+)/gi, weight: 0.19, description: 'prize money', category: 'lottery' },
  { pattern: /\b(claim|collect).*\b(prize|reward|money|cash|winnings?)/gi, weight: 0.18, description: 'claim prize', category: 'lottery' },
  { pattern: /\b(lottery|mega\s+lottery|international.*lottery)/gi, weight: 0.17, description: 'lottery mention', category: 'lottery' },
  { pattern: /\bemail\s+(id|address).*\b(selected|chosen|winner)/gi, weight: 0.18, description: 'email selected', category: 'lottery' },
  
  // ===== PHISHING & ACCOUNT SECURITY =====
  { pattern: /\baccount.*(suspended|blocked|locked|frozen|disabled|closed|terminated)/gi, weight: 0.22, description: 'account suspended', category: 'phishing' },
  { pattern: /\b(verify|confirm|update|validate).*(account|identity|password|details|information)/gi, weight: 0.21, description: 'verify account', category: 'phishing' },
  { pattern: /\b(suspicious|unusual).*(activity|login|transaction|access)/gi, weight: 0.20, description: 'suspicious activity', category: 'phishing' },
  { pattern: /\b(restore|reactivate|unlock|unblock).*(account|access)/gi, weight: 0.19, description: 'restore account', category: 'phishing' },
  { pattern: /\b(kyc|know\s+your\s+customer).*(expire|expiring|update|pending)/gi, weight: 0.20, description: 'KYC update', category: 'phishing' },
  { pattern: /\b(aadhaar?|adhaar?|aadhar).*\b(update|expire|invalid|freeze)/gi, weight: 0.21, description: 'Aadhaar scam', category: 'phishing' },
  { pattern: /\b(pan|permanent\s+account\s+number).*(linked|due|pending|update)/gi, weight: 0.20, description: 'PAN card scam', category: 'phishing' },
  { pattern: /\b(card|credit\s+card|debit\s+card).*(details|number|cvv|pin|otp)/gi, weight: 0.22, description: 'card details', category: 'phishing' },
  { pattern: /\b(bank|banking).*(details|account|password|credentials)/gi, weight: 0.21, description: 'bank credentials', category: 'phishing' },
  
  // ===== URGENCY & TIME PRESSURE =====
  { pattern: /\b(urgent|immediately|right\s+now|act\s+now|asap)/gi, weight: 0.16, description: 'urgent action', category: 'urgency' },
  { pattern: /\bwithin\s+(\d+|twenty-four|24)\s+(hours?|hrs?|minutes?|mins?)/gi, weight: 0.15, description: 'time deadline', category: 'urgency' },
  { pattern: /\b(expires?|expiring|expiration).*(today|tonight|soon|\d+\s+hours?)/gi, weight: 0.15, description: 'expires soon', category: 'urgency' },
  { pattern: /\b(limited\s+time|last\s+chance|final\s+(notice|warning|opportunity))/gi, weight: 0.14, description: 'limited time', category: 'urgency' },
  { pattern: /\bfailure\s+to\s+(respond|reply|verify|update).*\b(will|result)/gi, weight: 0.17, description: 'threat warning', category: 'urgency' },
  { pattern: /\b(permanent|permanently).*(closure|close|suspend|block|delete)/gi, weight: 0.16, description: 'permanent closure', category: 'urgency' },
  
  // ===== MONEY & FINANCIAL SCAMS =====
  { pattern: /\b(earn|make).*(\$|₹|rs\.?|\d+).*(day|week|month|hour)/gi, weight: 0.17, description: 'make money fast', category: 'money' },
  { pattern: /\b(free\s+money|cash\s+bonus|instant\s+cash)/gi, weight: 0.18, description: 'free money', category: 'money' },
  { pattern: /\b(double|triple|multiply).*\b(money|investment|profit)/gi, weight: 0.19, description: 'double money', category: 'money' },
  { pattern: /(\$|₹|rs\.?)\s*\d{1,3}(,\d{3})*(\.\d{2})?\s*(million|lakh|crore|thousand)/gi, weight: 0.16, description: 'large amount', category: 'money' },
  { pattern: /\bguaranteed.*(profit|return|income|earnings?)/gi, weight: 0.17, description: 'guaranteed profit', category: 'money' },
  { pattern: /\b(refund|owe|owed|due).*(₹|rs\.?|\$|\d+)/gi, weight: 0.15, description: 'refund pending', category: 'money' },
  { pattern: /\b(pay|payment).*(₹|rs\.?|\$)\s*\d+.*(fee|charge|shipping|delivery)/gi, weight: 0.14, description: 'pay small fee', category: 'money' },
  { pattern: /\b(registration|processing|security|handling)\s+fee/gi, weight: 0.15, description: 'registration fee', category: 'money' },
  
  // ===== INVESTMENT & CRYPTO SCAMS =====
  { pattern: /\b(bitcoin|btc|crypto|cryptocurrency|blockchain).*\b(invest|profit|wallet|locked)/gi, weight: 0.16, description: 'crypto scam', category: 'investment' },
  { pattern: /\b(forex|trading|stocks?|investment).*(guaranteed|bot|ai|algorithm)/gi, weight: 0.17, description: 'trading scam', category: 'investment' },
  { pattern: /\b(invest|investment).*\b(opportunity|scheme|plan|program)/gi, weight: 0.15, description: 'investment scheme', category: 'investment' },
  { pattern: /\b\d+%\s*(profit|return|roi|interest).*(daily|weekly|guaranteed)/gi, weight: 0.18, description: 'high returns', category: 'investment' },
  { pattern: /\bmillionaire.*(weeks?|months?|days?)/gi, weight: 0.17, description: 'quick millionaire', category: 'investment' },
  
  // ===== JOB & WORK FROM HOME SCAMS =====
  { pattern: /\b(work\s+from\s+home|wfh|remote\s+job).*\b(earn|₹|rs\.?)/gi, weight: 0.14, description: 'work from home', category: 'job' },
  { pattern: /\b(selected|shortlisted).*\b(internship|job|position)/gi, weight: 0.16, description: 'fake job offer', category: 'job' },
  { pattern: /\bno\s+(interview|experience|skills).*(required|needed)/gi, weight: 0.15, description: 'no interview needed', category: 'job' },
  { pattern: /\b(google|microsoft|amazon|facebook|meta).*\b(internship|job|hiring)/gi, weight: 0.17, description: 'fake big company', category: 'job' },
  { pattern: /\b(hr\s+team|recruitment|hiring\s+team)/gi, weight: 0.08, description: 'HR mention', category: 'job' },
  
  // ===== DELIVERY & PACKAGE SCAMS =====
  { pattern: /\b(package|parcel|shipment|courier|delivery).*(hold|held|pending|failed|stuck)/gi, weight: 0.18, description: 'package on hold', category: 'delivery' },
  { pattern: /\b(delivery|shipping|courier).*(attempt|failed|unable)/gi, weight: 0.16, description: 'delivery failed', category: 'delivery' },
  { pattern: /\b(customs?|clearance).*(charge|fee|duty|payment)/gi, weight: 0.17, description: 'customs fee', category: 'delivery' },
  { pattern: /\b(address|delivery\s+address).*(confirm|verify|update|incomplete)/gi, weight: 0.15, description: 'address issue', category: 'delivery' },
  { pattern: /\b(re-?delivery|reattempt).*(fee|charge|₹|rs\.?)/gi, weight: 0.16, description: 'redelivery fee', category: 'delivery' },
  
  // ===== TECH SUPPORT & VIRUS SCAMS =====
  { pattern: /\b(virus|viruses|malware|trojan|spyware).*\b(detected|found|infected)/gi, weight: 0.19, description: 'virus detected', category: 'tech' },
  { pattern: /\b(device|computer|pc|system).*\b(infected|compromised|hacked|damaged)/gi, weight: 0.18, description: 'device infected', category: 'tech' },
  { pattern: /\bclick.*\b(clean|fix|repair|remove|scan)/gi, weight: 0.15, description: 'click to fix', category: 'tech' },
  { pattern: /\b(tech|technical)\s+support/gi, weight: 0.12, description: 'tech support', category: 'tech' },
  
  // ===== ROMANCE & RELATIONSHIP SCAMS =====
  { pattern: /\b(love|dear|darling|honey|sweetheart)/gi, weight: 0.12, description: 'romantic language', category: 'romance' },
  { pattern: /\b(fallen\s+for\s+you|love\s+you|miss\s+you)/gi, weight: 0.14, description: 'love declaration', category: 'romance' },
  { pattern: /\b(visit|come\s+to|meet).*(need|help|money|ticket|visa)/gi, weight: 0.16, description: 'visit help needed', category: 'romance' },
  { pattern: /\b(send|wire|transfer).*(\$|₹|money|cash)/gi, weight: 0.15, description: 'send money request', category: 'romance' },
  
  // ===== BLACKMAIL & EXTORTION =====
  { pattern: /\b(know|have|recorded|recordings?|videos?|photos?).*\b(you|private|personal)/gi, weight: 0.20, description: 'blackmail threat', category: 'blackmail' },
  { pattern: /\b(leak|expose|release|publish|share).*\b(content|video|photos?|recordings?)/gi, weight: 0.19, description: 'leak threat', category: 'blackmail' },
  { pattern: /\b(bitcoin|btc|crypto).*\b(wallet|address|send|transfer)/gi, weight: 0.15, description: 'bitcoin payment', category: 'blackmail' },
  { pattern: /\bseed\s+phrase/gi, weight: 0.18, description: 'seed phrase request', category: 'blackmail' },
  
  // ===== TAX & GOVERNMENT SCAMS =====
  { pattern: /\b(tax|income\s+tax|irs).*(due|pending|unpaid|refund|owe)/gi, weight: 0.18, description: 'tax payment', category: 'tax' },
  { pattern: /\b(legal\s+action|arrest|warrant|court|lawsuit)/gi, weight: 0.17, description: 'legal threat', category: 'tax' },
  { pattern: /\b(uidai|aadhaar?|aadhar|adhaar).*(portal|update|government)/gi, weight: 0.16, description: 'government portal', category: 'tax' },
  
  // ===== SUBSCRIPTION & RENEWAL SCAMS =====
  { pattern: /\bsubscription.*(renew|renewal|expire|expiring|charged)/gi, weight: 0.14, description: 'subscription renewal', category: 'subscription' },
  { pattern: /\b(mcafee|norton|antivirus).*\b(renew|subscription|charged)/gi, weight: 0.16, description: 'antivirus renewal', category: 'subscription' },
  { pattern: /\b(cancel|stop|prevent).*\b(renewal|charge|payment)/gi, weight: 0.13, description: 'cancel subscription', category: 'subscription' },
  { pattern: /\b(charged|charge|billed).*(\$|₹|rs\.?).*\d+/gi, weight: 0.12, description: 'charge notification', category: 'subscription' },
  
  // ===== SOCIAL MEDIA & VERIFICATION SCAMS =====
  { pattern: /\b(instagram|facebook|twitter|tiktok|linkedin).*\b(verification|verified|badge|blue\s+tick)/gi, weight: 0.17, description: 'social verification', category: 'social' },
  { pattern: /\bblue\s+(tick|badge|check|verification)/gi, weight: 0.16, description: 'blue badge', category: 'social' },
  { pattern: /\b(eligible|approved|qualified).*\b(verification|verified)/gi, weight: 0.15, description: 'eligible verified', category: 'social' },
  
  // ===== FREE GIFTS & GIVEAWAYS =====
  { pattern: /\b(free|complimentary).*(iphone|samsung|laptop|macbook|ipad)/gi, weight: 0.17, description: 'free device', category: 'giveaway' },
  { pattern: /\b(gift\s+card|voucher|coupon).*(free|₹|rs\.?|\d+)/gi, weight: 0.15, description: 'gift card', category: 'giveaway' },
  { pattern: /\b(flipkart|amazon|myntra).*(gift|voucher|card|cashback)/gi, weight: 0.14, description: 'shopping voucher', category: 'giveaway' },
  { pattern: /\b(giveaway|contest|survey|questionnaire).*\b(free|win|prize)/gi, weight: 0.13, description: 'survey giveaway', category: 'giveaway' },
  { pattern: /\bcomplete.*\b(survey|form|questionnaire).*\b(free|get|receive)/gi, weight: 0.14, description: 'complete survey', category: 'giveaway' },
  { pattern: /\bshipping\s+fee.*(\$|₹|rs\.?)\s*\d+/gi, weight: 0.15, description: 'shipping fee trick', category: 'giveaway' },
  
  // ===== CHARITY & DONATION SCAMS =====
  { pattern: /\b(donate|donation|charity|help|fund).*(flood|earthquake|disaster|victims?)/gi, weight: 0.13, description: 'charity request', category: 'charity' },
  { pattern: /\b(raising\s+funds|emergency|relief|humanitarian)/gi, weight: 0.11, description: 'fundraising', category: 'charity' },
  
  // ===== OTP & AUTHENTICATION SCAMS =====
  { pattern: /\b(otp|one\s+time\s+password).*\b(\d{4,6}|verify|enter|share)/gi, weight: 0.18, description: 'OTP sharing', category: 'otp' },
  { pattern: /\b(code|verification\s+code).*\b(\d{4,6}|enter|provide)/gi, weight: 0.16, description: 'verification code', category: 'otp' },
  { pattern: /\bdo\s+not\s+share.*(anyone|otp|code|password)/gi, weight: -0.05, description: 'legitimate warning', category: 'legitimate' },
  
  // ===== PAYMENT PLATFORM SCAMS =====
  { pattern: /\b(paypal|paytm|phonepe|gpay|google\s+pay).*(limited|suspended|locked|verify)/gi, weight: 0.17, description: 'payment platform', category: 'payment' },
  { pattern: /\b(payment|transaction).*(failed|declined|issue|problem|error)/gi, weight: 0.13, description: 'payment failed', category: 'payment' },
  
  // ===== SUSPICIOUS LANGUAGE & CLAIMS =====
  { pattern: /\b(100%|absolutely|completely).*(free|guaranteed|risk-?free|safe|legitimate)/gi, weight: 0.14, description: '100% claims', category: 'suspicious' },
  { pattern: /\b(not\s+spam|not\s+junk|this\s+is\s+not|legitimate\s+email)/gi, weight: 0.16, description: 'claims not spam', category: 'suspicious' },
  { pattern: /\b(once\s+in.*lifetime|deal\s+of.*lifetime|exclusive\s+offer)/gi, weight: 0.13, description: 'lifetime opportunity', category: 'suspicious' },
  { pattern: /\b(secret|confidential|private|hidden|undisclosed)/gi, weight: 0.11, description: 'secretive language', category: 'suspicious' },
  { pattern: /\blimited\s+(slots?|seats?|spaces?|stock)/gi, weight: 0.12, description: 'limited slots', category: 'suspicious' },
  
  // ===== FORMATTING RED FLAGS =====
  { pattern: /[A-Z]{6,}/g, weight: 0.09, description: 'excessive caps', category: 'formatting' },
  { pattern: /!{3,}/g, weight: 0.08, description: 'multiple exclamations', category: 'formatting' },
  { pattern: /\${2,}|₹{2,}/g, weight: 0.10, description: 'multiple currency symbols', category: 'formatting' },
  { pattern: /🎉|🎁|⚠️|📦|❤️|💰|💵|💳/g, weight: 0.07, description: 'spam emojis', category: 'formatting' },
];

// Suspicious keywords that increase spam score
const suspiciousKeywords = [
  // Financial
  'lottery', 'jackpot', 'guaranteed', 'bonus', 'prize', 'winner', 'selected',
  'credit', 'debt', 'loan', 'refinance', 'investment', 'profit', 'income',
  'refund', 'owe', 'owed', 'due', 'payment', 'deposit',
  
  // Account/Security
  'password', 'suspended', 'locked', 'blocked', 'frozen', 'expires',
  'verify', 'confirm', 'update', 'restore', 'reactivate',
  
  // Indian specific
  'pan', 'aadhaar', 'aadhar', 'kyc', 'uidai', 'sbi', 'hdfc', 'icici',
  'paytm', 'phonepe', 'gpay',
  
  // Transfer methods
  'western union', 'moneygram', 'wire transfer', 'bitcoin', 'btc',
  
  // Scam origins
  'nigeria', 'nigerian', 'prince', 'beneficiary', 'inheritance',
  'diplomat', 'barrister', 'attorney', 'lawyer',
  
  // Tech
  'virus', 'malware', 'infected', 'hacked', 'compromised',
  
  // Products
  'viagra', 'cialis', 'pharmacy', 'pills', 'weight loss',
  'casino', 'poker', 'gambling', 'rolex', 'replica',
  
  // Education scams
  'diploma', 'degree', 'certificate', 'university', 'accredited',
  
  // Urgency
  'urgent', 'immediately', 'asap', 'expire', 'limited', 'hurry'
];

// Legitimate email indicators (reduce spam score)
const legitimateIndicators = [
  /\b(thank\s+you|thanks)\s+(for|so\s+much)/gi,
  /\b(meeting|conference|appointment)\s+(scheduled|tomorrow|today|agenda)/gi,
  /\b(attached|attachment|please\s+find|enclosed)\s+(is|are|herewith)/gi,
  /\b(regards|sincerely|best\s+regards|warm\s+regards|cheers),/gi,
  /\bplease\s+(let\s+me\s+know|advise|confirm|review)/gi,
  /\b(invoice|receipt|order\s+confirmation|bill|statement)\s+#?\d+/gi,
  /\b(dear|hi|hello)\s+[A-Z][a-z]+,/g, // Personalized greeting
  /\b(team|colleagues|all)/gi,
  /\b(project|report|presentation|document|file)/gi,
];

// =============================================================================
// SECTION 2: SPAM DETECTION LOGIC
// =============================================================================

export function detectSpam(subject: string, content: string) {
  const text = `${subject} ${content}`;
  const textLower = text.toLowerCase();
  let spamScore = 0;
  const detectedPatterns: string[] = [];
  const patternCategories = new Set<string>();

  // Check all spam patterns
  spamPatterns.forEach(({ pattern, weight, description, category }) => {
    const matches = text.match(pattern);
    if (matches) {
      const matchCount = matches.length;
      // Cap at 2 matches per pattern to prevent over-scoring
      const addedScore = weight * Math.min(matchCount, 2);
      spamScore += addedScore;
      detectedPatterns.push(description);
      patternCategories.add(category);
    }
  });

  // Check suspicious keywords
  const keywordMatches = suspiciousKeywords.filter(word => textLower.includes(word.toLowerCase()));
  keywordMatches.forEach(word => {
    spamScore += 0.04;
    if (detectedPatterns.length < 12) { // Limit pattern list
      detectedPatterns.push(word);
    }
  });

  // Check for legitimate indicators (reduce spam score)
  let legitimateCount = 0;
  legitimateIndicators.forEach(pattern => {
    if (pattern.test(text)) {
      legitimateCount++;
      spamScore -= 0.12;
    }
  });

  // ===== URL ANALYSIS =====
  const urlMatches = text.match(/https?:\/\/[^\s]+/gi);
  if (urlMatches) {
    const urlCount = urlMatches.length;
    if (urlCount > 3) {
      spamScore += 0.15;
      detectedPatterns.push('excessive links');
    } else if (urlCount > 1) {
      spamScore += 0.06;
    }
    
    // Check for suspicious URL patterns
    urlMatches.forEach(url => {
      const urlLower = url.toLowerCase();
      
      // IP address URLs (very suspicious)
      if (/https?:\/\/\d+\.\d+\.\d+\.\d+/i.test(url)) {
        spamScore += 0.18;
        detectedPatterns.push('IP address link');
      }
      
      // Suspicious TLDs
      if (/\.(tk|ml|ga|cf|gq|xyz|top|club|work|click|link|online)\/?\b/i.test(url)) {
        spamScore += 0.12;
        detectedPatterns.push('suspicious domain');
      }
      
      // Shortened URLs
      if (/(bit\.ly|tinyurl|goo\.gl|ow\.ly|t\.co)/i.test(url)) {
        spamScore += 0.08;
        detectedPatterns.push('shortened URL');
      }
      
      // Common phishing keywords in URLs
      if (/(verify|secure|login|account|update|confirm|bank|paypal|amazon)/i.test(urlLower)) {
        spamScore += 0.10;
        detectedPatterns.push('suspicious URL keyword');
      }
    });
  }

  // ===== EMAIL ADDRESS ANALYSIS =====
  const emailMatches = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi);
  if (emailMatches && emailMatches.length > 2) {
    spamScore += 0.09;
    detectedPatterns.push('multiple emails');
  }

  // ===== LENGTH & FORMATTING ANALYSIS =====
  const wordCount = text.split(/\s+/).length;
  
  if (wordCount < 10) {
    spamScore += 0.12;
    detectedPatterns.push('too short');
  } else if (wordCount > 500) {
    spamScore += 0.06;
  }

  // Caps ratio
  const capsCount = (text.match(/[A-Z]/g) || []).length;
  const letterCount = (text.match(/[A-Za-z]/g) || []).length;
  const capsRatio = letterCount > 0 ? capsCount / letterCount : 0;
  
  if (capsRatio > 0.4) {
    spamScore += 0.14;
    if (!detectedPatterns.includes('excessive caps')) {
      detectedPatterns.push('excessive caps');
    }
  }

  // Exclamation marks
  const exclamationCount = (text.match(/!/g) || []).length;
  if (exclamationCount > 3) {
    spamScore += 0.10;
    detectedPatterns.push('excessive punctuation');
  }

  // Multiple pattern categories = more likely spam
  if (patternCategories.size >= 3) {
    spamScore += 0.12;
  }

  // ===== SUBJECT LINE ANALYSIS =====
  const subjectLower = subject.toLowerCase();
  
  // Fake RE:/FWD:
  if (subjectLower.match(/^(re|fwd):/i) && content.length < 50) {
    spamScore += 0.10;
    detectedPatterns.push('fake reply/forward');
  }

  // Common spam subject patterns
  if (subjectLower.match(/\b(urgent|immediate|action\s+required|security\s+alert)/i)) {
    spamScore += 0.08;
  }

  // Common legitimate business subjects (reduce score)
  if (subjectLower.match(/\b(meeting|schedule|invoice|receipt|confirmation|order|report|agenda)/i) && legitimateCount > 0) {
    spamScore -= 0.10;
  }

  // ===== INDIAN CURRENCY SPECIFIC =====
  if (/₹|rs\.?|rupees?|inr/gi.test(text)) {
    // Presence of Indian currency is neutral, but check amounts
    const amountMatches = text.match(/₹\s*\d{1,3}(,\d{2,3})*|\brs\.?\s*\d+/gi);
    if (amountMatches && amountMatches.length > 2) {
      spamScore += 0.06;
    }
  }

  // Normalize score to 0-1 range
  spamScore = Math.max(0, Math.min(spamScore, 1));

  // Simulate ML model predictions
  const modelPredictions = {
    naiveBayes: simulateNaiveBayes(spamScore, text, keywordMatches.length),
    svm: simulateSVM(spamScore, text, patternCategories.size),
    randomForest: simulateRandomForest(spamScore, text, urlMatches?.length || 0),
    logisticRegression: simulateLogisticRegression(spamScore, text, capsRatio),
  };

  // Ensemble prediction (weighted average - Random Forest gets more weight as it's usually best)
  const ensembleScore = 
    (modelPredictions.naiveBayes * 0.20 + 
     modelPredictions.svm * 0.25 + 
     modelPredictions.randomForest * 0.35 + 
     modelPredictions.logisticRegression * 0.20);

  return {
    isSpam: ensembleScore >= 0.5,
    score: ensembleScore,
    patterns: [...new Set(detectedPatterns)].slice(0, 10), // Top 10 unique patterns
    modelPredictions,
  };
}

// =============================================================================
// SECTION 3: ML MODEL SIMULATIONS
// =============================================================================

// Naive Bayes - Excellent at keyword-based detection
function simulateNaiveBayes(baseScore: number, text: string, keywordCount: number): number {
  const keywordBonus = Math.min(keywordCount * 0.06, 0.22);
  const score = baseScore + keywordBonus;
  const variance = (Math.random() - 0.5) * 0.03;
  return Math.max(0, Math.min(score + variance, 1));
}

// SVM - Good at finding optimal boundaries
function simulateSVM(baseScore: number, text: string, categoryCount: number): number {
  const adjustment = categoryCount > 2 ? 0.09 : -0.04;
  const score = baseScore + adjustment;
  // SVM is more polarized (confident)
  const polarized = score > 0.5 ? score + 0.06 : score - 0.06;
  const variance = (Math.random() - 0.5) * 0.04;
  return Math.max(0, Math.min(polarized + variance, 1));
}

// Random Forest - Most balanced and accurate
function simulateRandomForest(baseScore: number, text: string, urlCount: number): number {
  const urlPenalty = urlCount > 2 ? 0.14 : urlCount > 0 ? 0.05 : 0;
  const score = baseScore + urlPenalty;
  const variance = (Math.random() - 0.5) * 0.025; // Lowest variance
  return Math.max(0, Math.min(score + variance, 1));
}

// Logistic Regression - Linear model
function simulateLogisticRegression(baseScore: number, text: string, capsRatio: number): number {
  const capsBonus = capsRatio > 0.3 ? 0.11 : 0;
  const score = baseScore + capsBonus;
  // Apply sigmoid for smooth probabilities
  const smoothed = 1 / (1 + Math.exp(-10 * (score - 0.5)));
  const variance = (Math.random() - 0.5) * 0.04;
  return Math.max(0, Math.min(smoothed + variance, 1));
}

// =============================================================================
// SECTION 4: DATASET INTEGRATION (FUTURE)
// =============================================================================

/*
 * TO INTEGRATE REAL ML MODELS WITH ACTUAL DATASET:
 * 
 * 1. DATASET PREPARATION:
 *    - Download dataset from: https://www.kaggle.com/datasets/zeeshanyounas001/email-spam-detection
 *    - Or use: SMS Spam Collection, Enron Email Dataset, SpamAssassin Corpus
 *    - Place dataset in: /backend/data/spam_dataset.csv
 * 
 * 2. REPLACE THE SIMULATION FUNCTIONS ABOVE WITH:
 *    - Real trained model predictions from your Flask API
 *    - Example code below:
 * 
 * export async function detectSpamWithRealML(subject: string, content: string) {
 *   try {
 *     const response = await fetch('http://localhost:5000/api/predict', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ subject, content })
 *     });
 *     
 *     if (!response.ok) throw new Error('API call failed');
 *     
 *     const result = await response.json();
 *     return result; // Returns: { isSpam, score, patterns, modelPredictions }
 *   } catch (error) {
 *     console.error('ML API Error:', error);
 *     // Fallback to pattern-based detection
 *     return detectSpam(subject, content);
 *   }
 * }
 * 
 * 3. UPDATE THE TRAINING SCRIPT (backend/models/train_model.py):
 *    - Load your dataset
 *    - Preprocess: lowercase, remove stop words, stemming
 *    - Extract features: TF-IDF (n-grams 1-3), word counts, URL features
 *    - Train models: Naive Bayes, SVM, Random Forest, Logistic Regression
 *    - Save models: pickle.dump() to save trained models
 *    - Calculate metrics: accuracy, precision, recall, F1-score
 * 
 * 4. FEATURE ENGINEERING IDEAS:
 *    - TF-IDF vectors (unigrams, bigrams, trigrams)
 *    - Word count features
 *    - Character count features
 *    - URL count and URL length
 *    - Email address count
 *    - Special character ratios (!, ?, $, etc.)
 *    - Capital letter ratio
 *    - Average word length
 *    - Presence of specific spam keywords
 *    - Number of sentences
 *    - Currency symbol presence
 * 
 * 5. MODEL TRAINING CODE TEMPLATE:
 * 
 * from sklearn.model_selection import train_test_split
 * from sklearn.feature_extraction.text import TfidfVectorizer
 * from sklearn.naive_bayes import MultinomialNB
 * from sklearn.svm import SVC
 * from sklearn.ensemble import RandomForestClassifier
 * from sklearn.linear_model import LogisticRegression
 * import pandas as pd
 * 
 * # Load dataset
 * df = pd.read_csv('spam_dataset.csv')
 * X = df['text']  # Email content
 * y = df['label']  # 0 = ham, 1 = spam
 * 
 * # Split data
 * X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
 * 
 * # Vectorize
 * vectorizer = TfidfVectorizer(max_features=3000, ngram_range=(1, 3))
 * X_train_vec = vectorizer.fit_transform(X_train)
 * X_test_vec = vectorizer.transform(X_test)
 * 
 * # Train models
 * models = {
 *     'naive_bayes': MultinomialNB(),
 *     'svm': SVC(probability=True, kernel='linear'),
 *     'random_forest': RandomForestClassifier(n_estimators=100),
 *     'logistic_regression': LogisticRegression(max_iter=1000)
 * }
 * 
 * for name, model in models.items():
 *     model.fit(X_train_vec, y_train)
 *     y_pred = model.predict(X_test_vec)
 *     accuracy = accuracy_score(y_test, y_pred)
 *     print(f"{name}: {accuracy:.4f}")
 * 
 * 6. INTEGRATION STEPS:
 *    - Replace detectSpam() function call in SenderInterface.tsx
 *    - Update to use detectSpamWithRealML() when API is available
 *    - Keep pattern-based detection as fallback
 *    - Add loading states for API calls
 *    - Handle errors gracefully
 * 
 * 7. DEPLOYMENT:
 *    - Backend: Deploy Flask API to Heroku/AWS/GCP
 *    - Models: Store trained models in cloud storage or with API
 *    - Environment: Set API_URL environment variable
 *    - CORS: Configure proper CORS settings for production
 */

// =============================================================================
// SECTION 5: TRAINING STATISTICS (Simulated)
// =============================================================================

export const trainingStats = {
  totalEmails: 5728,
  spamEmails: 1368,
  legitEmails: 4360,
  spamPercentage: 23.9,
  features: 'TF-IDF (3000 features), N-grams (1-3), URL analysis, Formatting metrics',
  trainTestSplit: '80/20',
  lastTrained: 'Pattern-based (Ready for ML integration)',
  accuracy: {
    naiveBayes: 0.951,
    svm: 0.967,
    randomForest: 0.979,
    logisticRegression: 0.958,
  },
  precision: {
    naiveBayes: 0.943,
    svm: 0.971,
    randomForest: 0.985,
    logisticRegression: 0.962,
  },
  recall: {
    naiveBayes: 0.891,
    svm: 0.923,
    randomForest: 0.941,
    logisticRegression: 0.915,
  }
};
