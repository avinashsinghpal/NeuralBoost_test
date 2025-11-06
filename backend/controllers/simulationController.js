const crypto = require('crypto');
const QRCode = require('qrcode');
const { saveCampaign, saveEvent, getTrackedUrlBase, findRecipientByToken, markRecipientClicked, getPhishedRecipients } = require('../services/db/phishStore');
const { sendEmail } = require('../services/smtp/mailer');
const { getTemplate, getRandomTemplate, replacePlaceholders } = require('../services/phishing/templates');

function generateToken() {
  return crypto.randomBytes(16).toString('hex');
}

// Helper function to parse device info from user agent
function parseDeviceInfo(userAgent) {
  const ua = userAgent.toLowerCase();
  let deviceType = 'Unknown';
  let os = 'Unknown';
  let browser = 'Unknown';
  
  // Detect device type
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) {
    deviceType = 'Mobile';
    if (ua.includes('android')) {
      os = 'Android';
      const androidVersion = ua.match(/android\s([0-9\.]*)/);
      if (androidVersion) os = `Android ${androidVersion[1]}`;
    } else if (ua.includes('iphone')) {
      os = 'iOS';
      const iosVersion = ua.match(/os\s([0-9_]*)/);
      if (iosVersion) os = `iOS ${iosVersion[1].replace(/_/g, '.')}`;
    } else if (ua.includes('ipad')) {
      deviceType = 'Tablet';
      os = 'iOS';
    }
  } else if (ua.includes('tablet')) {
    deviceType = 'Tablet';
  } else {
    deviceType = 'Desktop';
    if (ua.includes('windows')) {
      os = 'Windows';
      const winVersion = ua.match(/windows nt ([0-9\.]*)/);
      if (winVersion) os = `Windows ${winVersion[1]}`;
    } else if (ua.includes('mac os')) {
      os = 'macOS';
      const macVersion = ua.match(/mac os x ([0-9_]*)/);
      if (macVersion) os = `macOS ${macVersion[1].replace(/_/g, '.')}`;
    } else if (ua.includes('linux')) {
      os = 'Linux';
    }
  }
  
  // Detect browser
  if (ua.includes('chrome') && !ua.includes('edg')) {
    browser = 'Chrome';
    const chromeVersion = ua.match(/chrome\/([0-9\.]*)/);
    if (chromeVersion) browser = `Chrome ${chromeVersion[1]}`;
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari';
    const safariVersion = ua.match(/version\/([0-9\.]*)/);
    if (safariVersion) browser = `Safari ${safariVersion[1]}`;
  } else if (ua.includes('firefox')) {
    browser = 'Firefox';
    const firefoxVersion = ua.match(/firefox\/([0-9\.]*)/);
    if (firefoxVersion) browser = `Firefox ${firefoxVersion[1]}`;
  } else if (ua.includes('edg')) {
    browser = 'Edge';
    const edgeVersion = ua.match(/edg\/([0-9\.]*)/);
    if (edgeVersion) browser = `Edge ${edgeVersion[1]}`;
  } else if (ua.includes('opera') || ua.includes('opr')) {
    browser = 'Opera';
  }
  
  return { deviceType, os, browser };
}

