# SMS Setup Guide

## Using Twilio (Recommended)

Twilio is the most popular and reliable SMS service provider. Here's how to set it up:

### Step 1: Create a Twilio Account

1. Go to https://www.twilio.com/try-twilio
2. Sign up for a free trial account (includes $15.50 credit)
3. Verify your email and phone number

### Step 2: Get Your Twilio Credentials

1. Log in to your Twilio Console: https://console.twilio.com
2. Go to **Account** → **Account Info**
3. Copy your:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (click "View" to reveal it)

### Step 3: Get a Phone Number

1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. Choose a number (trial accounts can use numbers for free in some regions)
3. Copy the phone number (format: `+1234567890`)

### Step 4: Install Twilio Package

```bash
cd backend
npm install twilio
```

### Step 5: Configure Environment Variables

Add these to your `backend/.env` file:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 6: Test SMS Sending

1. Start your backend server
2. Go to the Simulation page
3. Select "SMS" mode
4. Enter a phone number (your verified number for testing)
5. Enter a message
6. Click "Send Simulation"

## Phone Number Formats

Twilio accepts phone numbers in E.164 format:
- **US Numbers**: `+19876543210` or `9876543210` (will auto-add +1)
- **International**: `+441234567890` (UK), `+919876543210` (India), etc.

## Cost Information

- **Trial Account**: $15.50 free credit
- **US SMS**: ~$0.0075 per message
- **International SMS**: Varies by country (check Twilio pricing)

## Alternative SMS Providers

If you prefer not to use Twilio, you can modify `backend/services/sms/sender.js` to use:

1. **AWS SNS** (Simple Notification Service)
2. **Vonage** (formerly Nexmo)
3. **MessageBird**
4. **Plivo**

## Testing Without Twilio

If Twilio is not configured, the system will simulate SMS sending (logs will show "simulated") but won't actually send messages. This is useful for development and testing the tracking functionality.

## Troubleshooting

### "Invalid phone number"
- Make sure the number includes country code
- US numbers: Use 10 digits or +1 format
- International: Always include country code with +

### "Account not verified"
- Verify your phone number in Twilio Console
- Trial accounts can only send to verified numbers

### "Permission denied"
- Check your Twilio account permissions
- Make sure your account is active (not suspended)

### SMS not sending
- Check backend console for error messages
- Verify all environment variables are set correctly
- Make sure `twilio` package is installed: `npm install twilio`

