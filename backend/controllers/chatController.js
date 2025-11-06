function normalize(text = '') {
  return String(text).toLowerCase();
}

const faq = [
  {
    q: ['how to spot fake emails', 'spot fake email', 'identify phishing', 'how to detect phishing', 'phishing tips'],
    a: `Look for these red flags:
• Urgent tone, threats, or too-good-to-be-true offers
• Mismatched sender domain (e.g., look‑alikes)
• Unexpected attachments or links
• Generic greeting, poor grammar, odd formatting
• Requests for passwords/OTPs/payment via links

Hover links to inspect true URLs first. Prefer manual navigation to sites.`
  },
  {
    q: ['what to do if i clicked', 'i clicked a phishing link', 'i entered my password'],
    a: `Act quickly:
1) Disconnect from suspicious sites and close the browser
2) Change your passwords (enable 2FA)
3) Notify IT/security immediately
4) Monitor accounts for unusual activity
5) If financial data involved, contact your bank and file a report`
  },
  {
    q: ['check sender', 'verify sender', 'email address spoof'],
    a: `Check the full sender address (not just display name). Watch for typosquatting (e.g., rn → m, l → I). Compare domains to the official site. When unsure, contact the sender via a known-good channel.`
  },
  {
    q: ['safe links', 'is this link safe', 'url check'],
    a: `Hover to preview the real URL. Avoid shortened or obfuscated links. Open sites manually via bookmarks or the browser address bar instead of clicking email links.`
  },
  {
    q: ['phishing vs spam', 'difference phishing spam', 'spam or phishing'],
    a: `Spam is unsolicited but generally harmless marketing. Phishing is malicious social engineering designed to steal credentials, money, or data. Phishing uses urgency, impersonation, and deceptive links/attachments.`
  },
  {
    q: ['report phishing', 'how to report', 'sos', 'complaint'],
    a: `To report:
• Use the SOS button here to trigger defensive actions
• File a complaint at the National Cybercrime Reporting Portal (cybercrime.gov.in)
• Call the India Cybercrime Helpline: 1930
Prepare details: sender, domain, links, timestamps, screenshots.`
  }
];

function matchFaq(prompt) {
  const p = normalize(prompt);
  for (const item of faq) {
    if (item.q.some(k => p.includes(normalize(k)))) return item.a;
  }
  return null;
}

function askChatbot(req, res) {
  const { prompt = '' } = req.body || {};
  const ts = Date.now();
  if (!prompt.trim()) {
    return res.json({ ok: true, ts, reply: 'I am RakshaAI. Ask me how to spot fake emails, verify links, or what to do if you clicked.' });
  }
  const faqAnswer = matchFaq(prompt);
  const reply = faqAnswer || `Here’s a safe workflow to evaluate emails:
• Pause and inspect: sender, subject, tone
• Verify links: hover, check domain, prefer manual navigation
• Attachments: do not open unexpected files
• Requests: never share passwords/OTPs; confirm via trusted channels
• Unsure? Report via SOS or your security team`;
  res.json({ ok: true, ts, reply });
}

module.exports = { askChatbot };


