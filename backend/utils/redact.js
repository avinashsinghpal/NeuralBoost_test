function redactUrls(urls) {
  return (urls || []).map(u => (typeof u === 'string' ? u.replace(/([\w-]{2})[\w-]+(\.[\w.-]+)/, '$1***$2') : ''));
}

function redactHeaders(headers) {
  const h = { ...(headers || {}) };
  if (h['Authorization']) h['Authorization'] = 'REDACTED';
  return h;
}

module.exports = { redactUrls, redactHeaders };


