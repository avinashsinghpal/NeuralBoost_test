# Network Access Guide

## Making the Server Accessible from Other Devices

The backend server is now configured to listen on all network interfaces (`0.0.0.0`), which allows access from other devices on your network.

### Step 1: Find Your Server's IP Address

Run this command to find your local IP address:

```bash
node get-ip.js
```

Or manually find it:
- **Windows**: Open Command Prompt and run `ipconfig`, look for "IPv4 Address"
- **Mac/Linux**: Open Terminal and run `ifconfig` or `ip addr`, look for your network interface

### Step 2: Access from Other Devices

1. **On the same WiFi network**: Use `http://<your-ip>:5001`
   - Example: `http://192.168.1.100:5001`

2. **From different networks**: You'll need to:
   - Set up port forwarding on your router (port 5001)
   - Or use a tunneling service like ngrok, localtunnel, or Cloudflare Tunnel

### Step 3: Configure Public URL (Optional)

If you want the phishing links to always use a specific URL (useful for sharing), add this to your `.env` file:

```env
TRACE_PUBLIC_URL=http://your-ip-address:5001
```

Or if using a tunnel:
```env
TRACE_PUBLIC_URL=https://your-ngrok-url.ngrok-free.app
```

### Step 4: Firewall Configuration

Make sure your firewall allows incoming connections on port 5001:

- **Windows**: 
  - Open Windows Defender Firewall
  - Add an inbound rule for port 5001 (TCP)

- **Mac**: 
  - System Preferences → Security & Privacy → Firewall
  - Add an exception for Node.js or port 5001

- **Linux**: 
  ```bash
  sudo ufw allow 5001/tcp
  ```

### Testing

1. Start the backend server: `npm run dev` or `npm start`
2. From another device on the same network, open: `http://<your-ip>:5001/api/health`
3. You should see: `{"status":"ok","service":"TRACE backend","ts":...}`

### Troubleshooting

- **"Connection refused"**: Check firewall settings and ensure server is running
- **"Cannot reach server"**: Make sure both devices are on the same network
- **"CORS error"**: The server already has CORS enabled for all origins (`*`)

### Security Note

⚠️ **Important**: This setup is for local network testing only. For production use:
- Use HTTPS
- Set up proper authentication
- Use environment variables for sensitive configuration
- Consider using a reverse proxy (nginx, Caddy)

