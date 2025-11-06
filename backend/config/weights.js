function getWeights() {
  // Weights sum roughly to 1.0
  return {
    sender: 0.28,
    url: 0.30,
    punycode: 0.12,
    nlp: 0.20,
    attachment: 0.10
  };
}

module.exports = { getWeights };


