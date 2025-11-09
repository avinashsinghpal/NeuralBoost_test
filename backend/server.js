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
const authRoutes = require('./routes/authRoutes');
const qrScanRoutes = require('./routes/qrScan');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { initializeDefaultCompanies } = require('./controllers/authController');

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
app.use('/api/auth', authRoutes);
app.use('/api/qr', qrScanRoutes);

// public tracking endpoint (not under /api)
// This route must be accessible without authentication for phishing simulation
app.get('/t/:token', require('./controllers/simulationController').trackToken);

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Initialize database on startup
try {
  require('./services/db/database');
  console.log('[DB] Database initialized');
  // Initialize default companies after database is ready
  initializeDefaultCompanies();
} catch (dbErr) {
  console.error('[DB] Database initialization error:', dbErr);
}

// Listen on all network interfaces (0.0.0.0) to allow access from other devices
try {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`TRACE backend listening on http://0.0.0.0:${PORT}`);
    console.log(`TRACE backend accessible at http://localhost:${PORT} (local)`);
    console.log(`TRACE backend accessible at http://<your-ip>:${PORT} (network)`);
  });

  // Handle server errors
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${PORT} is already in use!`);
      console.error(`\nTo fix this, you can:`);
      console.error(`1. Kill the process using port ${PORT}:`);
      console.error(`   Windows: netstat -ano | findstr :${PORT} (then taskkill /PID <PID> /F)`);
      console.error(`   Mac/Linux: lsof -ti:${PORT} | xargs kill -9`);
      console.error(`2. Or change the port by setting PORT environment variable`);
      console.error(`   Example: PORT=5002 npm start\n`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
} catch (err) {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use!`);
    console.error(`\nTo fix this, you can:`);
    console.error(`1. Kill the process using port ${PORT}:`);
    console.error(`   Windows: netstat -ano | findstr :${PORT} (then taskkill /PID <PID> /F)`);
    console.error(`   Mac/Linux: lsof -ti:${PORT} | xargs kill -9`);
    console.error(`2. Or change the port by setting PORT environment variable`);
    console.error(`   Example: PORT=5002 npm start\n`);
    process.exit(1);
  } else {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}
