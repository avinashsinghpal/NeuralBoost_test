function validateAnalyzeInput(input) {
  const errors = [];
  if (!input || typeof input !== 'object') errors.push('Invalid body');
  if (!input.headers || typeof input.headers !== 'object') errors.push('headers required');
  if (typeof input.bodyText !== 'string') errors.push('bodyText must be string');
  if (!Array.isArray(input.urls)) errors.push('urls must be array');
  if (!Array.isArray(input.attachmentsMeta)) errors.push('attachmentsMeta must be array');
  // channel now optional; default to email if missing or invalid
  return { valid: errors.length === 0, errors };
}

module.exports = { validateAnalyzeInput };


