const { db, stmts, insertCampaignWithRecipients } = require('./database');

async function saveCampaign(campaign) {
  const recipients = campaign.recipients || [];
  insertCampaignWithRecipients(campaign, recipients);
}

async function saveEvent(event) {
  // Events are now stored in phished_details table when recipients click
  // This function is kept for backward compatibility
  console.log('[Event]', event);
}

function getTrackedUrlBase(req) {
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:5001';
  return `${proto}://${host}`;
}

function findRecipientByToken(token) {
  const row = stmts.getRecipientByToken.get(token);
  if (!row) return null;
  
  return {
    campaign: {
      id: row.campaign_id,
      meta: {
        department: row.meta_department,
        industry: row.meta_industry
      },
      mode: row.mode
    },
    recipient: {
      id: row.id,
      contact: row.contact,
      name: row.name,
      token: row.token,
      status: row.status,
      clickedAt: row.clicked_at
    }
  };
}

function markRecipientClicked(token, details) {
  const clickedAt = Date.now();
  
  // Update recipient clicked_at
  stmts.markRecipientClicked.run(clickedAt, token);
  
  // Get recipient ID to insert phished details
  const recipient = stmts.getRecipientByToken.get(token);
  if (recipient) {
    stmts.insertPhishedDetail.run(
      recipient.id,
      details.ip || null,
      details.ua || null,
      clickedAt
    );
  }
}

function getPhishedRecipients() {
  try {
    const rows = stmts.getAllPhished.all();
    return rows.map(row => ({
      id: row.id,
      contact: row.contact,
      name: row.name,
      department: row.department,
      industry: row.industry,
      clickedAt: row.clicked_at,
      clickCount: row.click_count || 0,
      mode: row.mode,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      details: {
        ip: row.ip_address,
        ua: row.user_agent
      }
    }));
  } catch (err) {
    console.error('[getPhishedRecipients] Error:', err);
    return [];
  }
}

module.exports = { saveCampaign, saveEvent, getTrackedUrlBase, findRecipientByToken, markRecipientClicked, getPhishedRecipients };


