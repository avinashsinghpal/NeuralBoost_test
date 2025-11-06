function triggerSOS(req, res) {
  const { user = 'anonymous' } = req.body || {};
  res.json({ ok: true, message: `SOS triggered by ${user}`, ts: Date.now() });
}

module.exports = { triggerSOS };
