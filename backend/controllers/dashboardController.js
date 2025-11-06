const path = require("path");

function getDashboard(_req, res) {
  res.json({
    totals: {
      analyzed: 342,
      threats: 57,
      sosTriggers: 12
    },
    trend: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, threats: Math.round(Math.random() * 10 + 2) })),
    heatmap: Array.from({ length: 7 }, (_, d) => ({ day: d, intensity: Math.round(Math.random() * 100) })),
    departments: [
      { name: 'Finance', clickedPct: 60 },
      { name: 'Tech', clickedPct: 15 }
    ],
    geoSources: [
      // lat, lon approximate clusters with intensity
      { lat: 28.6139, lon: 77.2090, count: 18, region: 'India' },
      { lat: 40.7128, lon: -74.0060, count: 9, region: 'NA' },
      { lat: 51.5074, lon: -0.1278, count: 7, region: 'Europe' },
      { lat: 1.3521, lon: 103.8198, count: 14, region: 'APAC' },
      { lat: -33.8688, lon: 151.2093, count: 5, region: 'APAC' },
      { lat: -23.5505, lon: -46.6333, count: 6, region: 'SA' }
    ]
  });
}

module.exports = { getDashboard };
