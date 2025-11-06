const { isBlacklisted } = require('../../services/blacklist/blacklistService');

const riskyTlds = ['.zip','.mov','.click','.country'];
const riskyKeywords = ['login','verify','update','secure','bank','wallet'];

function check(urls) {
  const flags = [];
  const evidence = { urlsCount: (urls || []).length, hits: [] };
  let score = 0;
  (urls || []).forEach(u => {
    const url = (u || '').toString();
    if (!url) return;
    if (isBlacklisted(url)) { flags.push('blacklisted_domain'); score += 60; evidence.hits.push(url); }
    if (riskyTlds.some(t => url.toLowerCase().includes(t))) { flags.push('risky_tld'); score += 15; }
    if (riskyKeywords.some(k => url.toLowerCase().includes(k))) { flags.push('keyword_flag'); score += 15; }
    if (/(?:^|\.)bit\.ly\//i.test(url) || /t\.co\//i.test(url)) { flags.push('shortener'); score += 15; }
  });
  score = Math.min(100, score);
  return { score, flags: Array.from(new Set(flags)), evidence };
}

module.exports = { check };
