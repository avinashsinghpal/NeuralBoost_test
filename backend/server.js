const express = require('express');
const cors = require('cors');

const analysisRoutes = require('./routes/analysisRoutes');
const sosRoutes = require('./routes/sosRoutes');
const awarenessRoutes = require('./routes/awarenessRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const chatRoutes = require('./routes/chatRoutes');
const channelRoutes = require('./routes/channelRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: '*', methods: ['GET','POST','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'TRACE backend', ts: Date.now() });
});

app.use('/api/analysis', analysisRoutes);
app.use('/api/analyze', analysisRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/awareness', awarenessRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/chat', chatRoutes);

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`TRACE backend listening on http://localhost:${PORT}`);
});
