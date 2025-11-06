const freemail = ['gmail.com','yahoo.com','outlook.com','hotmail.com'];
const { isBlacklistedDomain } = require('../../services/blacklist/blacklistService');

function analyze(headers) {
  const h = headers || {};
  const from = (h['from'] || h['From'] || '').toString();
  const domainMatch = from.match(/@([^>\s]+)/);
  const domain = domainMatch ? domainMatch[1].toLowerCase() : '';
  const flags = [];
  const evidence = { from, domain };

  if (!from) flags.push('missing_from');
  if (freemail.includes(domain)) flags.push('freemail_sender');
  if (isBlacklistedDomain(domain)) flags.push('blacklisted_sender_domain');

  let score = 0;
  if (flags.includes('blacklisted_sender_domain')) score += 70;
  if (flags.includes('freemail_sender')) score += 10;
  if (flags.includes('missing_from')) score += 40;

  score = Math.min(100, score);
  return { score, flags, evidence };
}

module.exports = { analyze };