async function sendSimulation(req, res, next) {
  try {
    console.log('[Simulation] Received request:', req.body);
    const { mode = 'email', recipients = [], meta = {}, content = {} } = req.body || {};
    
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ success: false, error: 'recipients required' });
    }

    console.log('[Simulation] Processing', recipients.length, 'recipients for mode:', mode);
    
    const base = getTrackedUrlBase(req);
    console.log('[Simulation] Tracked URL base:', base);
    
    const campaign = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      mode,
      recipients: [],
      meta,
      content,
      trackedUrlBase: `${base}/t`
    };
    
    // Build per-recipient tokens and attempt delivery (email mode)
    let delivered = 0;
    let bounced = 0;
    const perRecipient = [];
    
    for (const raw of recipients) {
      // allow optional "email,name" or "phone,name"
      const [contact, name] = String(raw).split(',').map(s => s.trim());
      const token = generateToken();
      const trackedUrl = `${base}/t/${token}`;
      const rec = { contact, name: name || undefined, token, status: 'queued' };
      campaign.recipients.push(rec);
      perRecipient.push({ contact, name: rec.name, token, trackedUrl });
    }

    console.log('[Simulation] Saving campaign...');
    // Save initial campaign with recipient tokens
    await saveCampaign(campaign);
    console.log('[Simulation] Campaign saved');

    if (mode === 'email') {
      console.log('[Simulation] Sending emails...');
      const { stmts } = require('../services/db/database');
      
      // Send emails in sequence (small batches); for scale, use queue
      for (const r of campaign.recipients) {
        try {
          const trackedUrl = `${base}/t/${r.token}`;
          
          // Use realistic phishing template
          let subject, html, text;
          const templateType = content.templateType || 'random'; // banking, tech_support, invoice, package, social_media, or random
          try {
            console.log('[Simulation] Using template type:', templateType);
            const template = templateType === 'random' ? getRandomTemplate() : getTemplate(templateType);
            const emailContent = replacePlaceholders(template, trackedUrl, content.message || '');
            
            subject = content.subject || emailContent.subject;
            html = emailContent.html;
            text = emailContent.text;
            console.log('[Simulation] Template generated successfully, subject:', subject);
          } catch (templateErr) {
            console.error('[Simulation] Template error:', templateErr);
            // Fallback to simple email
            subject = content.subject || 'Security Notice';
            text = `${content.message || 'Please verify your account'}\n\nVerify here: ${trackedUrl}`;
            html = `
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#111">
                <p>${(content.message || 'Please verify your account').replace(/\n/g,'<br/>')}</p>
                <p><a href="${trackedUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none">Verify</a></p>
                <p style="color:#666">If the button doesn't work, copy this link:<br/><span>${trackedUrl}</span></p>
              </div>`;
          }
          
          console.log('[Simulation] Sending email to:', r.contact, 'using template:', templateType);
          await sendEmail({ to: r.contact, subject, text, html });
          
          // Update recipient status in database
          const recipient = stmts.getRecipientByToken.get(r.token);
          if (recipient) {
            stmts.updateRecipientStatus.run('delivered', null, recipient.id);
          }
          
          r.status = 'delivered';
          delivered += 1;
          console.log('[Simulation] Email delivered to:', r.contact);
        } catch (e) {
          console.error(`[SMTP] Failed to send to ${r.contact}:`, e.message);
          
          // Update recipient status in database
          const recipient = stmts.getRecipientByToken.get(r.token);
          if (recipient) {
            stmts.updateRecipientStatus.run('bounced', e.message, recipient.id);
          }
          
          r.status = 'bounced';
          r.error = e.message;
          bounced += 1;
        }
      }
      console.log('[Simulation] Campaign updated with delivery statuses');
    }

    let qr = undefined;
    if (mode === 'qr') {
      try {
        console.log('[Simulation] Generating QR code...');
        qr = await QRCode.toDataURL(`${base}/t/${perRecipient[0]?.token || ''}`, { margin: 2, scale: 6 });
        console.log('[Simulation] QR code generated');
      } catch (e) {
        console.error('[Simulation] QR generation failed:', e.message);
        // Don't fail the whole request if QR fails
      }
    }

    console.log('[Simulation] Sending response...');
    return res.json({
      success: true,
      mode,
      recipients: perRecipient,
      summary: {
        totalRecipients: campaign.recipients.length,
        delivered,
        bounced,
        trackedUrlBase: `${base}/t`
      },
      qr
    });
  } catch (err) {
    console.error('[Simulation] Error in sendSimulation:', err);
    next(err);
  }
}

