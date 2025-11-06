function getAwareness(_req, res) {
  res.json({
    tips: [
      'Hover links to inspect destination before clicking.',
      'Verify sender domain carefully; watch for homoglyphs.',
      'Never enter credentials after clicking an email link.'
    ],
    trainings: [
      { id: 1, title: 'Spot the Phish 101', durationMin: 5 },
      { id: 2, title: 'Advanced URL Red Flags', durationMin: 8 }
    ]
  });
}

module.exports = { getAwareness };
