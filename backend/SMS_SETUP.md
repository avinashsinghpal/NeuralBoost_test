# SMS Setup Guide - FREE Email-to-SMS Gateways

## 🎉 FREE Method (No API Keys Required!)

The SMS service now uses **Email-to-SMS Gateways** by default - completely FREE and requires no API keys!

### How It Works

Most mobile carriers provide email gateways where you send an email to a special address (like `1234567890@vtext.com`) and it gets delivered as SMS to that phone number.

### Supported Carriers

The system automatically tries multiple US carrier gateways:
- **Verizon**: `number@vtext.com`
- **AT&T**: `number@txt.att.net`
- **T-Mobile**: `number@tmomail.net`
- **Sprint**: `number@messaging.sprintpics.com`
- **Boost Mobile**: `number@sms.myboostmobile.com`
- **Cricket**: `number@sms.cricketwireless.net`

### Setup (Already Done!)

✅ **No setup required!** The system uses your existing email configuration (SMTP settings).

Just make sure your SMTP is configured in `backend/.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Usage

1. Go to Simulation page
2. Select "SMS" mode
3. Enter phone numbers (10 digits for US, e.g., `9876543210`)
4. Enter your SMS message
5. Click "Send Simulation"

The system will:
- Try multiple carrier gateways automatically
- Use the first one that works
- Send SMS via email (completely free!)

### Phone Number Format

- **US Numbers**: Enter 10 digits (e.g., `9876543210`) or with country code (`+19876543210`)
- The system automatically formats for email gateways
- International numbers may work with some carriers

### Limitations

1. **US Carriers Only**: Email gateways primarily work for US carriers
2. **Carrier Detection**: The system tries multiple gateways, but can't detect which carrier a number uses
3. **Message Length**: SMS messages are limited to ~160 characters per message
4. **Delivery**: Not as reliable as paid SMS services, but works for most cases

### Troubleshooting

**SMS not being received?**
- Make sure your SMTP email is working (test email sending first)
- The recipient's carrier might not be in our list
- Some carriers block email-to-SMS or require opt-in

**"Failed to send via all gateways" error?**
- Check your SMTP configuration
- Verify the phone number is correct (10 digits for US)
- Try a different phone number/carrier

### Optional: Twilio (Paid Alternative)

If you want more reliable delivery or international support, you can optionally configure Twilio:

1. Install Twilio: `npm install twilio`
2. Add to `.env`:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxx
   TWILIO_AUTH_TOKEN=xxxxx
   TWILIO_PHONE_NUMBER=+1234567890
   ```
3. The system will use Twilio if configured, otherwise falls back to free email gateways

### Cost Comparison

- **Email-to-SMS Gateways**: **FREE** ✅ (uses your existing email)
- **Twilio**: ~$0.0075 per SMS (US)
- **Other Services**: Varies

### Testing

1. Send a test SMS to your own phone number
2. Check the backend console for which gateway was used
3. Verify the SMS was received

---

**Note**: Email-to-SMS gateways are a free alternative but may have lower deliverability than paid services. For production use with high volume, consider Twilio or similar services.
