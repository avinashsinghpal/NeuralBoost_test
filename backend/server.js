const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const analysisRoutes = require('./routes/analysisRoutes');
const sosRoutes = require('./routes/sosRoutes');
const awarenessRoutes = require('./routes/awarenessRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const chatRoutes = require('./routes/chatRoutes');
const channelRoutes = require('./routes/channelRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ 
  origin: '*', 
  methods: ['GET','POST','PUT','DELETE','OPTIONS'], 
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false
}));
app.use(express.json({ limit: '1mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

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
app.use('/api/simulation', simulationRoutes);

// public tracking endpoint (not under /api)
app.get('/t/:token', require('./controllers/simulationController').trackToken);

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Initialize database on startup
try {
  require('./services/db/database');
  console.log('[DB] Database initialized');
} catch (dbErr) {
  console.error('[DB] Database initialization error:', dbErr);
}

app.listen(PORT, () => {
  console.log(`TRACE backend listening on http://localhost:${PORT}`);
});
