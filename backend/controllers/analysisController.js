function classify(emailText) {
  const randomScore = Math.round(Math.random() * 100);
  const label = randomScore > 60 ? 'phishing' : randomScore > 30 ? 'suspicious' : 'safe';
  return { score: randomScore, label };
}

function getAnalysis(req, res) {
  res.json({
    items: [
      { id: 1, subject: 'Reset your password', result: classify('...') },
      { id: 2, subject: 'Invoice attached', result: classify('...') },
      { id: 3, subject: 'Your package is on hold', result: classify('...') }
    ]
  });
}

function postAnalyze(req, res) {
  const { subject = '', body = '' } = req.body || {};
  const result = classify(`${subject} ${body}`);
  res.json({ subject, result });
}

module.exports = { getAnalysis, postAnalyze };
