// Quick test script for SMS sending
// Run with: node test-sms.js

require('dotenv').config();
const { sendSMS } = require('./services/sms/sender');

async function testSMS() {
  const phoneNumber = process.argv[2] || '9876543210'; // Default test number
  const message = process.argv[3] || 'Test SMS from TRACE system';
  
  console.log('='.repeat(50));
  console.log('Testing SMS Sending');
  console.log('='.repeat(50));
  console.log('Phone Number:', phoneNumber);
  console.log('Message:', message);
  console.log('Message Length:', message.length, 'characters');
  console.log('');
  
  try {
    console.log('Attempting to send SMS...');
    const result = await sendSMS({ 
      to: phoneNumber, 
      message: message 
    });
    
    console.log('');
    console.log('✅ SUCCESS!');
    console.log('Result:', JSON.stringify(result, null, 2));
    console.log('');
    console.log('If you received the SMS, the system is working!');
    console.log('If not, check:');
    console.log('1. Phone number format (should be 10 digits for US)');
    console.log('2. Carrier may not support email-to-SMS');
    console.log('3. SMTP configuration in .env');
    console.log('4. Consider using Twilio for reliable delivery');
    
  } catch (error) {
    console.log('');
    console.log('❌ ERROR:');
    console.log('Error Message:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Check SMTP configuration in .env');
    console.log('2. Verify phone number format');
    console.log('3. Email-to-SMS gateways are unreliable - many carriers have disabled them');
    console.log('4. For reliable SMS, use Twilio (see SMS_SETUP.md)');
    console.log('');
    console.log('Full error:', error);
  }
  
  console.log('='.repeat(50));
}

testSMS().catch(console.error);

