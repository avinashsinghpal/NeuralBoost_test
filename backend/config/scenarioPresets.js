function scenarioOutcome(kind) {
  // Predefined outcomes for demo realism
  switch ((kind || '').toLowerCase()) {
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
        }
      };
    default:
      return null;
  }
}

module.exports = { scenarioOutcome };


