# SMS Troubleshooting Guide

## Common Issues with Email-to-SMS Gateways

### "Address not found" or "Invalid address" Error

This error occurs when:
1. **Carrier has disabled email-to-SMS**: Many carriers (Verizon, AT&T, T-Mobile) have disabled or restricted email-to-SMS gateways
2. **Phone number format is wrong**: The number must be exactly 10 digits for US numbers
3. **SMTP server rejects the address**: Some email providers block email-to-SMS gateway addresses

### Solutions

#### Option 1: Use Twilio (Recommended for Reliability)
Email-to-SMS gateways are **very unreliable** in 2024. Most carriers have disabled them.

**Setup Twilio (Free Trial Available):**
1. Sign up at https://www.twilio.com/try-twilio (free $15.50 credit)
2. Get Account SID and Auth Token
3. Get a phone number
4. Add to `.env`:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxx
   TWILIO_AUTH_TOKEN=xxxxx
   TWILIO_PHONE_NUMBER=+1234567890
   ```
5. Install: `npm install twilio`

#### Option 2: Check Phone Number Format
- US numbers: Use 10 digits (e.g., `9876543210`) or with country code (`+19876543210`)
- Make sure there are no spaces or special characters
- International numbers may not work with email gateways

#### Option 3: Test with Different Carriers
The system tries multiple carriers automatically, but if all fail, the recipient's carrier may not support email-to-SMS.

#### Option 4: Use Alternative Free SMS Services
- **TextLocal** (free tier available)
- **MessageBird** (free tier)
- **Vonage** (formerly Nexmo, free tier)

### Why Email-to-SMS Gateways Fail

1. **Carrier Restrictions**: Most major US carriers have disabled or heavily restricted email-to-SMS
2. **Spam Prevention**: Carriers block these to prevent spam
3. **SMTP Rejection**: Some email providers reject email-to-SMS addresses as invalid
4. **Format Changes**: Gateway formats may have changed

### Testing SMS

1. **Test with your own phone number first**
2. **Check backend console** for detailed error messages
3. **Try different phone numbers** (different carriers)
4. **Verify SMTP is working** (test regular email first)

### Recommended Approach

For production or reliable SMS delivery, **use Twilio or a similar paid service**. Email-to-SMS gateways are:
- ❌ Unreliable
- ❌ Often blocked
- ❌ Not supported by many carriers
- ✅ Free (when they work)

### Error Messages Explained

- **"Address not found"**: The email-to-SMS gateway address is invalid or the carrier has disabled it
- **"550 5.1.1"**: SMTP rejection - address doesn't exist
- **"553"**: SMTP rejection - invalid recipient
- **"All gateways failed"**: None of the carrier gateways worked

### Next Steps

1. If you need reliable SMS: Set up Twilio (free trial available)
2. If you want to keep trying email gateways: Test with different phone numbers and carriers
3. For testing only: The tracking links still work - you can share them directly via other methods

