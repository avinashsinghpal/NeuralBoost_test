function adjust(channel, modules) {
  const ch = (channel || '').toLowerCase();
  let boost = 0;
  const evidence = { channel: ch, applied: [] };
  if (ch === 'sms') { boost += 10; evidence.applied.push('sms_shortlink_risk'); }
  if (ch === 'slack' || ch === 'teams') { boost += 5; evidence.applied.push('internal_impersonation_risk'); }
  if (modules.url && modules.url.flags.includes('shortener')) { boost += 5; evidence.applied.push('shortener_in_channel'); }
  return { score: Math.min(100, boost), flags: [], evidence };
}

module.exports = { adjust };


