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
    click_count INTEGER DEFAULT 0,
    error TEXT,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS phished_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient_id INTEGER NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    device_type TEXT,
    operating_system TEXT,
    browser TEXT,
    clicked_at INTEGER NOT NULL,
    FOREIGN KEY (recipient_id) REFERENCES recipients(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_recipients_token ON recipients(token);
  CREATE INDEX IF NOT EXISTS idx_recipients_campaign ON recipients(campaign_id);
  CREATE INDEX IF NOT EXISTS idx_recipients_clicked ON recipients(clicked_at);
  CREATE INDEX IF NOT EXISTS idx_phished_recipient ON phished_details(recipient_id);
`);

// Migration: Add click_count column if it doesn't exist
try {
  const test = db.prepare('SELECT click_count FROM recipients LIMIT 1');
  test.get();
} catch (e) {
  if (e.message && e.message.includes('no such column')) {
    console.log('[DB] Adding click_count column to recipients table...');
    try {
      db.exec('ALTER TABLE recipients ADD COLUMN click_count INTEGER DEFAULT 0');
      db.exec('UPDATE recipients SET click_count = 1 WHERE clicked_at IS NOT NULL');
      console.log('[DB] Migration completed successfully');
    } catch (migErr) {
      console.error('[DB] Migration error:', migErr.message);
    }
  }
}

// Migration: Add device info columns to phished_details if they don't exist
try {
  const test = db.prepare('SELECT device_type FROM phished_details LIMIT 1');
  test.get();
  console.log('[DB] ✅ device_type column exists');
} catch (e) {
  if (e.message && e.message.includes('no such column')) {
    console.log('[DB] ⚠️ Adding device info columns to phished_details table...');
    try {
      db.exec('ALTER TABLE phished_details ADD COLUMN device_type TEXT');
      console.log('[DB] ✅ Added device_type column');
      db.exec('ALTER TABLE phished_details ADD COLUMN operating_system TEXT');
      console.log('[DB] ✅ Added operating_system column');
      db.exec('ALTER TABLE phished_details ADD COLUMN browser TEXT');
      console.log('[DB] ✅ Added browser column');
      console.log('[DB] ✅ Device info migration completed successfully');
    } catch (migErr) {
      console.error('[DB] ❌ Device info migration error:', migErr.message);
      console.error('[DB] ❌ Migration error stack:', migErr.stack);
    }
  } else {
    console.error('[DB] ❌ Error checking device_type column:', e.message);
  }
}

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
    UPDATE recipients SET clicked_at = ?, click_count = click_count + 1 WHERE token = ?
  `),
  
  insertPhishedDetail: db.prepare(`
    INSERT INTO phished_details (recipient_id, ip_address, user_agent, device_type, operating_system, browser, clicked_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
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
      COALESCE(r.click_count, 0) as click_count,
      c.meta_department as department,
      c.meta_industry as industry,
      c.mode,
      pd.ip_address,
      pd.user_agent,
      pd.device_type,
      pd.operating_system,
      pd.browser
    FROM recipients r
    JOIN campaigns c ON r.campaign_id = c.id
    LEFT JOIN (
      SELECT 
        recipient_id,
        ip_address,
        user_agent,
        device_type,
        operating_system,
        browser,
        clicked_at,
        ROW_NUMBER() OVER (PARTITION BY recipient_id ORDER BY clicked_at DESC) as rn
      FROM phished_details
    ) pd ON r.id = pd.recipient_id AND pd.rn = 1
    WHERE r.clicked_at IS NOT NULL
    ORDER BY r.clicked_at DESC
  `),
  
  getPhishedByContact: db.prepare(`
    SELECT 
      r.contact,
      r.name,
      COUNT(DISTINCT r.campaign_id) as total_campaigns,
      SUM(COALESCE(r.click_count, 0)) as total_clicks,
      MAX(r.clicked_at) as last_clicked,
      MAX(c.meta_department) as department,
      MAX(c.meta_industry) as industry
    FROM recipients r
    JOIN campaigns c ON r.campaign_id = c.id
    WHERE r.clicked_at IS NOT NULL
    GROUP BY r.contact, r.name
    ORDER BY total_clicks DESC, last_clicked DESC
  `),
  
  getPhishedByDepartment: db.prepare(`
    SELECT 
      c.meta_department as department,
      COUNT(DISTINCT r.contact) as unique_people,
      COUNT(r.id) as total_clicks,
      SUM(COALESCE(r.click_count, 0)) as total_click_count
    FROM recipients r
    JOIN campaigns c ON r.campaign_id = c.id
    WHERE r.clicked_at IS NOT NULL
    GROUP BY c.meta_department
    ORDER BY total_click_count DESC, unique_people DESC
  `),
  
  getPhishedByDepartmentDetail: db.prepare(`
    SELECT 
      r.id,
      r.contact,
      r.name,
      c.meta_department as department,
      c.meta_industry as industry,
      r.clicked_at,
      COALESCE(r.click_count, 0) as click_count,
      pd.device_type,
      pd.operating_system,
      pd.browser
    FROM recipients r
    JOIN campaigns c ON r.campaign_id = c.id
    LEFT JOIN (
      SELECT 
        recipient_id,
        device_type,
        operating_system,
        browser,
        ROW_NUMBER() OVER (PARTITION BY recipient_id ORDER BY clicked_at DESC) as rn
      FROM phished_details
    ) pd ON r.id = pd.recipient_id AND pd.rn = 1
    WHERE r.clicked_at IS NOT NULL
      AND c.meta_department = ?
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

