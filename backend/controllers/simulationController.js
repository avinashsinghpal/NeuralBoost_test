const crypto = require('crypto');
const QRCode = require('qrcode');
const { saveCampaign, saveEvent, getTrackedUrlBase, findRecipientByToken, markRecipientClicked, getPhishedRecipients, getPhishedByDepartment } = require('../services/db/phishStore');
const { sendEmail } = require('../services/smtp/mailer');
const { sendSMS } = require('../services/sms/sender');
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
      console.log('[Simulation] Processing QR code mode...');
      const { stmts } = require('../services/db/database');
      
      // Generate QR codes for each recipient and send via email
      for (const r of campaign.recipients) {
        try {
          const trackedUrl = `${base}/t/${r.token}`;
          
          // Generate QR code for this recipient as buffer for attachment
          let qrBuffer;
          try {
            qrBuffer = await QRCode.toBuffer(trackedUrl, { margin: 2, scale: 6, errorCorrectionLevel: 'M' });
            console.log('[Simulation] QR code generated for:', r.contact);
          } catch (qrErr) {
            console.error('[Simulation] QR generation failed for', r.contact, ':', qrErr.message);
            continue;
          }
          
          // Create professional, convincing email with QR code
          const subject = content.subject || 'Action Required: Verify Your Account Access - Security Update';
          
          // Generate realistic details
          const refNumber = `REF-${Date.now().toString().slice(-8)}`;
          const caseId = `CASE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
          const timestamp = new Date().toLocaleString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            timeZoneName: 'short'
          });
          const companyName = 'SecureAccess Portal';
          const supportEmail = 'security@secureaccess.com';
          const supportPhone = '1-800-555-0199';
          
          // Create a more convincing message if not provided
          const defaultMessage = `We have detected a login attempt to your account from a new device or location. As part of our enhanced security measures, we require immediate verification to ensure your account remains protected.

This verification is mandatory and must be completed within the next 24 hours to maintain uninterrupted access to your account services.`;
          
          const message = content.message || defaultMessage;
          
          const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f4f4">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f4f4f4">
    <tr>
      <td align="center" style="padding:40px 20px">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1)">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a8a 0%,#3b82f6 100%);padding:30px;text-align:center;border-radius:8px 8px 0 0">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:600">${companyName}</h1>
              <p style="margin:8px 0 0 0;color:rgba(255,255,255,0.9);font-size:14px">Secure Authentication Portal</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding:40px 30px">
              <p style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#1f2937">
                Dear Account Holder,
              </p>
              
              <p style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#1f2937">
                ${message.replace(/\n/g, '<br/>')}
              </p>
              
              <div style="background-color:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:20px;margin:25px 0">
                <p style="margin:0 0 12px 0;font-size:15px;color:#9a3412;font-weight:600">
                  ⚠️ Why You're Receiving This Email
                </p>
                <p style="margin:0;font-size:14px;color:#7c2d12;line-height:1.6">
                  Our automated security monitoring system has flagged activity that requires verification. This is a standard security procedure designed to protect your account from unauthorized access. Failure to complete verification may result in temporary account restrictions.
                </p>
              </div>
              
              <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px;margin:30px 0">
                <div style="background-color:#ffffff;border:1px solid #cbd5e1;border-radius:6px;padding:15px;margin-bottom:20px">
                  <p style="margin:0 0 8px 0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px">Case Information</p>
                  <table style="width:100%;border-collapse:collapse;font-size:13px">
                    <tr>
                      <td style="padding:6px 0;color:#475569;width:140px"><strong>Reference Number:</strong></td>
                      <td style="padding:6px 0;color:#1e40af;font-family:monospace">${refNumber}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#475569"><strong>Case ID:</strong></td>
                      <td style="padding:6px 0;color:#1e40af;font-family:monospace">${caseId}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#475569"><strong>Date & Time:</strong></td>
                      <td style="padding:6px 0;color:#475569">${timestamp}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#475569"><strong>Account Email:</strong></td>
                      <td style="padding:6px 0;color:#475569">${r.contact}</td>
                    </tr>
                  </table>
                </div>
                
                <p style="margin:0 0 20px 0;font-size:15px;color:#1f2937;line-height:1.6;text-align:center">
                  <strong>To complete verification, please scan the QR code below using your mobile device:</strong>
                </p>
                
                <!-- QR Code Image -->
                <div style="background-color:#ffffff;padding:20px;border-radius:8px;display:inline-block;box-shadow:0 4px 6px rgba(0,0,0,0.1);margin:20px 0">
                  <img src="cid:qrcode" alt="Secure Access QR Code" style="width:220px;height:220px;display:block;margin:0 auto" />
                </div>
                
                <div style="background-color:#eff6ff;border-left:4px solid #3b82f6;padding:15px;border-radius:4px;margin:20px 0;text-align:left">
                  <p style="margin:0 0 10px 0;font-size:14px;color:#1e40af;font-weight:600">
                    📱 How to Scan the QR Code:
                  </p>
                  <ol style="margin:0;padding-left:20px;color:#1e3a8a;font-size:13px;line-height:1.8">
                    <li>Open the camera app on your smartphone or tablet</li>
                    <li>Point your camera at the QR code above</li>
                    <li>Wait for the notification to appear, then tap it</li>
                    <li>You will be redirected to our secure verification portal</li>
                  </ol>
                  <p style="margin:10px 0 0 0;font-size:12px;color:#64748b;line-height:1.6">
                    <em>Note: If your camera doesn't recognize the QR code automatically, you can download a free QR code scanner app from your device's app store.</em>
                  </p>
                </div>
              </div>
              
              <div style="background-color:#fef3c7;border-left:4px solid #f59e0b;padding:18px;border-radius:4px;margin:25px 0">
                <p style="margin:0 0 12px 0;font-size:14px;color:#92400e;font-weight:600;line-height:1.6">
                  ⚠️ Important Security Information:
                </p>
                <ul style="margin:0;padding-left:20px;color:#92400e;font-size:13px;line-height:1.8">
                  <li>This QR code is valid for <strong>24 hours</strong> from the time this email was sent</li>
                  <li>The code can only be used <strong>once</strong> for security purposes</li>
                  <li>If you did not attempt to access your account, <strong>do not scan this code</strong></li>
                  <li>Our security team will <strong>never</strong> ask for your password via email</li>
                  <li>If you have concerns, contact us immediately at <strong>${supportPhone}</strong></li>
                </ul>
              </div>
              
              <div style="background-color:#f0fdf4;border:1px solid #86efac;border-radius:6px;padding:18px;margin:25px 0">
                <p style="margin:0 0 10px 0;font-size:14px;color:#166534;font-weight:600">
                  ✅ What Happens After Verification:
                </p>
                <p style="margin:0;font-size:13px;color:#15803d;line-height:1.7">
                  Once you complete the verification process, your account will be fully restored with all security features enabled. You will receive a confirmation email within 5 minutes of successful verification. This process typically takes less than 2 minutes to complete.
                </p>
              </div>
              
              <div style="border-top:2px solid #e5e7eb;padding-top:25px;margin-top:30px">
                <p style="margin:0 0 15px 0;font-size:14px;color:#1f2937;line-height:1.6;font-weight:600">
                  Alternative Verification Method:
                </p>
                <p style="margin:0 0 20px 0;font-size:14px;color:#6b7280;line-height:1.6">
                  If you are unable to scan the QR code, you can complete verification by clicking the secure link below. This link uses the same encryption and security protocols as the QR code method.
                </p>
                <p style="margin:20px 0;text-align:center">
                  <a href="${trackedUrl}" style="display:inline-block;background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:600;font-size:15px;box-shadow:0 4px 6px rgba(59,130,246,0.3)">Verify Account Now</a>
                </p>
                <p style="margin:15px 0 0 0;font-size:11px;color:#9ca3af;word-break:break-all;text-align:center;font-family:monospace;background-color:#f8fafc;padding:10px;border-radius:4px">
                  ${trackedUrl}
                </p>
                <p style="margin:15px 0 0 0;font-size:12px;color:#64748b;text-align:center;line-height:1.5">
                  <em>This link will expire in 24 hours for security purposes</em>
                </p>
              </div>
              
              <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:18px;margin:30px 0">
                <p style="margin:0 0 12px 0;font-size:14px;color:#1f2937;font-weight:600">
                  Need Help?
                </p>
                <p style="margin:0 0 8px 0;font-size:13px;color:#475569;line-height:1.6">
                  If you have questions or concerns about this verification request, our security support team is available 24/7 to assist you:
                </p>
                <p style="margin:8px 0 0 0;font-size:13px;color:#1e40af;line-height:1.6">
                  📞 Phone: <strong>${supportPhone}</strong><br/>
                  📧 Email: <strong>${supportEmail}</strong>
                </p>
              </div>
              
              <p style="margin:30px 0 0 0;font-size:13px;line-height:1.7;color:#6b7280;border-top:1px solid #e5e7eb;padding-top:20px">
                <strong>Security Reminder:</strong> This is an automated security notification sent to protect your account. For your protection, please do not share this QR code, verification link, or any account information with anyone. Our support team will <strong>never</strong> ask you for your password, PIN, or full account number via email or phone.
              </p>
              
              <p style="margin:25px 0 0 0;font-size:14px;line-height:1.6;color:#1f2937">
                Thank you for helping us keep your account secure.
              </p>
              
              <p style="margin:20px 0 0 0;font-size:14px;line-height:1.6;color:#1f2937">
                Sincerely,<br/>
                <strong>Account Security & Verification Team</strong><br/>
                ${companyName}<br/>
                <span style="font-size:12px;color:#64748b">Trusted by millions of users worldwide</span>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:25px 30px;border-top:1px solid #e5e7eb;border-radius:0 0 8px 8px">
              <p style="margin:0 0 10px 0;font-size:12px;color:#6b7280;text-align:center;line-height:1.5">
                This email was sent to <strong>${r.contact}</strong> as part of our security verification process.
              </p>
              <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center">
                © ${new Date().getFullYear()} ${companyName}. All rights reserved. | Privacy Policy | Terms of Service
              </p>
              <p style="margin:10px 0 0 0;font-size:11px;color:#9ca3af;text-align:center;line-height:1.6">
                For security-related inquiries, contact us at <strong>${supportEmail}</strong> or call <strong>${supportPhone}</strong><br/>
                Our support team is available 24 hours a day, 7 days a week to assist you.
              </p>
              <p style="margin:15px 0 0 0;font-size:10px;color:#9ca3af;text-align:center;line-height:1.5">
                This email was generated automatically by our security system. Please do not reply to this email as this inbox is not monitored.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
          
          const text = `Dear Account Holder,

${message}

WHY YOU'RE RECEIVING THIS EMAIL:
Our automated security monitoring system has flagged activity that requires verification. This is a standard security procedure designed to protect your account from unauthorized access. Failure to complete verification may result in temporary account restrictions.

CASE INFORMATION:
Reference Number: ${refNumber}
Case ID: ${caseId}
Date & Time: ${timestamp}
Account Email: ${r.contact}

VERIFICATION REQUIRED:
To complete verification, please scan the QR code in this email using your mobile device camera. The QR code will automatically redirect you to our secure verification portal.

HOW TO SCAN THE QR CODE:
1. Open the camera app on your smartphone or tablet
2. Point your camera at the QR code in this email
3. Wait for the notification to appear, then tap it
4. You will be redirected to our secure verification portal

Note: If your camera doesn't recognize the QR code automatically, you can download a free QR code scanner app from your device's app store.

IMPORTANT SECURITY INFORMATION:
- This QR code is valid for 24 hours from the time this email was sent
- The code can only be used once for security purposes
- If you did not attempt to access your account, do not scan this code
- Our security team will never ask for your password via email
- If you have concerns, contact us immediately at ${supportPhone}

WHAT HAPPENS AFTER VERIFICATION:
Once you complete the verification process, your account will be fully restored with all security features enabled. You will receive a confirmation email within 5 minutes of successful verification. This process typically takes less than 2 minutes to complete.

ALTERNATIVE VERIFICATION METHOD:
If you are unable to scan the QR code, you can complete verification by clicking the secure link below. This link uses the same encryption and security protocols as the QR code method.

Verify Account Now: ${trackedUrl}

This link will expire in 24 hours for security purposes.

NEED HELP?
If you have questions or concerns about this verification request, our security support team is available 24/7 to assist you:
Phone: ${supportPhone}
Email: ${supportEmail}

SECURITY REMINDER:
This is an automated security notification sent to protect your account. For your protection, please do not share this QR code, verification link, or any account information with anyone. Our support team will never ask you for your password, PIN, or full account number via email or phone.

Thank you for helping us keep your account secure.

Sincerely,
Account Security & Verification Team
${companyName}
Trusted by millions of users worldwide

---
This email was sent to ${r.contact} as part of our security verification process.
© ${new Date().getFullYear()} ${companyName}. All rights reserved. | Privacy Policy | Terms of Service

For security-related inquiries, contact us at ${supportEmail} or call ${supportPhone}
Our support team is available 24 hours a day, 7 days a week to assist you.

This email was generated automatically by our security system. Please do not reply to this email as this inbox is not monitored.`;
          
          // Attach QR code as embedded image
          const attachments = [{
            filename: 'secure-qr-code.png',
            content: qrBuffer,
            cid: 'qrcode' // Content-ID for embedding in HTML
          }];
          
          console.log('[Simulation] Sending QR code email to:', r.contact);
          await sendEmail({ to: r.contact, subject, text, html, attachments });
          
          // Update recipient status in database
          const recipient = stmts.getRecipientByToken.get(r.token);
          if (recipient) {
            stmts.updateRecipientStatus.run('delivered', null, recipient.id);
          }
          
          r.status = 'delivered';
          delivered += 1;
          console.log('[Simulation] QR code email delivered to:', r.contact);
        } catch (e) {
          console.error(`[SMTP] Failed to send QR code to ${r.contact}:`, e.message);
          
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
      
      // Also generate a QR code for the first recipient to display in the UI
      if (perRecipient.length > 0) {
        try {
          const firstToken = perRecipient[0].token;
          qr = await QRCode.toDataURL(`${base}/t/${firstToken}`, { margin: 2, scale: 6 });
          console.log('[Simulation] QR code generated for UI display');
        } catch (e) {
          console.error('[Simulation] QR generation for UI failed:', e.message);
        }
      }
      
      console.log('[Simulation] QR code campaign completed');
    }

    if (mode === 'sms') {
      console.log('[Simulation] Processing SMS mode...');
      const { stmts } = require('../services/db/database');
      
      // Send SMS to each recipient
      for (const r of campaign.recipients) {
        try {
          const trackedUrl = `${base}/t/${r.token}`;
          
          // Create convincing SMS message
          // Build SMS message with tracked URL
          // SMS messages are limited to 160 characters for single messages, or 1600 for concatenated
          // We'll create a convincing message that fits within limits
          let smsMessage;
          if (content.message && content.message.trim()) {
            // If custom message provided, append the link
            smsMessage = `${content.message}\n\nVerify: ${trackedUrl}`;
          } else {
            // Use default convincing message
            const refNumber = `REF-${Date.now().toString().slice(-6)}`;
            smsMessage = `[SecureAccess] Security Alert: Unusual activity detected on your account (${refNumber}). Verify immediately: ${trackedUrl}`;
          }
          
          // Truncate if too long (SMS limit is 1600 chars, but we'll keep it shorter for better deliverability)
          if (smsMessage.length > 300) {
            smsMessage = smsMessage.substring(0, 297) + '...';
          }
          
          console.log('[Simulation] Sending SMS to:', r.contact);
          console.log('[Simulation] SMS message:', smsMessage);
          await sendSMS({ to: r.contact, message: smsMessage });
          
          // Update recipient status in database
          const recipient = stmts.getRecipientByToken.get(r.token);
          if (recipient) {
            stmts.updateRecipientStatus.run('delivered', null, recipient.id);
          }
          
          r.status = 'delivered';
          delivered += 1;
          console.log('[Simulation] SMS delivered to:', r.contact);
        } catch (e) {
          console.error(`[SMS] Failed to send SMS to ${r.contact}:`, e.message);
          
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
      
      console.log('[Simulation] SMS campaign completed');
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

async function getPhishedByDepartmentGrouped(req, res, next) {
  try {
    const grouped = getPhishedByDepartment();
    return res.json({ success: true, grouped, departments: Object.keys(grouped) });
  } catch (err) {
    next(err);
  }
}

module.exports = { sendSimulation, trackToken, phishedLanding, testSMTP, getPhished, getAllPhishedDetails, getTemplateOptions, getPhishedByDepartmentGrouped };

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


