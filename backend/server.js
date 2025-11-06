const express = require('express');
const cors = require('cors');

const analysisRoutes = require('./routes/analysisRoutes');
const sosRoutes = require('./routes/sosRoutes');
const awarenessRoutes = require('./routes/awarenessRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const channelRoutes = require('./routes/channelRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'TRACE backend', ts: Date.now() });
});

app.use('/api/analysis', analysisRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/awareness', awarenessRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/channels', channelRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`TRACE backend listening on http://localhost:${PORT}`);
});
