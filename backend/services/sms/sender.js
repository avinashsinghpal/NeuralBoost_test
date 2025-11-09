// SMS sending service using Email-to-SMS Gateways (FREE - No API keys needed!)
// Falls back to Twilio if configured (optional)

const { sendEmail } = require('../smtp/mailer');

// Email-to-SMS Gateway mappings for major US carriers
// Format: number@gateway.com
const SMS_GATEWAYS = {
  // Major US Carriers
  'verizon': '@vtext.com',
  'att': '@txt.att.net',
  'tmobile': '@tmomail.net',
  'sprint': '@messaging.sprintpics.com',
  'boost': '@sms.myboostmobile.com',
  'cricket': '@sms.cricketwireless.net',
  'metropcs': '@mymetropcs.com',
  'uscellular': '@email.uscc.net',
  'virgin': '@vmobl.com',
  
  // Canadian Carriers
  'rogers': '@pcs.rogers.com',
  'bell': '@txt.bell.ca',
  'telus': '@msg.telus.com',
  'fido': '@fido.ca',
  
  // UK Carriers
  'vodafone_uk': '@vodafone.net',
  'o2_uk': '@o2.co.uk',
  'ee_uk': '@mms.ee.co.uk',
  'three_uk': '@three.co.uk',
  
  // Australian Carriers
  'telstra_au': '@sms.telstra.com',
  'optus_au': '@optusmobile.com.au',
  'vodafone_au': '@voda.com.au',
  
  // Indian Carriers
  'airtel_in': '@airtelmail.com',
  'vodafone_in': '@voda.co.in',
  'idea_in': '@ideacellular.net',
  'reliance_in': '@rcom.co.in',
};

// Auto-detect carrier from phone number (US only for now)
// Returns the gateway domain or null if unknown
function detectCarrierGateway(phoneNumber) {
  // Remove all non-digits
  const digits = phoneNumber.replace(/\D/g, '');
  
  // For US numbers, we can't reliably detect carrier from number alone
  // So we'll try common carriers or use a default
  // In a real scenario, you might want to use a carrier lookup API or ask the user
  
  // For now, return null to use the default method (try multiple gateways)
  return null;
}

// Get all US carrier gateways (comprehensive list)
function getUSCarrierGateways() {
  return [
    // Major Carriers
    'vtext.com',                    // Verizon
    'txt.att.net',                  // AT&T
    'tmomail.net',                  // T-Mobile
    'messaging.sprintpics.com',     // Sprint
    'sms.myboostmobile.com',        // Boost Mobile
    'sms.cricketwireless.net',      // Cricket Wireless
    'mymetropcs.com',               // MetroPCS
    'email.uscc.net',               // US Cellular
    'vmobl.com',                    // Virgin Mobile
    'text.republicwireless.com',    // Republic Wireless
    'sms.ringplus.net',             // RingPlus
    'tms.suncom.com',               // Suncom
    'message.ting.com',             // Ting
    'text.movistar.com',           // Movistar (some US coverage)
    'sms.straighttalk.com',         // Straight Talk
    'mms.att.net',                  // AT&T MMS (sometimes works for SMS)
    'pm.sprint.com',                // Sprint (alternative)
    'vzwpix.com',                   // Verizon MMS (sometimes works)
  ];
}

// Format phone number for email gateway (10 digits for US)
function formatPhoneForGateway(phoneNumber) {
  const digits = phoneNumber.replace(/\D/g, '');
  
  // If it's a US number (10 digits or 11 starting with 1)
  if (digits.length === 10) {
    return digits;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return digits.substring(1); // Remove country code
  }
  
  // For international numbers, return as-is (may not work with all gateways)
  return digits;
}

