// Dependencies: url (Node.js built-in)
// Purpose: Analyze QR code URLs using local heuristics, no API calls

const { URL } = require('url');

const SAFE_DOMAINS = ['google.com', 'microsoft.com', 'github.com', 'apple.com'];
const SUSPICIOUS_TLDS = ['.tk', '.ml', '.cf', '.ga', '.gq'];
const PHISHING_KEYWORDS = ['verify', 'account', 'login', 'secure', 'confirm'];

function analyzeUrl(urlString) {
  let score = 0;
  const reasons = [];
  
  try {
    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();
    const fullUrl = urlString.toLowerCase();
    
    // Check for IP address instead of domain
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipRegex.test(hostname)) {
      score += 30;
      reasons.push('URL uses IP address instead of domain name');
    }
    
    // Check for punycode
    if (hostname.includes('xn--')) {
      score += 20;
      reasons.push('URL contains punycode encoding (potential homograph attack)');
    }
    
    // Check for suspicious TLDs
    const hasSuspiciousTld = SUSPICIOUS_TLDS.some(tld => hostname.endsWith(tld));
    if (hasSuspiciousTld) {
      score += 20;
      reasons.push(`Suspicious TLD detected: ${hostname.split('.').pop()}`);
    }
    
    // Check URL length
    if (urlString.length > 120) {
      score += 15;
      reasons.push('Unusually long URL');
    }
    
    // Check for phishing keywords
    const hasKeyword = PHISHING_KEYWORDS.some(keyword => fullUrl.includes(keyword));
    if (hasKeyword) {
      score += 15;
      reasons.push(`Contains suspicious keyword: ${PHISHING_KEYWORDS.find(k => fullUrl.includes(k))}`);
    }
    
    // Check against safe list
    const isSafe = SAFE_DOMAINS.some(domain => hostname === domain || hostname.endsWith('.' + domain));
    if (isSafe) {
      score -= 25;
      reasons.push('Domain is in trusted safe list');
    }
    
    // Cap score between 0-100
    score = Math.max(0, Math.min(100, score));
    
    // Determine category
    let category;
    if (score <= 30) {
      category = 'low';
    } else if (score <= 69) {
      category = 'medium';
    } else {
      category = 'high';
    }
    
    return {
      score,
      category,
      reasons: reasons.length > 0 ? reasons : ['No suspicious indicators detected']
    };
  } catch (err) {
    // Invalid URL
    return {
      score: 100,
      category: 'high',
      reasons: ['Invalid or malformed URL']
    };
  }
}

module.exports = { analyzeUrl };

