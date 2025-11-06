const urgency = ['urgent','immediately','now','asap','final notice'];
const authority = ['ceo','it support','security team','admin'];
const financial = ['invoice','payment','bank','wire','gift card'];

function tokenize(text) {
  return (text || '').toLowerCase().split(/[^a-z0-9]+/g).filter(Boolean);
}

function analyze(bodyText) {
  const tokens = tokenize(bodyText);
  const flags = [];
  const evidence = { hits: [] };
  let score = 0;
  urgency.forEach(t => { if (tokens.includes(t.replace(/\s+/g,''))) { flags.push('urgency'); score += 25; evidence.hits.push(t); } });
  authority.forEach(t => { if (tokens.includes(t.replace(/\s+/g,''))) { flags.push('authority'); score += 15; evidence.hits.push(t); } });
  financial.forEach(t => { if (tokens.includes(t.replace(/\s+/g,''))) { flags.push('financial'); score += 25; evidence.hits.push(t); } });
  if (/verify your (account|identity)/i.test(bodyText)) { flags.push('verification_request'); score += 25; evidence.hits.push('verify your account'); }
  return { score: Math.min(100, score), flags: Array.from(new Set(flags)), evidence };
}

module.exports = { analyze };
