const nodemailer = require('nodemailer');

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
}

function withTimeout(promise, timeoutMs, errorMsg) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(errorMsg || 'Operation timed out')), timeoutMs)
    )
  ]);
}

async function sendEmail({ to, subject, html, text, from, attachments }) {
  const transport = getTransport();
  if (!transport) {
    console.warn('[SMTP] SMTP not configured. Skipping email send. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env');
    return { messageId: 'simulated', accepted: [to] };
  }
  const sender = from || process.env.SMTP_FROM || process.env.SMTP_USER;
  try {
    // Verify connection first with timeout
    console.log('[SMTP] Verifying connection...');
    await withTimeout(transport.verify(), 10000, 'SMTP verification timed out after 10 seconds');
    console.log('[SMTP] Connection verified, sending email...');
    const mailOptions = { from: sender, to, subject, html, text };
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments;
    }
    const info = await withTimeout(
      transport.sendMail(mailOptions),
      30000,
      'SMTP send timed out after 30 seconds'
    );
    console.log('[SMTP] Email sent successfully');
    return info;
  } catch (error) {
    console.error('[SMTP] Error sending email:', error.message);
    if (error.code === 'EAUTH') {
      throw new Error('SMTP Authentication failed. Check SMTP_USER and SMTP_PASS. For Gmail, use an App Password.');
    }
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED' || error.message.includes('timed out')) {
      throw new Error(`SMTP Connection failed or timed out. Check SMTP_HOST (${process.env.SMTP_HOST}) and SMTP_PORT (${process.env.SMTP_PORT}).`);
    }
    throw new Error(`SMTP Error: ${error.message}`);
  }
}

module.exports = { sendEmail };


