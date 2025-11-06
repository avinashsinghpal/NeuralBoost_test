// Dependencies: better-sqlite3, path, fs
// Purpose: SQLite database helper for QR scan results caching

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'data', 'qr_scans.db');
const DB_DIR = path.dirname(DB_PATH);

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let db = null;

function getDb() {
  if (!db) {
    try {
      db = new Database(DB_PATH);
      console.log('[QR DB] Database connected');
      initTable();
    } catch (err) {
      console.error('[QR DB] Error opening database:', err);
      throw err;
    }
  }
  return db;
}

function initTable() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS qr_scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      score INTEGER NOT NULL,
      category TEXT NOT NULL,
      reasons TEXT NOT NULL,
      user_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('[QR DB] Table initialized');
}

function getCachedResult(url) {
  try {
    const db = getDb();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const stmt = db.prepare(`
      SELECT score, category, reasons FROM qr_scans 
      WHERE url = ? AND created_at > ? 
      ORDER BY created_at DESC LIMIT 1
    `);
    
    const row = stmt.get(url, oneDayAgo);
    return row || null;
  } catch (err) {
    console.error('[QR DB] Error getting cached result:', err);
    return null;
  }
}

function saveResult(url, score, category, reasons, user_hash = null) {
  try {
    const db = getDb();
    const reasonsStr = Array.isArray(reasons) ? reasons.join('; ') : reasons;
    
    const stmt = db.prepare(`
      INSERT INTO qr_scans (url, score, category, reasons, user_hash) 
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(url, score, category, reasonsStr, user_hash);
    return result.lastInsertRowid;
  } catch (err) {
    console.error('[QR DB] Error saving result:', err);
    throw err;
  }
}

module.exports = {
  getCachedResult,
  saveResult,
  getDb
};

