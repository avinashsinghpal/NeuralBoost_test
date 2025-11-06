const crypto = require('crypto');
const QRCode = require('qrcode');
const { saveCampaign, saveEvent, getTrackedUrlBase, findRecipientByToken, markRecipientClicked, getPhishedRecipients } = require('../services/db/phishStore');
const { sendEmail } = require('../services/smtp/mailer');
const { getTemplate, getRandomTemplate, replacePlaceholders } = require('../services/phishing/templates');

function generateToken() {
  return crypto.randomBytes(16).toString('hex');
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
  try {
    const { token } = req.params;
    const ua = req.get('user-agent') || '';
    const ip = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || '';
    const found = findRecipientByToken(token);
    const details = { ua, ip };
    
    if (found) {
      markRecipientClicked(token, details);
      console.log(`[Tracking] Recipient ${found.recipient.contact} clicked link (token: ${token})`);
    } else {
      console.warn(`[Tracking] Unknown token clicked: ${token}`);
    }
    
    return phishedLanding(req, res);
  } catch (err) {
    console.error('[Tracking] Error:', err);
    next(err);
  }
}

function phishedLanding(_req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(`<!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>You have been phished (Simulation)</title>
    <style>
      html,body{margin:0;height:100%;background:#0b1220;color:#e5e7eb;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
      .wrap{min-height:100%;display:grid;place-items:center;padding:24px}
      .card{max-width:720px;background:#0f172a;border:1px solid #1f2937;border-radius:14px;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.35)}
      .pill{display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08)}
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <div class="pill"><span style="width:8px;height:8px;border-radius:999px;background:#ef4444"></span><strong>Phishing Simulation</strong></div>
        <h1 style="margin:14px 0 8px">You clicked a simulated phishing link</h1>
        <p style="opacity:.85">This was a training exercise. Your click has been recorded for awareness reporting. Please review our phishing safety checklist and report suspicious messages to your security team.</p>
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
      userAgent: row.user_agent || '—'
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


