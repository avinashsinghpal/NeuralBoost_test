/**
 * Simple Express server for testing the MailAuth Demo extension
 * 
 * Usage:
 *   npm install express
 *   node server.js
 * 
 * Server runs on http://localhost:5000
 */

const express = require('express');
const app = express();
const PORT = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// CORS middleware (allow extension to make requests)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

/**
 * POST /analyze
 * Receives selected email fields and logs them
 */
app.post('/analyze', (req, res) => {
    console.log('\n=== POST /analyze ===');
    console.log('Received data:', JSON.stringify(req.body, null, 2));
    console.log('Timestamp:', new Date().toISOString());
    console.log('===================\n');
    
    // Respond with success
    res.json({
        status: 'ok',
        message: 'Data received successfully',
        receivedFields: Object.keys(req.body)
    });
});

/**
 * GET /prefill?data=<URL_ENCODED_JSON>
 * Displays the received data on a simple HTML page
 */
app.get('/prefill', (req, res) => {
    const encodedData = req.query.data;
    
    console.log('\n=== GET /prefill ===');
    console.log('Encoded data:', encodedData);
    
    let decodedData = null;
    let parseError = null;
    
    try {
        if (encodedData) {
            decodedData = JSON.parse(decodeURIComponent(encodedData));
            console.log('Decoded data:', JSON.stringify(decodedData, null, 2));
        } else {
            parseError = 'No data parameter provided';
        }
    } catch (error) {
        parseError = error.message;
        console.error('Parse error:', error.message);
    }
    
    console.log('===================\n');
    
    // Generate HTML response
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MailAuth Demo - Prefill</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 24px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        .data-section {
            background: #f5f5f5;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        .data-section h2 {
            color: #333;
            font-size: 18px;
            margin-bottom: 15px;
        }
        pre {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            font-size: 13px;
            line-height: 1.5;
        }
        .error {
            color: #c62828;
            background: #ffebee;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #c62828;
        }
        .success-badge {
            display: inline-block;
            background: #34a853;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success-badge">✓ Data Received</div>
        <h1>MailAuth Demo - Prefill Page</h1>
        <p class="subtitle">This page simulates the prefill endpoint receiving data from the extension.</p>
        
        <div class="data-section">
            <h2>Received Data:</h2>
            ${parseError 
                ? `<div class="error"><strong>Error:</strong> ${parseError}</div>` 
                : decodedData 
                    ? `<pre>${JSON.stringify(decodedData, null, 2)}</pre>` 
                    : '<div class="error">No data received</div>'
            }
        </div>
    </div>
</body>
</html>
    `;
    
    res.send(html);
});

/**
 * Root endpoint - simple info page
 */
app.get('/', (req, res) => {
    res.json({
        message: 'MailAuth Demo Server',
        endpoints: {
            'POST /analyze': 'Receives selected email fields',
            'GET /prefill?data=<JSON>': 'Displays received data'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 MailAuth Demo Server running on http://localhost:${PORT}`);
    console.log(`\nEndpoints:`);
    console.log(`  POST http://localhost:${PORT}/analyze`);
    console.log(`  GET  http://localhost:${PORT}/prefill?data=<JSON>\n`);
});

