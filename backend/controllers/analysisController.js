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
const orchestrate = require('../modules');
const { validateAnalyzeInput } = require('../utils/validate');
const { scoreThreats, riskFromScore, fusionExplainFromWeights } = require('../analytics/threatScoring');
const { getWeights } = require('../config/weights');
const { geminiExplain } = require('../services/xai/geminiExplain');

async function postAnalyzeEmail(req, res, next) {
  try {
    const input = req.body || {};
    const { valid, errors } = validateAnalyzeInput(input);
    if (!valid) {
      return res.status(400).json({ success: false, errors });
    }

    const steps = [];
    const runStep = async (label, fn) => {
      const result = await fn();
      steps.push({ index: steps.length + 1, label, done: true, result });
      return result;
    };

    const results = await orchestrate.runAll({
      headers: input.headers,
      bodyText: input.bodyText,
      urls: input.urls,
      attachmentsMeta: input.attachmentsMeta,
      channel: input.channel
    }, runStep);

    // Scenario override (demo realism)
    const { scenario } = input;
    const { scenarioOutcome } = require('../config/scenarioPresets');
    const preset = scenarioOutcome(scenario);

    const weights = getWeights();
    const computed = scoreThreats(results, weights);
    const breakdown = preset ? preset.breakdown : computed.breakdown;
    const riskCategory = preset ? preset.riskCategory : riskFromScore(computed.threatScore);
    const threatScore = preset && typeof preset.threatScore === 'number' ? preset.threatScore : computed.threatScore;
    const fusionExplain = undefined; // hidden in UI

    const xaiExplanation = await geminiExplain({ breakdown, threatScore, riskCategory, scenario });

    return res.json({
      success: true,
      threatScore,
      riskCategory,
      breakdown,
      fusionExplain,
      xaiExplanation,
      steps: steps.map(({ index, label, done }) => ({ index, label, done }))
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAnalysis, postAnalyze, postAnalyzeEmail };
