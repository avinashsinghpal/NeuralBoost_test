function detect(urls) {
  const flags = [];
  const evidence = { punycode: [], homographCandidates: [] };
  let score = 0;
  (urls || []).forEach(u => {
    try {
      const host = new URL(u).hostname;
      if (host.startsWith('xn--')) { flags.push('punycode'); score += 25; evidence.punycode.push(host); }
      if (/\u0430|\u043E|\u0455|\u03BF/.test(host)) { flags.push('homograph'); score += 15; evidence.homographCandidates.push(host); }
    } catch {}
  });
  return { score: Math.min(100, score), flags: Array.from(new Set(flags)), evidence };
}

module.exports = { detect };
