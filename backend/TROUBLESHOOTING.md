# Troubleshooting Guide

## Issue: Email Links Not Working from Different Devices

### Problem
When sending phishing simulation emails, the links in the emails use `localhost:5001` instead of the network IP, so they don't work when clicked from other devices.

### Solution
The system now automatically detects your network IP address and uses it when generating email links. However, for best results, set the `TRACE_PUBLIC_URL` in your `.env` file:

```env
TRACE_PUBLIC_URL=http://192.168.43.216:5001
```

Replace `192.168.43.216` with your actual network IP (run `node get-ip.js` to find it).

### How It Works
1. **Priority 1**: If `TRACE_PUBLIC_URL` is set in `.env`, it uses that
2. **Priority 2**: If the request comes from `localhost` but a network IP is detected, it automatically uses the network IP
3. **Priority 3**: Otherwise, it uses the request's host header

## Issue: Unknown Token Clicks

### Problem
When clicking a link with an invalid token (like `/t/<any-token>`), the details are not stored in the database.

### Explanation
This is **expected behavior**. Unknown tokens don't have a corresponding recipient record in the database, so there's nothing to link the click data to. However:
- ✅ The "You have been phished" landing page still shows
- ✅ The click attempt is logged in the console for security monitoring
- ✅ Device info is still captured and logged

### Valid Tokens
Only tokens generated from actual simulation campaigns are stored in the database. To test:
1. Create a simulation campaign from the frontend
2. Use the actual token from the campaign response
3. Click the link - it will be stored in the database

## Issue: Database Not Storing Click Details

### Check These:
1. **Is the token valid?** - Check the backend logs for "Found recipient: NOT FOUND"
2. **Is the database accessible?** - Check for database errors in the console
3. **Is the server running?** - Ensure the backend is running on port 5001
4. **Check the logs** - Look for `[markRecipientClicked]` logs in the console

### Debug Steps:
1. Check backend console for detailed logs when a link is clicked
2. Verify the token exists: Look for `[trackToken] Found recipient:` in logs
3. Check database: The click should appear in the "Phished Recipients" table on the frontend

## Network Access

### Finding Your IP
```bash
cd backend
node get-ip.js
```

### Testing from Another Device
1. Make sure both devices are on the same WiFi network
2. From the other device, open: `http://<your-ip>:5001/api/health`
3. You should see: `{"status":"ok","service":"TRACE backend",...}`

### Firewall
Make sure Windows Firewall allows port 5001:
- Windows Defender Firewall → Advanced Settings → Inbound Rules
- Add a new rule for port 5001 (TCP)

## Common Errors

### "Connection Refused"
- Server is not running
- Firewall is blocking port 5001
- Wrong IP address

### "Failed to fetch" (Frontend)
- Backend server is not running
- CORS issue (shouldn't happen, CORS is enabled for all origins)
- Wrong backend URL in frontend config

### "Unknown token clicked"
- This is normal for invalid tokens
- Use a valid token from an actual campaign
- The landing page still shows, but data isn't stored

