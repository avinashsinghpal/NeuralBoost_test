const riskyExtensions = ['.exe','.js','.vbs','.cmd','.bat','.scr','.ps1','.docm','.xlsm','.pptm','.iso','.img','.apk'];

function scan(attachments) {
  const flags = [];
  const evidence = { risky: [] };
  let score = 0;
  (attachments || []).forEach(a => {
    const name = (a.filename || '').toLowerCase();
    const size = Number(a.size || 0);
    if (riskyExtensions.some(ext => name.endsWith(ext))) { flags.push('risky_extension'); score += 50; evidence.risky.push(name); }
    if (size > 10 * 1024 * 1024) { flags.push('large_attachment'); score += 10; }
  });
  return { score: Math.min(100, score), flags: Array.from(new Set(flags)), evidence };
}

module.exports = { scan };
