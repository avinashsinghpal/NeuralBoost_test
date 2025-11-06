function extractDomain(u) {
  try { return new URL(u).hostname.toLowerCase(); } catch { return ''; }
}

function lookup(urls) {
  const flags = [];
  const evidence = { suspiciousDomains: [] };
  let score = 0;
  (urls || []).forEach(u => {
    const d = extractDomain(u);
    if (!d) return;
    if (d.startsWith('xn--')) { flags.push('punycode_domain'); score += 20; evidence.suspiciousDomains.push(d); }
    const parts = d.split('.');
    if (parts.length > 4) { flags.push('deep_subdomain'); score += 10; }
  });
  return { score: Math.min(100, score), flags: Array.from(new Set(flags)), evidence };
}

module.exports = { lookup };
