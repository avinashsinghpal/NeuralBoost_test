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
  // Check for explicit public URL in environment (highest priority)
  if (process.env.TRACE_PUBLIC_URL) {
    const url = process.env.TRACE_PUBLIC_URL.replace(/\/$/, ''); // Remove trailing slash
    console.log('[getTrackedUrlBase] Using TRACE_PUBLIC_URL from env:', url);
    return url;
  }
  
  // Try to detect network IP automatically
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  let networkIP = null;
  
  // Find first non-internal IPv4 address
  for (const name of Object.keys(networkInterfaces)) {
    for (const iface of networkInterfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        networkIP = iface.address;
        break;
      }
    }
    if (networkIP) break;
  }
  
  // If we have a network IP and the request is from localhost, use network IP
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const requestHost = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:5001';
  
  console.log('[getTrackedUrlBase] Request host:', requestHost, '| Network IP:', networkIP);
  
  // If request is from localhost but we have a network IP, use network IP
  if (networkIP && (requestHost.includes('localhost') || requestHost.includes('127.0.0.1'))) {
    const url = `${proto}://${networkIP}:5001`;
    console.log('[getTrackedUrlBase] Using auto-detected network IP:', url);
    return url;
  }
  
  // Otherwise, use the request host (works for both local and network access)
  const url = `${proto}://${requestHost}`;
  console.log('[getTrackedUrlBase] Using request host:', url);
  return url;
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
  try {
    const clickedAt = Date.now();
    
    console.log('[markRecipientClicked] ========== START ==========');
    console.log('[markRecipientClicked] Token:', token);
    console.log('[markRecipientClicked] Details:', JSON.stringify(details, null, 2));
    
    // First, get recipient to ensure it exists
    const recipientBefore = stmts.getRecipientByToken.get(token);
    console.log('[markRecipientClicked] Recipient before update:', recipientBefore ? {
      id: recipientBefore.id,
      contact: recipientBefore.contact,
      name: recipientBefore.name,
      clicked_at: recipientBefore.clicked_at,
      click_count: recipientBefore.click_count
    } : 'NOT FOUND');
    
    if (!recipientBefore) {
      console.error('[markRecipientClicked] ❌ Recipient not found for token:', token);
      throw new Error(`Recipient not found for token: ${token}`);
    }
    
    // Update recipient clicked_at
    const updateResult = stmts.markRecipientClicked.run(clickedAt, token);
    console.log('[markRecipientClicked] ✅ Updated recipient, rows changed:', updateResult.changes);
    
    // Get recipient again to verify update
    const recipientAfter = stmts.getRecipientByToken.get(token);
    console.log('[markRecipientClicked] Recipient after update:', {
      id: recipientAfter.id,
      clicked_at: recipientAfter.clicked_at,
      click_count: recipientAfter.click_count
    });
    
    // Insert phished details
    if (recipientAfter && recipientAfter.id) {
      try {
        console.log('[markRecipientClicked] Inserting phished detail with:', {
          recipient_id: recipientAfter.id,
          ip: details.ip || null,
          ua: details.ua || null,
          deviceType: details.deviceType || null,
          os: details.os || null,
          browser: details.browser || null,
          clicked_at: clickedAt
        });
        
        // Check if phished_details already exists for this recipient
        const { db } = require('./database');
        const existing = db.prepare('SELECT * FROM phished_details WHERE recipient_id = ? ORDER BY clicked_at DESC LIMIT 1').get(recipientAfter.id);
        console.log('[markRecipientClicked] Existing phished_detail for recipient:', existing ? 'EXISTS' : 'NONE');
        
        const insertResult = stmts.insertPhishedDetail.run(
          recipientAfter.id,
          details.ip || null,
          details.ua || null,
          details.deviceType || null,
          details.os || null,
          details.browser || null,
          clickedAt
        );
        console.log('[markRecipientClicked] ✅ Inserted phished detail, lastInsertRowid:', insertResult.lastInsertRowid);
        console.log('[markRecipientClicked] ✅ Changes:', insertResult.changes);
        
        // Verify the insert immediately
        const verify = db.prepare('SELECT * FROM phished_details WHERE id = ?').get(insertResult.lastInsertRowid);
        if (verify) {
          console.log('[markRecipientClicked] ✅ Verified insert - Record:', {
            id: verify.id,
            recipient_id: verify.recipient_id,
            device_type: verify.device_type,
            operating_system: verify.operating_system,
            browser: verify.browser,
            ip_address: verify.ip_address
          });
        } else {
          console.error('[markRecipientClicked] ❌ VERIFICATION FAILED - Record not found after insert!');
        }
        
      } catch (insertErr) {
        console.error('[markRecipientClicked] ❌ Error inserting phished detail:', insertErr);
        console.error('[markRecipientClicked] ❌ Error message:', insertErr.message);
        console.error('[markRecipientClicked] ❌ Error stack:', insertErr.stack);
        throw insertErr;
      }
    } else {
      console.error('[markRecipientClicked] ❌ No recipient ID after update!');
      throw new Error('Recipient ID not found after update');
    }
    
    console.log('[markRecipientClicked] ========== END ==========');
  } catch (err) {
    console.error('[markRecipientClicked] ❌ FATAL ERROR:', err);
    console.error('[markRecipientClicked] ❌ Error stack:', err.stack);
    throw err;
  }
}

