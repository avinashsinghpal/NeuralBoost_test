// Hardcoded fake email data for simulation - Security Alert phishing email
const fakeMail = {
    sender: "lavi26052005@gmail.com",
    to: "gauravmishraokok@gmail.com",
    domain: "gmail.com",
    subject: "Security Alert: Multiple Failed Login Attempts",
    time: "2025-11-07T01:21:00+05:30",
    mailedBy: "gmail.com",
    signedBy: "gmail.com",
    security: "Standard encryption (TLS)",
    importance: "Important according to Google magic",
    content: `⚠️ Account Security Alert

Hello,

We've detected multiple failed login attempts on your account from different IP addresses (3 attempts from Magestic, 2 from Kengeri, 1 from Jalahalli) within the past hour. Our automated security system has identified this as potentially suspicious activity.

To protect your information and prevent unauthorized access, we've temporarily locked your account. This is a standard security measure to ensure your data remains safe.

To unlock your account, please verify your identity by clicking the link below. The verification process will take approximately 2-3 minutes and requires you to confirm your account details. Once verified, you'll regain immediate access to all your services.

If you did not attempt to log in from these locations, please contact our support team immediately.

We've detected multiple failed login attempts on your account. To protect your information, we've temporarily locked your account.

To unlock your account, please verify your identity:

Unlock Account

If this wasn't you, please secure your account immediately by clicking the link above.

Best regards,

Security Team`,
    urls: ["https://example.com/unlock-account"], // Extracted from "Unlock Account" link
    attachments: []
};

// DOM elements
const extractBtn = document.getElementById('extractBtn');
const sendBtn = document.getElementById('sendBtn');
const statusDiv = document.getElementById('status');
const fieldsDiv = document.getElementById('fields');

/**
 * Updates the status message with optional styling
 */
function setStatus(message, type = '') {
    statusDiv.textContent = message;
    statusDiv.className = type;
}

/**
 * Formats field values for display
 */
function formatFieldValue(key, value) {
    if (key === 'attachments' && Array.isArray(value)) {
        if (value.length === 0) return 'No attachments';
        return value.map(att => `${att.name} (${att.size} bytes)`).join(', ');
    }
    if (key === 'urls' && Array.isArray(value)) {
        if (value.length === 0) return 'No URLs';
        return value.join(', ');
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
        return JSON.stringify(value, null, 2);
    }
    // Truncate long content for display
    const str = String(value);
    if (str.length > 200) {
        return str.substring(0, 200) + '...';
    }
    return str;
}

/**
 * Creates a checkbox field item in the UI
 */
function createFieldItem(key, value) {
    const fieldItem = document.createElement('div');
    fieldItem.className = 'field-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `field-${key}`;
    checkbox.checked = true; // Default checked
    checkbox.dataset.key = key;
    
    const fieldContent = document.createElement('div');
    fieldContent.className = 'field-content';
    
    const label = document.createElement('div');
    label.className = 'field-label';
    label.textContent = key.charAt(0).toUpperCase() + key.slice(1);
    
    const valueDiv = document.createElement('div');
    valueDiv.className = 'field-value';
    valueDiv.textContent = formatFieldValue(key, value);
    
    fieldContent.appendChild(label);
    fieldContent.appendChild(valueDiv);
    
    fieldItem.appendChild(checkbox);
    fieldItem.appendChild(fieldContent);
    
    return fieldItem;
}

/**
 * Handles the Extract Email button click
 */
async function handleExtract() {
    try {
        // Disable extract button and show loading
        extractBtn.disabled = true;
        setStatus('Extracting...', 'loading');
        
        // Simulate 1 second loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Clear previous fields
        fieldsDiv.innerHTML = '';
        
        // Create checkbox items for each field in fakeMail
        Object.entries(fakeMail).forEach(([key, value]) => {
            const fieldItem = createFieldItem(key, value);
            fieldsDiv.appendChild(fieldItem);
        });
        
        // Show fields and send button
        fieldsDiv.classList.add('visible');
        sendBtn.style.display = 'block';
        
        setStatus('Email extracted successfully!', 'success');
        extractBtn.disabled = false;
        
    } catch (error) {
        console.error('Extraction error:', error);
        setStatus('Error during extraction', 'error');
        extractBtn.disabled = false;
    }
}

/**
 * Collects only the checked fields from the UI
 */
function getSelectedFields() {
    const selected = {};
    const checkboxes = fieldsDiv.querySelectorAll('input[type="checkbox"]:checked');
    
    checkboxes.forEach(checkbox => {
        const key = checkbox.dataset.key;
        if (key && fakeMail.hasOwnProperty(key)) {
            selected[key] = fakeMail[key];
        }
    });
    
    return selected;
}

/**
 * Handles the Send button click
 */
async function handleSend() {
    try {
        // Disable send button and show loading
        sendBtn.disabled = true;
        setStatus('Redirecting...', 'loading');
        
        // Collect only checked fields
        const selectedFields = getSelectedFields();
        
        if (Object.keys(selectedFields).length === 0) {
            setStatus('Please select at least one field', 'error');
            sendBtn.disabled = false;
            return;
        }
        
        // URL encode the selected fields for the extracted analysis page
        const encodedData = encodeURIComponent(JSON.stringify(selectedFields));
        
        // Redirect to the extracted analysis page (clone of Analyze page)
        // This page will auto-fill the form and show hardcoded results
        const analyzeUrl = `http://localhost:5173/analyze-extracted?data=${encodedData}`;
        chrome.tabs.create({ url: analyzeUrl });
        
        setStatus('Redirecting to analysis page...', 'success');
        
        sendBtn.disabled = false;
        
    } catch (error) {
        console.error('Send error:', error);
        setStatus(`Error: ${error.message}`, 'error');
        sendBtn.disabled = false;
    }
}

// Event listeners
extractBtn.addEventListener('click', handleExtract);
sendBtn.addEventListener('click', handleSend);

