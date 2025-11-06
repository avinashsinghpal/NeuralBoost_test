function detect(headers) {
  const h = headers || {};
  const from = (h['from'] || h['From'] || '').toString();
  const received = (h['Received'] || '').toString();
  const flags = [];
  const evidence = { fromContainsAt: from.includes('@'), receivedLen: received.length };

  if (from.includes('via') || from.includes('on behalf of')) flags.push('display_name_impersonation');
  if ((h['Return-Path'] || '').toString() && !from) flags.push('return_path_mismatch');

  let score = 0;
  if (flags.includes('display_name_impersonation')) score += 20;
  if (flags.includes('return_path_mismatch')) score += 15;

  return { score, flags, evidence };
}

module.exports = { detect };
