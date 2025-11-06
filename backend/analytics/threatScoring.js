function clampScore(v) { return Math.max(0, Math.min(100, Math.round(v))); }

function scoreThreats(results, weights) {
  const { sender, url, punycode, nlp, attachment } = results;
  const weighted = (
    sender.score * weights.sender +
    url.score * weights.url +
    punycode.score * weights.punycode +
    nlp.score * weights.nlp +
    attachment.score * weights.attachment
  );
  const threatScore = clampScore(weighted);
  const breakdown = { sender, url, punycode, nlp, attachment };
  return { threatScore, breakdown };
}

function riskFromScore(score) {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function fusionExplainFromWeights(weights, breakdown) {
  const parts = [
    `sender:${weights.sender}`,
    `url:${weights.url}`,
    `punycode:${weights.punycode}`,
    `nlp:${weights.nlp}`,
    `attachment:${weights.attachment}`
  ];
  return parts.join(' + ');
}

module.exports = { scoreThreats, riskFromScore, fusionExplainFromWeights };