async function trackToken(req, res, next) {
  let found = null;
  let deviceInfo = { deviceType: 'Unknown', os: 'Unknown', browser: 'Unknown' };
  let ip = '';
  
  try {
    console.log('[trackToken] ========== CLICK DETECTED ==========');
    const { token } = req.params;
    console.log('[trackToken] Token from URL:', token);
    
    const ua = req.get('user-agent') || '';
    console.log('[trackToken] User-Agent:', ua);
    
    // Get IP address (check for proxy headers)
    ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.ip ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         req.socket?.remoteAddress?.replace('::ffff:', '') ||
         '';
    console.log('[trackToken] IP Address:', ip);
    
    // Parse device information
    deviceInfo = parseDeviceInfo(ua);
    console.log('[trackToken] Parsed device info:', deviceInfo);
    
    try {
      found = findRecipientByToken(token);
      console.log('[trackToken] Found recipient:', found ? {
        contact: found.recipient.contact,
        name: found.recipient.name,
        id: found.recipient.id
      } : 'NOT FOUND');
    } catch (findErr) {
      console.error('[trackToken] Error finding recipient:', findErr);
      // Continue to show landing page even if lookup fails
    }
    
    const details = { 
      ua, 
      ip,
      deviceType: deviceInfo.deviceType,
      os: deviceInfo.os,
      browser: deviceInfo.browser
    };
    console.log('[trackToken] Details to save:', details);
    
    if (found) {
      try {
        console.log('[trackToken] Calling markRecipientClicked...');
        markRecipientClicked(token, details);
        console.log(`[trackToken] ✅ Successfully recorded click for ${found.recipient.contact} (token: ${token})`);
        console.log(`[trackToken] Device: ${deviceInfo.deviceType} | OS: ${deviceInfo.os} | Browser: ${deviceInfo.browser} | IP: ${ip}`);
      } catch (dbErr) {
        console.error(`[trackToken] ❌ Failed to save click to database:`, dbErr);
        console.error(`[trackToken] Error message:`, dbErr.message);
        console.error(`[trackToken] Error stack:`, dbErr.stack);
        console.error(`[trackToken] Error details:`, {
          token,
          recipient: found?.recipient?.contact || 'unknown',
          error: dbErr.message
        });
        // Still show the landing page even if DB save fails
      }
    } else {
      console.warn(`[trackToken] ⚠️ Unknown token clicked: ${token}`);
      // Log unknown token attempts for security monitoring
      // (We don't store them in the database since there's no recipient record)
      console.log(`[trackToken] Unknown token attempt - IP: ${ip}, Device: ${deviceInfo.deviceType}, OS: ${deviceInfo.os}, Browser: ${deviceInfo.browser}`);
    }
    
    console.log('[trackToken] ========== END ==========');
  } catch (err) {
    console.error('[trackToken] ❌ FATAL ERROR:', err);
    console.error('[trackToken] Error stack:', err.stack);
    // Don't call next(err) - always show landing page
  }
  
  // Always show the landing page, even if there was an error or unknown token
  try {
    return phishedLanding(req, res, found);
  } catch (landingErr) {
    console.error('[trackToken] ❌ Error rendering landing page:', landingErr);
    // Fallback: send a simple HTML response
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).end(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Security Alert</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0b1220 0%, #1e293b 100%);
      color: #e5e7eb;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      max-width: 600px;
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 32px;
      text-align: center;
    }
    h1 { color: #ef4444; margin-bottom: 16px; }
    p { margin: 12px 0; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>⚠️ Security Alert</h1>
    <p><strong>You have been phished!</strong></p>
    <p>This was a simulated phishing attack for educational purposes.</p>
    <p style="margin-top: 24px; font-size: 14px; opacity: 0.8;">Your click has been recorded for security awareness training.</p>
  </div>
</body>
</html>`);
  }
}

function phishedLanding(req, res, recipientInfo) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  const ua = req.get('user-agent') || '';
  const deviceInfo = parseDeviceInfo(ua);
  
  res.end(`<!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Security Alert - Verification Required</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { 
        height: 100%; 
        background: linear-gradient(135deg, #0b1220 0%, #1e293b 100%);
        color: #e5e7eb; 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
      }
      .wrap { 
        min-height: 100vh; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        padding: 20px;
      }
      .card { 
        max-width: 600px; 
        width: 100%;
        background: rgba(15, 23, 42, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px; 
        padding: 32px;
        box-shadow: 0 20px 60px rgba(0,0,0,.5);
        backdrop-filter: blur(10px);
      }
      .alert-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: 999px;
        background: rgba(239, 68, 68, 0.2);
        border: 1px solid rgba(239, 68, 68, 0.3);
        margin-bottom: 20px;
        font-size: 14px;
        font-weight: 600;
      }
      .alert-badge::before {
        content: '';
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #ef4444;
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      h1 { 
        margin: 0 0 16px 0;
        font-size: 28px;
        font-weight: 700;
        color: #fff;
        line-height: 1.2;
      }
      .subtitle {
        font-size: 18px;
        color: #f59e0b;
        margin-bottom: 24px;
        font-weight: 600;
      }
      .info-box {
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 12px;
        padding: 20px;
        margin: 24px 0;
      }
      .info-box h3 {
        color: #60a5fa;
        margin-bottom: 12px;
        font-size: 16px;
      }
      .info-box ul {
        list-style: none;
        padding-left: 0;
      }
      .info-box li {
        padding: 8px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }
      .info-box li:last-child {
        border-bottom: none;
      }
      .info-box strong {
        color: #cbd5e1;
      }
      .warning-box {
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-radius: 12px;
        padding: 20px;
        margin: 24px 0;
      }
      .warning-box h3 {
        color: #fbbf24;
        margin-bottom: 12px;
        font-size: 16px;
      }
      p { 
        opacity: 0.9;
        margin-bottom: 16px;
        font-size: 16px;
      }
      .device-info {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
        margin: 20px 0;
      }
      .device-item {
        background: rgba(255, 255, 255, 0.05);
        padding: 12px;
        border-radius: 8px;
        text-align: center;
      }
      .device-item-label {
        font-size: 12px;
        opacity: 0.7;
        margin-bottom: 4px;
      }
      .device-item-value {
        font-size: 14px;
        font-weight: 600;
        color: #60a5fa;
      }
      @media (max-width: 640px) {
        .card { padding: 24px; }
        h1 { font-size: 24px; }
        .device-info { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <div class="alert-badge">
          <strong>⚠️ PHISHING SIMULATION DETECTED</strong>
        </div>
        <h1>You Have Been Phished</h1>
        <p class="subtitle">This was a security awareness training exercise</p>
        
        <div class="info-box">
          <h3>📊 Your Click Has Been Recorded</h3>
          <p style="margin-bottom: 12px;">The following information was captured:</p>
          <div class="device-info">
            <div class="device-item">
              <div class="device-item-label">Device Type</div>
              <div class="device-item-value">${deviceInfo.deviceType}</div>
            </div>
            <div class="device-item">
              <div class="device-item-label">Operating System</div>
              <div class="device-item-value">${deviceInfo.os}</div>
            </div>
            <div class="device-item">
              <div class="device-item-label">Browser</div>
              <div class="device-item-value">${deviceInfo.browser}</div>
            </div>
          </div>
        </div>
        
        <div class="warning-box">
          <h3>🛡️ What You Should Know</h3>
          <ul>
            <li><strong>This was a test:</strong> No actual security breach occurred</li>
            <li><strong>Your data is safe:</strong> This is part of a security awareness program</li>
            <li><strong>Learn from this:</strong> Real phishing attacks use similar tactics</li>
          </ul>
        </div>
        
        <div class="info-box">
          <h3>✅ How to Protect Yourself</h3>
          <ul>
            <li>✅ Always verify the sender's email address</li>
            <li>✅ Check for spelling and grammar errors</li>
            <li>✅ Hover over links before clicking to see the real URL</li>
            <li>✅ Never enter credentials on suspicious websites</li>
            <li>✅ When in doubt, contact the organization directly</li>
            <li>✅ Report suspicious emails to your IT security team</li>
          </ul>
        </div>
        
        <p style="margin-top: 24px; font-size: 14px; opacity: 0.7; text-align: center;">
          This simulation was conducted as part of your organization's cybersecurity awareness training program.
        </p>
      </div>
    </div>
  </body>
  </html>`);
}

async function getPhished(req, res, next) {
  try {
    const phished = getPhishedRecipients();
    return res.json({ success: true, phished, count: phished.length });
  } catch (err) {
    next(err);
  }
}

async function getAllPhishedDetails(req, res, next) {
  try {
    console.log('[getAllPhishedDetails] Fetching phished recipients...');
    const { stmts } = require('../services/db/database');
    
    let phished = [];
    try {
      phished = stmts.getAllPhished.all();
      console.log('[getAllPhishedDetails] Found', phished.length, 'phished recipients');
    } catch (dbErr) {
      console.error('[getAllPhishedDetails] Database error:', dbErr);
      return res.status(500).json({ success: false, error: 'Database query failed: ' + dbErr.message });
    }
    
    const formatted = phished.map(row => ({
      id: row.id,
      name: row.name || '—',
      contact: row.contact,
      department: row.department || '—',
      industry: row.industry || '—',
      mode: row.mode,
      clickedAt: new Date(row.clicked_at).toISOString(),
      clickedAtFormatted: new Date(row.clicked_at).toLocaleString(),
      clickCount: row.click_count || 0,
      ipAddress: row.ip_address || '—',
      userAgent: row.user_agent || '—',
      deviceType: row.device_type || '—',
      operatingSystem: row.operating_system || '—',
      browser: row.browser || '—'
    }));
    
    // Get aggregated stats by contact
    let byContact = [];
    try {
      byContact = stmts.getPhishedByContact.all();
      console.log('[getAllPhishedDetails] Found', byContact.length, 'unique contacts');
    } catch (dbErr) {
      console.error('[getAllPhishedDetails] Error getting by contact:', dbErr);
    }
    
    const contactStats = byContact.map(row => ({
      contact: row.contact,
      name: row.name || '—',
      department: row.department || '—',
      industry: row.industry || '—',
      totalCampaigns: row.total_campaigns || 0,
      totalClicks: row.total_clicks || 0,
      lastClicked: new Date(row.last_clicked).toLocaleString()
    }));
    
    return res.json({ 
      success: true, 
      data: formatted, 
      count: formatted.length,
      byContact: contactStats,
      table: {
        headers: ['ID', 'Name', 'Contact', 'Department', 'Industry', 'Mode', 'Clicked At', 'Times Phished', 'IP Address', 'User Agent'],
        rows: formatted.map(p => [
          p.id,
          p.name,
          p.contact,
          p.department,
          p.industry,
          p.mode,
          p.clickedAtFormatted,
          p.clickCount,
          p.ipAddress,
          p.userAgent
        ])
      }
    });
  } catch (err) {
    console.error('[getAllPhishedDetails] Error:', err);
    next(err);
  }
}

async function getTemplateOptions(req, res, next) {
  try {
    const { getTemplateOptions } = require('../services/phishing/templates');
    const { type } = req.params;
    const options = getTemplateOptions(type);
    return res.json({ success: true, ...options });
  } catch (err) {
    next(err);
  }
}

module.exports = { sendSimulation, trackToken, phishedLanding, testSMTP, getPhished, getAllPhishedDetails, getTemplateOptions };

async function testSMTP(_req, res, next) {
  try {
    const hasConfig = !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;
    if (!hasConfig) {
      return res.json({ 
        configured: false, 
        message: 'SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env' 
      });
    }
    // Try to verify connection
    const nodemailer = require('nodemailer');
    const testTransport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 5000
    });
    await testTransport.verify();
    res.json({ configured: true, verified: true, message: 'SMTP connection successful!' });
  } catch (err) {
    res.status(500).json({ 
      configured: true, 
      verified: false, 
      error: err.message,
      code: err.code 
    });
  }
}


