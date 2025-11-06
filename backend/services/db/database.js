const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, 'data');
const dbPath = path.join(dbDir, 'phishing.db');

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    mode TEXT NOT NULL,
    meta_department TEXT,
    meta_industry TEXT,
    content_subject TEXT,
    content_message TEXT,
    tracked_url_base TEXT
  );

  CREATE TABLE IF NOT EXISTS recipients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id TEXT NOT NULL,
    contact TEXT NOT NULL,
    name TEXT,
    token TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'queued',
    clicked_at INTEGER,
    error TEXT,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS phished_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient_id INTEGER NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    clicked_at INTEGER NOT NULL,
    FOREIGN KEY (recipient_id) REFERENCES recipients(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_recipients_token ON recipients(token);
  CREATE INDEX IF NOT EXISTS idx_recipients_campaign ON recipients(campaign_id);
  CREATE INDEX IF NOT EXISTS idx_recipients_clicked ON recipients(clicked_at);
  CREATE INDEX IF NOT EXISTS idx_phished_recipient ON phished_details(recipient_id);
`);

// Prepared statements for better performance
const stmts = {
  insertCampaign: db.prepare(`
    INSERT INTO campaigns (id, created_at, mode, meta_department, meta_industry, content_subject, content_message, tracked_url_base)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  insertRecipient: db.prepare(`
    INSERT INTO recipients (campaign_id, contact, name, token, status)
    VALUES (?, ?, ?, ?, ?)
  `),
  
  updateRecipientStatus: db.prepare(`
    UPDATE recipients SET status = ?, error = ? WHERE id = ?
  `),
  
  markRecipientClicked: db.prepare(`
    UPDATE recipients SET clicked_at = ? WHERE token = ?
  `),
  
  insertPhishedDetail: db.prepare(`
    INSERT INTO phished_details (recipient_id, ip_address, user_agent, clicked_at)
    VALUES (?, ?, ?, ?)
  `),
  
  getRecipientByToken: db.prepare(`
    SELECT r.*, c.meta_department, c.meta_industry, c.mode
    FROM recipients r
    JOIN campaigns c ON r.campaign_id = c.id
    WHERE r.token = ?
  `),
  
  getAllPhished: db.prepare(`
    SELECT 
      r.id,
      r.contact,
      r.name,
      r.clicked_at,
      c.meta_department as department,
      c.meta_industry as industry,
      c.mode,
      pd.ip_address,
      pd.user_agent
    FROM recipients r
    JOIN campaigns c ON r.campaign_id = c.id
    LEFT JOIN phished_details pd ON r.id = pd.recipient_id
    WHERE r.clicked_at IS NOT NULL
    ORDER BY r.clicked_at DESC
  `),
  
  getCampaignRecipients: db.prepare(`
    SELECT * FROM recipients WHERE campaign_id = ?
  `)
};

// Transaction helpers
const insertCampaignWithRecipients = db.transaction((campaign, recipients) => {
  const { id, createdAt, mode, meta, content, trackedUrlBase } = campaign;
  
  stmts.insertCampaign.run(
    id,
    createdAt,
    mode,
    meta?.department || null,
    meta?.industry || null,
    content?.subject || null,
    content?.message || null,
    trackedUrlBase
  );
  
  for (const recipient of recipients) {
    stmts.insertRecipient.run(
      id,
      recipient.contact,
      recipient.name || null,
      recipient.token,
      recipient.status || 'queued'
    );
  }
});

module.exports = {
  db,
  stmts,
  insertCampaignWithRecipients
};

