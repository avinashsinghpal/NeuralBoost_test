function scenarioOutcome(kind) {
  // Predefined outcomes for demo realism
  switch ((kind || '').toLowerCase()) {
    case 'classic':
      // Classic Phishing: Metadata + URL + Content manipulation
      return {
        riskCategory: 'high',
        threatScore: 89,
        breakdown: {
          sender: { score: 85, flags: ['blacklisted_sender_domain'], evidence: { domain: 'payroll.example.com' } },
          url: { score: 90, flags: ['blacklisted_domain', 'keyword_flag'], evidence: { hits: ['http://paypa1.com/verify-account'] } },
          punycode: { score: 0, flags: [], evidence: {} },
          nlp: { score: 75, flags: ['urgency', 'authority', 'verification_request'], evidence: { hits: ['urgent', 'verify', 'final notice', 'account will be locked'] } },
          attachment: { score: 0, flags: [], evidence: {} }
        },
        xaiExplanation: `This email exhibits classic phishing attack patterns combining multiple traditional techniques:

- Sender Domain Manipulation: The email originates from payroll.example.com which appears legitimate but is flagged as a blacklisted sender domain. This is a common tactic where attackers use spoofed or compromised domains that mimic legitimate organizations.

- Malicious URL: The verification link points to paypa1.com which is blacklisted and contains suspicious keywords. Classic phishing attacks rely on directing victims to fraudulent websites that steal credentials or install malware.

- Content Manipulation (NLP): The email uses high-pressure language including URGENT, final notice, and threats of account locking. These are classic social engineering tactics designed to create urgency and bypass rational thinking. The content triggers multiple NLP red flags including urgency, authority claims, and verification requests.

Recommendation: This is a high-risk classic phishing attempt. Do not click any links. Verify account status directly through official channels.`
      };
    case 'modern':
      // Modern Phishing: Homograph + Punycode + Attachment
      return {
        riskCategory: 'high',
        threatScore: 87,
        breakdown: {
          sender: { score: 10, flags: [], evidence: {} },
          url: { score: 40, flags: [], evidence: {} },
          punycode: { score: 85, flags: ['homograph', 'punycode'], evidence: { homographCandidates: ['appⅼe.com'], punycode: ['xn--pple-43d.com'] } },
          nlp: { score: 15, flags: ['verification_request'], evidence: { hits: ['verify'] } },
          attachment: { score: 90, flags: ['risky_extension'], evidence: { risky: ['verification.docm'] } }
        },
        xaiExplanation: `This email demonstrates modern sophisticated phishing techniques that exploit visual deception and file-based attacks:

- Homograph Attack: The URL appⅼe.com uses a homoglyph character (looks like l but is actually a different Unicode character) to impersonate apple.com. This visual deception is designed to trick users who glance at URLs without careful inspection.

- Punycode Encoding: The domain xn--pple-43d.com is a punycode-encoded domain that appears legitimate when decoded but points to a malicious server. Modern browsers may display this in a confusing way, making it harder to detect.

- Malicious Attachment: The file verification.docm uses a macro-enabled document format (.docm) which can execute malicious code when opened. Modern phishing campaigns often use attachments to deliver malware or ransomware.

- Combined Attack Vector: This email combines multiple modern techniques, making it particularly dangerous as it targets both URL-based and file-based attack vectors simultaneously.

Recommendation: This is a high-risk modern phishing attempt. Do not click links or open attachments. Verify any requests through official Apple support channels directly.`
      };
    case 'clean':
      return {
        riskCategory: 'low',
        threatScore: 8,
        breakdown: {
          sender: { score: 0, flags: [], evidence: {} },
          url: { score: 0, flags: [], evidence: {} },
          punycode: { score: 0, flags: [], evidence: {} },
          nlp: { score: 0, flags: [], evidence: {} },
          attachment: { score: 0, flags: [], evidence: {} }
        },
        xaiExplanation: `This email appears to be legitimate and safe:

- Sender Verification: The sender domain is verified and not flagged in any blacklists.

- URL Analysis: All URLs point to legitimate, verified domains with proper SSL certificates.

- Content Analysis: The email content is neutral, contains no urgency indicators, verification requests, or suspicious language patterns.

- No Threats Detected: No homograph attacks, punycode encoding, or malicious attachments were found.

Recommendation: This email appears safe. However, always exercise caution with unexpected emails and verify sender identity when in doubt.`
      };
    // Legacy support for old scenario keys
    case 'metadata':
      return {
        riskCategory: 'high',
        threatScore: 88,
        breakdown: {
          sender: { score: 85, flags: ['blacklisted_sender_domain'], evidence: { domain: 'payroll.example.com' } },
          url: { score: 15, flags: [], evidence: {} },
          punycode: { score: 0, flags: [], evidence: {} },
          nlp: { score: 25, flags: ['authority'], evidence: { hits: ['ceo'] } },
          attachment: { score: 0, flags: [], evidence: {} }
        }
      };
    case 'url':
      return {
        riskCategory: 'high',
        threatScore: 91,
        breakdown: {
          sender: { score: 10, flags: ['freemail_sender'], evidence: {} },
          url: { score: 90, flags: ['blacklisted_domain','keyword_flag'], evidence: { hits: ['http://bad-actor.com/reset'] } },
          punycode: { score: 0, flags: [], evidence: {} },
          nlp: { score: 20, flags: ['urgency'], evidence: { hits: ['urgent'] } },
          attachment: { score: 0, flags: [], evidence: {} }
        }
      };
    case 'homograph':
      return {
        riskCategory: 'high',
        threatScore: 82,
        breakdown: {
          sender: { score: 10, flags: [], evidence: {} },
          url: { score: 40, flags: [], evidence: {} },
          punycode: { score: 75, flags: ['homograph'], evidence: { homographCandidates: ['appⅼe.com'] } },
          nlp: { score: 10, flags: [], evidence: {} },
          attachment: { score: 0, flags: [], evidence: {} }
        }
      };
    case 'punycode':
      return {
        riskCategory: 'high',
        threatScore: 86,
        breakdown: {
          sender: { score: 10, flags: [], evidence: {} },
          url: { score: 30, flags: [], evidence: {} },
          punycode: { score: 85, flags: ['punycode'], evidence: { punycode: ['xn--pple-43d.com'] } },
          nlp: { score: 15, flags: [], evidence: {} },
          attachment: { score: 0, flags: [], evidence: {} }
        }
      };
    case 'nlp':
      return {
        riskCategory: 'medium',
        threatScore: 65,
        breakdown: {
          sender: { score: 10, flags: [], evidence: {} },
          url: { score: 0, flags: [], evidence: {} },
          punycode: { score: 0, flags: [], evidence: {} },
          nlp: { score: 70, flags: ['urgency','financial','verification_request'], evidence: { hits: ['urgent','gift card','verify your account'] } },
          attachment: { score: 0, flags: [], evidence: {} }
        }
      };
    case 'attachment':
      return {
        riskCategory: 'high',
        threatScore: 78,
        breakdown: {
          sender: { score: 10, flags: [], evidence: {} },
          url: { score: 0, flags: [], evidence: {} },
          punycode: { score: 0, flags: [], evidence: {} },
          nlp: { score: 20, flags: ['financial'], evidence: { hits: ['invoice'] } },
          attachment: { score: 90, flags: ['risky_extension'], evidence: { risky: ['invoice.docm'] } }
        }
      };
    default:
      return null;
  }
}

module.exports = { scenarioOutcome };


