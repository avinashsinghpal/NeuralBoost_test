// Enhanced phishing types data with all required fields
export const CHANNEL_COLORS = {
  email: '#6366f1',   // indigo
  sms: '#14b8a6',     // teal
  voice: '#f97316',   // orange
  social: '#8b5cf6',  // violet
  web: '#3b82f6'      // blue
};

export const SEVERITY_LEVELS = {
  low: { label: 'Low', color: '#10b981', bgColor: '#d1fae5' },
  medium: { label: 'Medium', color: '#f59e0b', bgColor: '#fef3c7' },
  high: { label: 'High', color: '#ef4444', bgColor: '#fee2e2' }
};

// Generate 12 months of trend data
const generateTrendData = (baseValue, variance = 5) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => ({
    month,
    value: baseValue + Math.floor(Math.random() * variance * 2) - variance + (i * 2),
    date: new Date(2024, i, 1).toISOString()
  }));
};

// Generate monthly data by channel
const generateMonthlyByChannel = (emailPct, smsPct, voicePct, socialPct, webPct) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => ({
    month,
    email: Math.floor(emailPct * (80 + Math.random() * 40)),
    sms: Math.floor(smsPct * (80 + Math.random() * 40)),
    voice: Math.floor(voicePct * (80 + Math.random() * 40)),
    social: Math.floor(socialPct * (80 + Math.random() * 40)),
    web: Math.floor(webPct * (80 + Math.random() * 40))
  }));
};

