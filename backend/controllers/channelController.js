const path = require("path");

function getChannels(_req, res) {
  res.json({
    channels: [
      { id: 'email', enabled: true },
      { id: 'slack', enabled: false },
      { id: 'teams', enabled: true }
    ]
  });
}

module.exports = { getChannels };
