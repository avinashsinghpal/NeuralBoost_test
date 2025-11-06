function notFoundHandler(_req, res, _next) {
  res.status(404).json({ success: false, error: 'Not Found' });
}

function errorHandler(err, _req, res, _next) {
  console.error('[Error Handler]', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, error: message });
}

module.exports = { errorHandler, notFoundHandler };
