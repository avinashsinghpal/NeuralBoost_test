# MailAuth Demo - Chrome Extension

A proof-of-concept Chrome Extension (Manifest V3) that simulates email extraction and data transmission.

## Project Structure

```
mail-auth-extension/
├── manifest.json      # Extension manifest
├── popup.html         # Extension popup UI
├── popup.js           # Extension logic
├── server.js          # Optional Express server for testing
└── icons/             # Extension icons (optional)
```

## Setup Instructions

### 1. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `mail-auth-extension` folder
5. The extension should now appear in your extensions list

### 2. Run Local Server (Optional)

If you want to test the full flow with the server:

```bash
# Install Express (if not already installed)
npm install express

# Run the server
node server.js
```

The server will start on `http://localhost:5000`

### 3. Test the Extension

1. Navigate to Gmail (or any page)
2. Click the extension icon in the Chrome toolbar
3. Click "Extract Email" button
4. Wait 1 second for fake extraction
5. Uncheck any fields you don't want to send
6. Click "Send"
7. A new tab will open showing the received data

## Features

- ✅ Simulated email extraction (hardcoded data)
- ✅ Field selection with checkboxes
- ✅ POST to `/analyze` endpoint
- ✅ Redirect to `/prefill` with URL-encoded JSON
- ✅ Clean, minimal UI
- ✅ Error handling

## Hardcoded Data

The extension uses the following simulated email data:

```javascript
{
    sender: "alice@example.com",
    domain: "example.com",
    subject: "Invoice #1234",
    time: "2025-11-06T10:23:00+05:30",
    content: "Hello — please find invoice attached.",
    attachments: [{ name: "invoice.pdf", size: 23456 }]
}
```

## API Endpoints

### POST /analyze
Receives selected email fields and logs them.

**Request:**
```json
{
    "sender": "alice@example.com",
    "subject": "Invoice #1234"
}
```

**Response:**
```json
{
    "status": "ok",
    "message": "Data received successfully",
    "receivedFields": ["sender", "subject"]
}
```

### GET /prefill?data=<URL_ENCODED_JSON>
Displays the received data on an HTML page.

**Example:**
```
http://localhost:5000/prefill?data=%7B%22sender%22%3A%22alice%40example.com%22%7D
```

## Notes

- This is a proof-of-concept demo
- No real Gmail DOM parsing is implemented
- All data is hardcoded for simulation purposes
- The extension requires `activeTab` permission and `http://localhost/*` host permission