// Send SMS via Email-to-SMS Gateway (FREE method)
// Strategy: Send to ALL gateways simultaneously to maximize delivery chances
async function sendSMSViaEmailGateway({ to, message }) {
  const phoneDigits = formatPhoneForGateway(to);
  
  if (phoneDigits.length < 10) {
    throw new Error(`Invalid phone number: ${to}. Need at least 10 digits.`);
  }
  
  // Get all carrier gateways
  const gateways = getUSCarrierGateways();
  const results = [];
  const errors = [];
  
  console.log(`[SMS] 📱 Sending to ALL ${gateways.length} carrier gateways simultaneously to maximize delivery chances...`);
  console.log(`[SMS] Phone number: ${phoneDigits}`);
  
  // Send to ALL gateways in parallel (don't stop at first success)
  const sendPromises = gateways.map(async (gateway) => {
    const emailAddress = `${phoneDigits}@${gateway}`;
    
    try {
      // Send email to SMS gateway
      await sendEmail({
        to: emailAddress,
        subject: '', // SMS gateways ignore subject
        text: message
      });
      
      console.log(`[SMS] ✅ Email sent to ${gateway} (${emailAddress})`);
      results.push({ gateway, emailAddress });
      return { gateway, success: true };
    } catch (error) {
      const errorMsg = error.message || String(error);
      // Only log real errors (not "address not found" which is expected for wrong carriers)
      if (!errorMsg.includes('address not found') && 
          !errorMsg.includes('550 5.1.1') && 
          !errorMsg.includes('550 5.4.1') &&
          !errorMsg.includes('553')) {
        console.warn(`[SMS] ⚠️ ${gateway}: ${errorMsg}`);
      }
      errors.push({ gateway, error: errorMsg });
      return { gateway, success: false };
    }
  });
  
  // Wait for all attempts to complete
  await Promise.allSettled(sendPromises);
  
  const successful = results.length;
  const failed = errors.length;
  
  console.log(`[SMS] 📊 Results: ${successful} gateways accepted, ${failed} rejected`);
  
  if (successful > 0) {
    console.log(`[SMS] ✅ Successfully sent to: ${results.map(r => r.gateway).join(', ')}`);
    console.log(`[SMS] 💡 If SMS doesn't arrive, verify the phone number is on one of these carriers.`);
    
    const primaryGateway = results[0].gateway;
    return {
      sid: `email-${primaryGateway}-${Date.now()}`,
      status: 'sent',
      to: phoneDigits,
      gateway: primaryGateway,
      gatewaysAttempted: successful,
      allGateways: results.map(r => r.gateway),
      method: 'email-gateway'
    };
  }
  
  // All gateways rejected
  console.error(`[SMS] ❌ All ${gateways.length} gateways rejected the email`);
  const sampleErrors = errors.slice(0, 3).map(e => e.gateway).join(', ');
  throw new Error(
    `All carrier gateways rejected. Possible reasons:\n` +
    `1. Phone number format incorrect\n` +
    `2. All carriers have disabled email-to-SMS\n` +
    `3. SMTP server blocking gateway addresses\n\n` +
    `Rejected by: ${sampleErrors}${errors.length > 3 ? ' and more...' : ''}`
  );
}

// Twilio method (optional, requires API keys)
let twilioClient = null;

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  
  if (!accountSid || !authToken || !fromNumber) {
    return null;
  }
  
  if (!twilioClient) {
    try {
      const twilio = require('twilio');
      twilioClient = twilio(accountSid, authToken);
      console.log('[SMS] Twilio client initialized');
    } catch (err) {
      console.warn('[SMS] Twilio package not installed. Using email gateways only.');
      return null;
    }
  }
  
  return twilioClient;
}

async function sendSMSViaTwilio({ to, message, from }) {
  const client = getTwilioClient();
  
  if (!client) {
    return null; // Not configured, will fall back to email gateway
  }
  
  const fromNumber = from || process.env.TWILIO_PHONE_NUMBER;
  const cleanTo = to.replace(/\D/g, '');
  
  if (cleanTo.length < 10) {
    throw new Error(`Invalid phone number: ${to}`);
  }
  
  let formattedTo = cleanTo;
  if (formattedTo.length === 10) {
    formattedTo = `+1${formattedTo}`;
  } else if (!formattedTo.startsWith('+')) {
    formattedTo = `+${formattedTo}`;
  }
  
  try {
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedTo
    });
    
    console.log('[SMS] SMS sent via Twilio, SID:', result.sid);
    return {
      sid: result.sid,
      status: result.status,
      to: formattedTo,
      method: 'twilio'
    };
  } catch (error) {
    console.error('[SMS] Twilio error:', error.message);
    throw error;
  }
}

// Main sendSMS function - tries Twilio first (if configured), then email gateways
async function sendSMS({ to, message, from, preferGateway = false }) {
  // If preferGateway is true or Twilio is not configured, use email gateway
  const useGateway = preferGateway || !process.env.TWILIO_ACCOUNT_SID;
  
  if (useGateway) {
    // Use free email-to-SMS gateway
    console.log('[SMS] Using FREE email-to-SMS gateway method');
    return await sendSMSViaEmailGateway({ to, message });
  } else {
    // Try Twilio first, fall back to email gateway if it fails
    try {
      const result = await sendSMSViaTwilio({ to, message, from });
      if (result) {
        return result;
      }
    } catch (twilioError) {
      console.warn('[SMS] Twilio failed, falling back to email gateway:', twilioError.message);
    }
    
    // Fall back to email gateway
    console.log('[SMS] Falling back to FREE email-to-SMS gateway method');
    return await sendSMSViaEmailGateway({ to, message });
  }
}

module.exports = { sendSMS, SMS_GATEWAYS };