function getPhishedRecipients() {
  try {
    console.log('[getPhishedRecipients] Querying database...');
    const rows = stmts.getAllPhished.all();
    console.log('[getPhishedRecipients] Raw rows from DB:', rows.length);
    
    if (rows.length > 0) {
      console.log('[getPhishedRecipients] Sample row:', {
        id: rows[0].id,
        contact: rows[0].contact,
        name: rows[0].name,
        clicked_at: rows[0].clicked_at,
        device_type: rows[0].device_type,
        operating_system: rows[0].operating_system,
        browser: rows[0].browser
      });
    }
    
    const mapped = rows.map(row => ({
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
      deviceType: row.device_type,
      operatingSystem: row.operating_system,
      browser: row.browser,
      details: {
        ip: row.ip_address,
        ua: row.user_agent,
        deviceType: row.device_type,
        os: row.operating_system,
        browser: row.browser
      }
    }));
    
    console.log('[getPhishedRecipients] Mapped recipients:', mapped.length);
    return mapped;
  } catch (err) {
    console.error('[getPhishedRecipients] Error:', err);
    console.error('[getPhishedRecipients] Error stack:', err.stack);
    return [];
  }
}

function getPhishedByDepartment() {
  try {
    console.log('[getPhishedByDepartment] Querying database...');
    const summary = stmts.getPhishedByDepartment.all();
    console.log('[getPhishedByDepartment] Found', summary.length, 'departments');
    
    const grouped = {};
    for (const dept of summary) {
      const deptName = dept.department || 'Unknown';
      const details = stmts.getPhishedByDepartmentDetail.all(deptName);
      
      grouped[deptName] = {
        department: deptName,
        uniquePeople: dept.unique_people,
        totalClicks: dept.total_clicks,
        totalClickCount: dept.total_click_count,
        people: details.map(row => ({
          id: row.id,
          contact: row.contact,
          name: row.name,
          department: row.department,
          industry: row.industry,
          clickedAt: row.clicked_at,
          clickCount: row.click_count || 0,
          deviceType: row.device_type,
          operatingSystem: row.operating_system,
          browser: row.browser
        }))
      };
    }
    
    console.log('[getPhishedByDepartment] Grouped by', Object.keys(grouped).length, 'departments');
    return grouped;
  } catch (err) {
    console.error('[getPhishedByDepartment] Error:', err);
    console.error('[getPhishedByDepartment] Error stack:', err.stack);
    return {};
  }
}

module.exports = { saveCampaign, saveEvent, getTrackedUrlBase, findRecipientByToken, markRecipientClicked, getPhishedRecipients, getPhishedByDepartment };