export const PHISHING_TYPES = [
  {
    id: 'email-phishing',
    name: 'Email Phishing',
    channel: 'email',
    severity: 'high',
    definition: 'Mass emails sent to thousands of recipients, hoping some will click malicious links or attachments.',
    redFlags: [
      'Generic greetings like "Dear Customer" instead of your name',
      'Urgent language demanding immediate action',
      'Suspicious sender addresses or misspelled domains'
    ],
    mitigations: [
      'Enable MFA on all accounts',
      'Verify domain authenticity before clicking',
      'Hover over links to see real destination',
      'Report suspicious emails to IT security'
    ],
    sparkData: generateTrendData(50, 8),
    analytics: {
      monthlyByChannel: generateMonthlyByChannel(0.85, 0.08, 0.04, 0.02, 0.01),
      industryPie: [
        { name: 'Finance', value: 42, fill: '#6366f1' },
        { name: 'Healthcare', value: 23, fill: '#14b8a6' },
        { name: 'Retail', value: 18, fill: '#f97316' },
        { name: 'Government', value: 12, fill: '#8b5cf6' },
        { name: 'Education', value: 5, fill: '#3b82f6' }
      ],
      luresBar: [
        { name: 'Account Verification', value: 34, fill: '#6366f1' },
        { name: 'Payment Request', value: 28, fill: '#14b8a6' },
        { name: 'Prize Winner', value: 19, fill: '#f97316' },
        { name: 'Urgent Action', value: 12, fill: '#8b5cf6' },
        { name: 'Invoice', value: 7, fill: '#3b82f6' }
      ],
      trendData: generateTrendData(50, 8)
    }
  },
  {
    id: 'spear-phishing',
    name: 'Spear Phishing',
    channel: 'email',
    severity: 'high',
    definition: 'Targeted attacks on specific individuals or organizations using personalized information.',
    redFlags: [
      'Personalized information that seems too specific',
      'Sender claims to be from your organization but uses external email',
      'Requests for confidential information'
    ],
    mitigations: [
      'Verify identity through separate communication channel',
      'Be suspicious of requests for sensitive data',
      'Use multi-factor authentication',
      'Report suspicious emails to IT security'
    ],
    sparkData: generateTrendData(15, 5),
    analytics: {
      monthlyByChannel: generateMonthlyByChannel(0.89, 0.07, 0.03, 0.01, 0),
      industryPie: [
        { name: 'Finance', value: 35, fill: '#6366f1' },
        { name: 'Technology', value: 28, fill: '#14b8a6' },
        { name: 'Healthcare', value: 18, fill: '#f97316' },
        { name: 'Legal', value: 12, fill: '#8b5cf6' },
        { name: 'Other', value: 7, fill: '#3b82f6' }
      ],
      luresBar: [
        { name: 'CEO Impersonation', value: 38, fill: '#6366f1' },
        { name: 'Invoice Fraud', value: 24, fill: '#14b8a6' },
        { name: 'W-2 Request', value: 18, fill: '#f97316' },
        { name: 'Wire Transfer', value: 12, fill: '#8b5cf6' },
        { name: 'Credentials', value: 8, fill: '#3b82f6' }
      ],
      trendData: generateTrendData(15, 5)
    }
  },
  {
    id: 'whaling',
    name: 'Whaling',
    channel: 'email',
    severity: 'high',
    definition: 'Targeted attacks on high-profile executives and senior management.',
    redFlags: [
      'Emails from executives with unusual requests',
      'Requests for wire transfers or financial transactions',
      'Urgent requests bypassing normal procedures'
    ],
    mitigations: [
      'Implement approval workflows for financial transactions',
      'Verify executive requests through phone calls',
      'Use digital signatures for sensitive requests',
      'Train executives on whaling tactics'
    ],
    sparkData: generateTrendData(10, 4),
    analytics: {
      monthlyByChannel: generateMonthlyByChannel(0.94, 0.01, 0.04, 0.01, 0),
      industryPie: [
        { name: 'Finance', value: 45, fill: '#6366f1' },
        { name: 'Technology', value: 22, fill: '#14b8a6' },
        { name: 'Healthcare', value: 15, fill: '#f97316' },
        { name: 'Manufacturing', value: 12, fill: '#8b5cf6' },
        { name: 'Other', value: 6, fill: '#3b82f6' }
      ],
      luresBar: [
        { name: 'Wire Transfer', value: 42, fill: '#6366f1' },
        { name: 'Confidential Data', value: 28, fill: '#14b8a6' },
        { name: 'Legal Matter', value: 15, fill: '#f97316' },
        { name: 'Merger/Acquisition', value: 10, fill: '#8b5cf6' },
        { name: 'Tax Documents', value: 5, fill: '#3b82f6' }
      ],
      trendData: generateTrendData(10, 4)
    }
  },
  {
    id: 'smishing',
    name: 'Smishing',
    channel: 'sms',
    severity: 'medium',
    definition: 'Phishing attacks delivered via SMS text messages with malicious links.',
    redFlags: [
      'Unexpected text messages from unknown numbers',
      'Urgent requests to click links or verify accounts',
      'Messages claiming to be from banks or services you don\'t use'
    ],
    mitigations: [
      'Never click links in unsolicited text messages',
      'Verify messages by contacting the organization directly',
      'Be suspicious of urgent requests via SMS',
      'Report smishing attempts to your carrier'
    ],
    sparkData: generateTrendData(30, 6),
    analytics: {
      monthlyByChannel: generateMonthlyByChannel(0.15, 0.78, 0.05, 0.01, 0.01),
      industryPie: [
        { name: 'Retail', value: 35, fill: '#6366f1' },
        { name: 'Finance', value: 28, fill: '#14b8a6' },
        { name: 'Logistics', value: 18, fill: '#f97316' },
        { name: 'Government', value: 12, fill: '#8b5cf6' },
        { name: 'Other', value: 7, fill: '#3b82f6' }
      ],
      luresBar: [
        { name: 'Package Delivery', value: 32, fill: '#6366f1' },
        { name: 'Bank Alert', value: 28, fill: '#14b8a6' },
        { name: 'Account Suspended', value: 18, fill: '#f97316' },
        { name: 'Prize Winner', value: 12, fill: '#8b5cf6' },
        { name: 'Tax Refund', value: 10, fill: '#3b82f6' }
      ],
      trendData: generateTrendData(30, 6)
    }
  },
  {
    id: 'vishing',
    name: 'Vishing',
    channel: 'voice',
    severity: 'medium',
    definition: 'Phishing attacks conducted over phone calls, often using voice manipulation technology.',
    redFlags: [
      'Unsolicited calls requesting personal information',
      'Callers creating a sense of urgency or fear',
      'Requests for passwords, PINs, or account numbers'
    ],
    mitigations: [
      'Never provide sensitive information over the phone',
      'Hang up and call the organization directly using official number',
      'Be suspicious of urgent requests',
      'Don\'t trust caller ID (it can be spoofed)'
    ],
    sparkData: generateTrendData(20, 5),
    analytics: {
      monthlyByChannel: generateMonthlyByChannel(0.10, 0.04, 0.85, 0.01, 0),
      industryPie: [
        { name: 'Finance', value: 38, fill: '#6366f1' },
        { name: 'Technology', value: 25, fill: '#14b8a6' },
        { name: 'Healthcare', value: 18, fill: '#f97316' },
        { name: 'Government', value: 12, fill: '#8b5cf6' },
        { name: 'Other', value: 7, fill: '#3b82f6' }
      ],
      luresBar: [
        { name: 'Tech Support', value: 35, fill: '#6366f1' },
        { name: 'Bank Fraud Alert', value: 28, fill: '#14b8a6' },
        { name: 'IRS/Tax', value: 18, fill: '#f97316' },
        { name: 'Warranty Expired', value: 12, fill: '#8b5cf6' },
        { name: 'Account Verification', value: 7, fill: '#3b82f6' }
      ],
      trendData: generateTrendData(20, 5)
    }
  },
  {
    id: 'clone-phishing',
    name: 'Clone Phishing',
    channel: 'email',
    severity: 'medium',
    definition: 'Attackers clone legitimate emails and resend them with malicious attachments or links.',
    redFlags: [
      'Emails that look identical to previous legitimate emails',
      'Slight changes in sender address or domain',
      'Re-sent emails with "updated" attachments'
    ],
    mitigations: [
      'Compare with original email if you have it',
      'Check sender address carefully for subtle differences',
      'Verify attachments with the sender before opening',
      'Report cloned emails to your IT department'
    ],
    sparkData: generateTrendData(25, 5),
    analytics: {
      monthlyByChannel: generateMonthlyByChannel(0.92, 0.05, 0.02, 0.01, 0),
      industryPie: [
        { name: 'Finance', value: 32, fill: '#6366f1' },
        { name: 'Legal', value: 25, fill: '#14b8a6' },
        { name: 'Healthcare', value: 18, fill: '#f97316' },
        { name: 'Retail', value: 15, fill: '#8b5cf6' },
        { name: 'Other', value: 10, fill: '#3b82f6' }
      ],
      luresBar: [
        { name: 'Invoice', value: 38, fill: '#6366f1' },
        { name: 'Document Request', value: 28, fill: '#14b8a6' },
        { name: 'Meeting Invite', value: 18, fill: '#f97316' },
        { name: 'Payment Reminder', value: 10, fill: '#8b5cf6' },
        { name: 'Contract', value: 6, fill: '#3b82f6' }
      ],
      trendData: generateTrendData(25, 5)
    }
  }
];
