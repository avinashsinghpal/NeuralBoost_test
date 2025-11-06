const list = require('./blacklist.json');

function domainFromUrl(u) {
  try { return new URL(u).hostname.toLowerCase(); } catch { return ''; }
}

function isBlacklisted(url) {
  const d = domainFromUrl(url);
  return list.some(b => d === b || d.endsWith(`.${b}`));
}

function isBlacklistedDomain(domain) {
  const d = (domain || '').toLowerCase();
  return list.some(b => d === b || d.endsWith(`.${b}`));
}

module.exports = { isBlacklisted, isBlacklistedDomain };


