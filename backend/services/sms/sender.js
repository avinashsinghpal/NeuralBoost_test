// SMS sending service using Twilio
// Alternative: Can use AWS SNS, Vonage, or other SMS providers

let twilioClient = null;

function getTwilioClient() {
  // Check if Twilio is configured
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  
  if (!accountSid || !authToken || !fromNumber) {
    return null;
  }
  
  // Lazy load Twilio to avoid errors if not installed
  if (!twilioClient) {
    try {
      const twilio = require('twilio');
      twilioClient = twilio(accountSid, authToken);
      console.log('[SMS] Twilio client initialized');
    } catch (err) {
      console.warn('[SMS] Twilio package not installed. Run: npm install twilio');
      return null;
    }
  }
  
  return twilioClient;
}

async function sendSMS({ to, message, from }) {
  const client = getTwilioClient();
  
  if (!client) {
    console.warn('[SMS] SMS not configured. Skipping SMS send. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env');
    console.warn('[SMS] For testing, you can use Twilio trial account: https://www.twilio.com/try-twilio');
    return { 
      sid: 'simulated', 
      status: 'queued',
      to,
      message: 'SMS sending simulated (Twilio not configured)'
    };
  }
  
  const fromNumber = from || process.env.TWILIO_PHONE_NUMBER;
  
  // Validate phone number format (basic check)
  const cleanTo = to.replace(/\D/g, ''); // Remove non-digits
  if (cleanTo.length < 10) {
    throw new Error(`Invalid phone number: ${to}`);
  }
  
  // Format phone number (add + if not present, assume US if 10 digits)
  let formattedTo = cleanTo;
  if (formattedTo.length === 10) {
    formattedTo = `+1${formattedTo}`; // Assume US number
  } else if (!formattedTo.startsWith('+')) {
    formattedTo = `+${formattedTo}`;
  }
  
  try {
    console.log('[SMS] Sending SMS to:', formattedTo);
    console.log('[SMS] Message length:', message.length, 'characters');
    
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedTo
    });
    
    console.log('[SMS] SMS sent successfully, SID:', result.sid);
    return {
      sid: result.sid,
      status: result.status,
      to: formattedTo,
      message: result.body
    };
  } catch (error) {
    console.error('[SMS] Error sending SMS:', error.message);
    if (error.code === 21211) {
      throw new Error(`Invalid phone number: ${to}. Please use E.164 format (e.g., +1234567890)`);
    }
    if (error.code === 21608) {
      throw new Error('Twilio account not verified. Verify your phone number in Twilio console.');
    }
    if (error.code === 21408) {
      throw new Error('Permission denied. Check your Twilio account permissions.');
    }
    throw new Error(`SMS Error: ${error.message}`);
  }
}

module.exports = { sendSMS };

