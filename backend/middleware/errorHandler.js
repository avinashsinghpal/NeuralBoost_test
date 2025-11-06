function notFoundHandler(_req, res, _next) {
  res.status(404).json({ success: false, error: 'Not Found' });
}

function errorHandler(err, req, res, _next) {
  console.error('[Error Handler]', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  // If this is a tracking endpoint request, always return HTML
  if (req.path && req.path.startsWith('/t/')) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).end(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Security Alert</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0b1220 0%, #1e293b 100%);
      color: #e5e7eb;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      max-width: 600px;
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 32px;
      text-align: center;
    }
    h1 { color: #ef4444; margin-bottom: 16px; }
    p { margin: 12px 0; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>⚠️ Security Alert</h1>
    <p><strong>You have been phished!</strong></p>
    <p>This was a simulated phishing attack for educational purposes.</p>
    <p style="margin-top: 24px; font-size: 14px; opacity: 0.8;">Your click has been recorded for security awareness training.</p>
  </div>
</body>
</html>`);
  }
  
  res.status(status).json({ success: false, error: message });
}

module.exports = { errorHandler, notFoundHandler };
