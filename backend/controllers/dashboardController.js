const path = require("path");

function getDashboard(_req, res) {
  res.json({
    totals: {
      analyzed: 342,
      threats: 57,
      sosTriggers: 12
    },
    trend: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, threats: Math.round(Math.random() * 10 + 2) })),
    heatmap: Array.from({ length: 7 }, (_, d) => ({ day: d, intensity: Math.round(Math.random() * 100) }))
  });
}

module.exports = { getDashboard };
