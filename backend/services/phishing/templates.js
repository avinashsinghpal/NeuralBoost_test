// Realistic phishing email templates
const templates = {
  banking: {
    subjects: [
      'Urgent: Your Account Requires Immediate Verification',
      'Security Alert: Unauthorized Access Detected',
      'Action Required: Verify Your Account Now',
      'Important: Account Suspension Notice',
      'Your Account Security Has Been Compromised'
    ],
    messages: [
      'Dear Valued Customer,\n\nWe hope this message finds you well. This is an important security notification from your bank\'s fraud prevention department.\n\nSECURITY ALERT - ACCOUNT VERIFICATION REQUIRED\n\nWe have detected unusual activity on your account. Our automated security system flagged multiple login attempts from an unrecognized IP address (192.168.45.23) in a location you haven\'t accessed from before. Our fraud detection algorithms identified this as potentially suspicious behavior that requires immediate attention.\n\nFor your security and the protection of your financial assets, we need to verify your identity immediately. This is a standard security procedure implemented in accordance with federal banking regulations (FDIC guidelines) and our internal security protocols to protect your account and personal information from unauthorized access.\n\nWHY YOU ARE RECEIVING THIS NOTIFICATION:\n\nOur 24/7 monitoring system continuously analyzes account activity patterns, login locations, device fingerprints, and transaction behaviors. When we detect activity that deviates from your established patterns, we automatically trigger enhanced security verification to ensure account integrity.\n\nThis verification process is part of our multi-layered security approach that includes:\n- Real-time transaction monitoring\n- Behavioral analytics\n- Device recognition technology\n- Geographic location analysis\n- Time-based access pattern recognition\n\nACTION REQUIRED:\n\nPlease verify your account within 24 hours to avoid temporary suspension. Failure to verify may result in your account being locked for security purposes until identity verification can be completed through alternative methods.\n\nThis verification process takes less than 2 minutes and ensures that only you have access to your account. The verification link uses bank-level encryption (256-bit SSL) and is valid for 24 hours from the time this email was sent.\n\nWHAT TO EXPECT:\n\nWhen you click the verification link, you will be directed to our secure verification portal where you will:\n1. Confirm your account number (last 4 digits will be shown)\n2. Answer your security question\n3. Verify your registered phone number via SMS code\n4. Review recent account activity for any unauthorized transactions\n\nIMPORTANT SECURITY INFORMATION:\n\n- We will NEVER ask for your full account number, PIN, or password via email\n- Our verification process is always conducted through our official secure portal\n- All communication from our bank includes your account nickname or partial account number\n- If you receive a call claiming to be from our bank, always hang up and call us directly using the number on the back of your card\n\nIf you did not attempt to access your account from this location, please contact our fraud prevention team immediately at 1-800-XXX-XXXX (available 24/7) or visit your nearest branch. Our security team is standing by to assist you.\n\nWe take your account security seriously and appreciate your cooperation in helping us maintain the highest standards of account protection.\n\nThank you for being a valued customer.\n\nSincerely,\n\nSecurity & Fraud Prevention Department\nYour Bank Name\nMember FDIC | Equal Housing Lender\n\n---\n\nThis is an automated security notification. Please do not reply to this email. For account inquiries, please contact us through our official website or call the number on the back of your card.\n\nPrivacy Notice: This email was sent to you because you are a registered account holder. To review our privacy policy, please visit our website.',
      'Dear Account Holder,\n\nIMPORTANT SECURITY NOTIFICATION - IMMEDIATE ACTION REQUIRED\n\nOur advanced security monitoring system has flagged suspicious login attempts on your account from an unrecognized device. Here are the details of what we detected:\n\nDETECTED ACTIVITY:\n- Device: iPhone 13, iOS 17.2\n- Login Time: 3:47 AM EST ({{TIME}})\n- IP Address: 198.51.100.42\n- Location: New York, New York, United States\n- Browser: Safari Mobile 17.2\n- Connection Type: Mobile Network (4G LTE)\n\nThis login attempt originated from an IP address in a location that doesn\'t match your usual access patterns. Our machine learning algorithms have identified this as anomalous behavior based on:\n- Your typical login times (usually between 8 AM - 10 PM)\n- Your registered devices (this iPhone 13 is not in your device registry)\n- Your usual geographic locations (this location has never been associated with your account)\n- Your typical connection patterns (you usually connect via Wi-Fi, not mobile data)\n\nWHY THIS MATTERS:\n\nIdentity theft and account fraud are serious concerns. According to the Federal Trade Commission, financial fraud resulted in over $5.8 billion in losses last year. We are committed to protecting your account from such threats through proactive monitoring and immediate response protocols.\n\nTo protect your information and prevent unauthorized access, we need you to verify your identity immediately. This is a critical security measure implemented under our Zero Trust security framework to ensure your account remains secure.\n\nOUR SECURITY PROTOCOLS:\n\nWe use industry-leading security technologies including:\n- Multi-factor authentication (MFA)\n- Behavioral biometrics\n- Real-time fraud scoring\n- Device fingerprinting\n- Geographic anomaly detection\n- Time-based access controls\n\nWHAT YOU NEED TO DO:\n\nClick the secure verification link below to access our identity verification portal. This link is encrypted using TLS 1.3 and will expire in 12 hours for security purposes.\n\nOur security team is actively monitoring this situation and will take additional protective measures if verification is not completed within the next 12 hours. These measures may include:\n- Temporary account restrictions\n- Transaction monitoring alerts\n- Additional verification requirements for future transactions\n- Notification to our fraud investigation team\n\nVERIFICATION PROCESS:\n\nWhen you access the verification portal, you will be asked to:\n1. Confirm your identity using multi-factor authentication\n2. Review and approve the new device (if this was you)\n3. Update your security preferences\n4. Review recent account activity\n\nIf this login was NOT authorized by you:\n\n1. Do NOT click the verification link\n2. Immediately call our fraud hotline: 1-800-XXX-XXXX\n3. Change your password immediately through our official website or mobile app\n4. Enable two-factor authentication if not already active\n5. Review your account statements for any unauthorized transactions\n\nWe understand that security notifications can be concerning, but they are essential for protecting your financial assets. Our customer service representatives are available 24/7 to assist you with any questions or concerns.\n\nThank you for your prompt attention to this matter.\n\nBest regards,\n\nAccount Security Team\nYour Bank Name\n\n---\n\nSecurity Tip: Always verify emails from your bank by checking the sender\'s email address matches our official domain. Legitimate emails from us will always come from @yourbank.com addresses.\n\nThis email was sent to: [Your registered email address]\nAccount ending in: ****1234\n\nFor more information about account security, visit: https://www.yourbank.com/security',
      'Dear Valued Customer,\n\nSECURITY ALERT - NEW LOGIN DETECTED\n\nWe are writing to inform you that our security systems have detected a recent login to your account from a new location. As part of our commitment to protecting your account, we want to ensure this activity is authorized.\n\nDETECTED LOGIN DETAILS:\n\n- Location: Berlin, Germany (52.5200° N, 13.4050° E)\n- Time: 2:15 AM your local time ({{TIME}})\n- Device: Unknown device (not in your registered devices list)\n- IP Address: 185.220.101.45\n- Browser: Chrome 120.0.6099.109\n- Operating System: Windows 11\n- Connection: Residential broadband\n\nThis activity occurred at 2:15 AM your local time, which is outside your normal usage pattern. Our analytics show that:\n- 95% of your logins occur between 7 AM and 11 PM\n- You typically access your account from devices registered in your account settings\n- This is the first login attempt from Germany in your account history\n- The login occurred during a time when you are typically inactive\n\nWHY WE\'RE CONTACTING YOU:\n\nAt Your Bank Name, we take account security seriously. Our fraud prevention systems use advanced machine learning algorithms that analyze:\n- Login patterns and timing\n- Geographic locations and travel patterns\n- Device characteristics and fingerprints\n- Behavioral biometrics\n- Transaction patterns\n\nWhen we detect activity that doesn\'t match your established patterns, we automatically implement additional security measures to protect your account.\n\nCURRENT ACCOUNT STATUS:\n\nOur fraud prevention team has temporarily restricted certain account features until verification is complete. This is a standard security procedure implemented to protect your funds and personal information. The following restrictions are currently in place:\n- Online transfers to new recipients are temporarily disabled\n- Large transaction approvals require additional verification\n- Account settings changes are restricted\n- New payment methods cannot be added\n\nThese restrictions will be automatically lifted once you complete the verification process.\n\nWHAT YOU NEED TO DO:\n\nFor your protection, please verify this was you by clicking the verification link below. The verification process is quick and secure:\n\n1. Click the secure verification link (valid for 24 hours)\n2. You\'ll be asked to confirm your identity using your registered security method\n3. Review the login details and confirm if this was you\n4. If this was you, approve the new device and location\n5. If this was NOT you, you\'ll be guided through account security steps\n\nIf you recognize this activity, simply confirm it was you. The verification takes less than 3 minutes.\n\nIf this wasn\'t you, please secure your account immediately by:\n\n1. NOT clicking the verification link\n2. Calling our fraud prevention hotline immediately: 1-800-XXX-XXXX (24/7)\n3. Changing your password through our official website or mobile app\n4. Enabling two-factor authentication for enhanced security\n5. Reviewing your recent account activity and statements\n6. Contacting us to report the unauthorized access\n\nADDITIONAL SECURITY MEASURES:\n\nWe recommend taking the following steps to enhance your account security:\n\n- Enable two-factor authentication (2FA) for all account access\n- Set up account activity alerts via email and SMS\n- Regularly review your account statements\n- Use strong, unique passwords\n- Never share your login credentials with anyone\n- Be cautious of phishing attempts (we will NEVER ask for your password via email)\n\nOUR COMMITMENT TO SECURITY:\n\nYour Bank Name is committed to protecting your financial information. We invest millions annually in:\n- Advanced fraud detection systems\n- Cybersecurity infrastructure\n- Employee security training\n- Customer education programs\n- Regulatory compliance (PCI DSS, SOC 2, ISO 27001)\n\nWe are here to help. If you have any questions or concerns about this notification, please don\'t hesitate to contact our customer service team.\n\nThank you for your attention to this important security matter.\n\nSincerely,\n\nFraud Prevention & Security Department\nYour Bank Name\nMember FDIC | Equal Housing Lender\n\n---\n\nIMPORTANT REMINDERS:\n\n- We will NEVER ask for your full password, PIN, or Social Security Number via email\n- Always verify emails by checking the sender\'s email address\n- When in doubt, contact us directly using the phone number on the back of your card\n- This email was sent to your registered email address on file\n\nFor more information about protecting yourself from fraud, visit: https://www.yourbank.com/security/fraud-prevention',
      'Your account has been temporarily locked due to multiple failed login attempts. Our security system detected 5 unsuccessful password attempts within the last 30 minutes, which triggered our automated security protocol.\n\nTo restore access, please verify your identity through the secure link below. This is a security measure to protect your account from potential unauthorized access attempts.\n\nOnce verified, you\'ll regain full access to your account immediately. If you did not attempt to log in, please contact our security team immediately at security@bank.com or call our 24/7 support line at 1-800-XXX-XXXX.\n\nWe take your account security seriously and appreciate your cooperation in this matter.'
    ],
    subject: 'Urgent: Your Account Requires Immediate Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
        <div style="background: #1a5490; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">Security Alert</h2>
        </div>
        <div style="background: #f5f5f5; padding: 30px; border: 1px solid #ddd; border-top: none;">
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            Dear Valued Customer,
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            We have detected unusual activity on your account. For your security, we need to verify your identity immediately.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            <strong>Action Required:</strong> Please verify your account within 24 hours to avoid temporary suspension.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{TRACKED_URL}}" style="display: inline-block; background: #1a5490; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              Verify Account Now
            </a>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 20px 0 0 0;">
            If you did not request this verification, please contact our security team immediately.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 10px 0 0 0;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
        <div style="background: #e8e8e8; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
          <p style="margin: 0;">© 2024 Your Bank. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `Dear Valued Customer,

We have detected unusual activity on your account. For your security, we need to verify your identity immediately.

Action Required: Please verify your account within 24 hours to avoid temporary suspension.

Verify here: {{TRACKED_URL}}

If you did not request this verification, please contact our security team immediately.

This is an automated message. Please do not reply to this email.`
  },
  
  tech_support: {
    subjects: [
      'Action Required: Your Account Has Been Locked',
      'Security Alert: Multiple Failed Login Attempts',
      'Urgent: Account Verification Required',
      'Your Account Access Has Been Suspended',
      'Immediate Action Required: Unlock Your Account'
    ],
    messages: [
      'We\'ve detected multiple failed login attempts on your account from different IP addresses (3 attempts from New York, 2 from London, 1 from Tokyo) within the past hour. Our automated security system has identified this as potentially suspicious activity.\n\nTo protect your information and prevent unauthorized access, we\'ve temporarily locked your account. This is a standard security measure to ensure your data remains safe.\n\nTo unlock your account, please verify your identity by clicking the link below. The verification process will take approximately 2-3 minutes and requires you to confirm your account details. Once verified, you\'ll regain immediate access to all your services.\n\nIf you did not attempt to log in from these locations, please contact our support team immediately.',
      'Our security system has identified suspicious activity on your account. We detected login attempts from 4 different devices (Windows PC, MacBook Pro, Android Phone, iPad) across 3 different countries within a 2-hour window.\n\nFor your protection, we have temporarily restricted access to your account. This is an automated security response designed to protect your personal information and prevent potential data breaches.\n\nPlease verify your identity to restore full access to your account. Our verification process uses industry-standard encryption to ensure your information remains secure. You\'ll need to confirm your account email, answer a security question, and verify your phone number.\n\nThis security measure is in place to protect you from identity theft and unauthorized access. We appreciate your understanding and cooperation.',
      'We noticed several unsuccessful login attempts from different locations (attempts from: New York, USA at 10:23 AM; London, UK at 10:45 AM; Sydney, Australia at 11:12 AM). These attempts used incorrect passwords and triggered our security protocols.\n\nTo ensure your account security, we need you to verify your identity immediately. This verification helps us confirm that you are the legitimate account owner and prevents unauthorized access.\n\nClick below to unlock your account and secure it immediately. The verification process includes:\n- Confirming your account email address\n- Verifying your phone number via SMS code\n- Answering your security question\n\nOnce completed, your account will be fully restored with all security features enabled. If you did not attempt these logins, please contact our security team right away.',
      'Your account has been locked due to security concerns. Multiple unauthorized access attempts have been detected from various IP addresses and devices that are not associated with your account.\n\nOur security monitoring system flagged these attempts as high-risk activity. To protect your account and personal information, we have implemented a temporary lock that prevents any access until identity verification is completed.\n\nVerify your identity now to regain access to your account. The verification process is quick and secure, taking only a few minutes. You will need to:\n1. Confirm your account email\n2. Verify your registered phone number\n3. Complete a security check\n\nAfter verification, your account will be immediately unlocked and you\'ll receive a confirmation email. If you believe this is an error or did not attempt to access your account, please contact our support team at support@company.com or call 1-800-XXX-XXXX.'
    ],
    subject: 'Action Required: Your Account Has Been Locked',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
        <div style="background: #d32f2f; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">⚠️ Account Security Alert</h2>
        </div>
        <div style="background: #f5f5f5; padding: 30px; border: 1px solid #ddd; border-top: none;">
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            Hello,
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            We've detected multiple failed login attempts on your account. To protect your information, we've temporarily locked your account.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            <strong>To unlock your account, please verify your identity:</strong>
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{TRACKED_URL}}" style="display: inline-block; background: #d32f2f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              Unlock Account
            </a>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 20px 0 0 0;">
            If this wasn't you, please secure your account immediately by clicking the link above.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 10px 0 0 0;">
            Best regards,<br>Security Team
          </p>
        </div>
      </div>
    `,
    text: `Hello,

We've detected multiple failed login attempts on your account. To protect your information, we've temporarily locked your account.

To unlock your account, please verify your identity:

Unlock here: {{TRACKED_URL}}

If this wasn't you, please secure your account immediately.

Best regards,
Security Team`
  },
  
  invoice: {
    subjects: [
      'Payment Required: Invoice #INV-2024-{{RANDOM}}',
      'Outstanding Invoice - Payment Due',
      'Urgent: Invoice Payment Required',
      'Action Required: Pay Your Invoice Now',
      'Invoice Overdue - Immediate Payment Needed'
    ],
    messages: [
      'Your invoice #INV-2024-{{RANDOM}} is now due for payment. This invoice covers services rendered for the billing period ending {{DUE_DATE}}.\n\nInvoice Details:\n- Invoice Number: INV-2024-{{RANDOM}}\n- Amount Due: ${{AMOUNT}}\n- Due Date: {{DUE_DATE}}\n- Payment Terms: Net 30 days\n- Service Period: Previous month\n\nPlease review and pay your invoice by clicking the link below. We accept all major credit cards, bank transfers, and PayPal. Payment processing is secure and encrypted.\n\nIf you have already made this payment, please disregard this notice. For any questions about this invoice, please contact our billing department at billing@company.com or call us at 1-800-XXX-XXXX during business hours (Monday-Friday, 9 AM - 5 PM EST).',
      'We have an outstanding invoice that requires your immediate attention. Our records indicate that payment for invoice #INV-2024-{{RANDOM}} in the amount of ${{AMOUNT}} has not been received.\n\nPayment is due to avoid service interruption. This invoice is for services provided during the previous billing cycle. Failure to remit payment by {{DUE_DATE}} may result in:\n- Service suspension\n- Late payment fees (2.5% per month)\n- Collection proceedings\n\nPlease review the invoice details and complete payment through our secure payment portal. We offer multiple payment options including credit card, ACH transfer, and wire transfer.\n\nIf you believe this invoice is incorrect or have already submitted payment, please contact our billing department immediately. We are here to help resolve any billing questions or concerns you may have.',
      'This is a friendly reminder that your invoice payment is now due. Invoice #INV-2024-{{RANDOM}} for ${{AMOUNT}} was issued on {{DUE_DATE}} and payment is now past due.\n\nTo avoid late fees and service disruption, please complete your payment as soon as possible. We understand that sometimes invoices can be overlooked, and we want to work with you to resolve this matter quickly.\n\nYou can make a payment online through our secure payment portal, which accepts all major credit cards and bank transfers. The payment process is quick and secure, taking less than 2 minutes to complete.\n\nIf you are experiencing financial difficulties or need to set up a payment plan, please contact our accounts receivable department. We are committed to working with our clients to find solutions that work for everyone.',
      'Your invoice payment is overdue. Invoice #INV-2024-{{RANDOM}} in the amount of ${{AMOUNT}} was due on {{DUE_DATE}} and has not been received.\n\nTo maintain uninterrupted service and avoid additional late fees, please complete payment immediately. As of today, your account shows a past-due balance, and continued non-payment may result in service suspension.\n\nClick below to view and pay your invoice now. Our secure payment system accepts Visa, MasterCard, American Express, Discover, and ACH bank transfers. All transactions are encrypted and processed securely.\n\nIf you have already sent payment, please allow 3-5 business days for processing. If you have questions about this invoice or need to discuss payment arrangements, please contact our billing department at billing@company.com or call 1-800-XXX-XXXX. We are available Monday through Friday, 8 AM to 6 PM EST to assist you.'
    ],
    subject: 'Payment Required: Invoice #INV-2024-' + '{{RANDOM}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
        <div style="background: #2e7d32; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">Invoice Payment Required</h2>
        </div>
        <div style="background: #f5f5f5; padding: 30px; border: 1px solid #ddd; border-top: none;">
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            Dear Customer,
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            Your invoice <strong>#INV-2024-{{RANDOM}}</strong> is now due for payment.
          </p>
          <div style="background: white; padding: 20px; border: 2px solid #2e7d32; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #2e7d32;">
              Amount Due: $\{\{AMOUNT\}\}
            </p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
              Due Date: {{DUE_DATE}}
            </p>
          </div>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 20px 0;">
            Please review and pay your invoice by clicking the link below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{TRACKED_URL}}" style="display: inline-block; background: #2e7d32; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              View & Pay Invoice
            </a>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 20px 0 0 0;">
            If you have any questions about this invoice, please contact our billing department.
          </p>
        </div>
      </div>
    `,
    text: `Dear Customer,

Your invoice #INV-2024-{{RANDOM}} is now due for payment.

Amount Due: $\{\{AMOUNT\}\}
Due Date: \{\{DUE_DATE\}\}

Please review and pay your invoice here: {{TRACKED_URL}}

If you have any questions about this invoice, please contact our billing department.`
  },
  
  package: {
    subjects: [
      'Package Delivery Update - Action Required',
      'Delivery Attempt Failed - Reschedule Required',
      'Your Package Delivery Needs Attention',
      'Urgent: Delivery Address Confirmation Required',
      'Package Held - Update Delivery Information'
    ],
    messages: [
      'We attempted to deliver your package today but were unable to complete the delivery. Our delivery driver visited your address at 2:47 PM but was unable to leave the package due to access restrictions.\n\nPackage Details:\n- Tracking Number: {{TRACKING}}\n- Delivery Attempt: Today at 2:47 PM\n- Delivery Address: On file\n- Package Status: Held at local facility\n- Next Delivery Attempt: Tomorrow (if address confirmed)\n\nTo reschedule delivery or update your delivery preferences, please click the link below. You can choose from the following options:\n- Schedule a specific delivery time\n- Request delivery to a different address\n- Authorize package to be left at door\n- Pick up from local facility\n\nIf you don\'t take action within 48 hours, your package will be returned to the sender. Please update your delivery preferences as soon as possible to avoid delays.',
      'Our delivery driver attempted to deliver your package today but could not access your address. The driver noted that the gate code provided was incorrect, and there was no response at the doorbell.\n\nDelivery Information:\n- Tracking: {{TRACKING}}\n- Attempted Delivery: Today, 11:23 AM\n- Reason: Unable to access delivery location\n- Current Location: Local distribution center\n- Next Attempt: Tomorrow (pending address confirmation)\n\nPlease update your delivery information or schedule a new delivery time. You can provide:\n- Correct gate code or access instructions\n- Alternative delivery address\n- Preferred delivery time window\n- Authorization to leave package in a safe location\n\nWe want to ensure your package reaches you safely. Please update your delivery preferences within 24 hours to avoid return to sender. Our customer service team is available 24/7 to assist with any delivery questions.',
      'Your package delivery requires immediate attention. We have your package ready for delivery, but we need to confirm your delivery address and preferred delivery time to ensure successful delivery.\n\nPackage Information:\n- Tracking Number: {{TRACKING}}\n- Package Weight: 2.3 lbs\n- Estimated Delivery: Within 1-2 business days\n- Current Status: Awaiting address confirmation\n\nClick below to update your delivery preferences. You can:\n- Confirm or update your delivery address\n- Select a preferred delivery time window (Morning: 9 AM-12 PM, Afternoon: 12 PM-5 PM, Evening: 5 PM-8 PM)\n- Provide special delivery instructions\n- Authorize package release without signature\n\nTo ensure timely delivery, please complete this information within the next 12 hours. Our delivery team is standing by and ready to deliver your package as soon as we receive confirmation.',
      'Your package is currently being held at our local distribution facility. We attempted delivery yesterday but were unable to complete it. The package requires your attention to proceed with delivery.\n\nPackage Details:\n- Tracking: {{TRACKING}}\n- Facility Location: {{LOCATION}}\n- Held Since: Yesterday, 4:15 PM\n- Package Type: Standard delivery\n- Requires: Address confirmation\n\nTo ensure timely delivery, please confirm your address and preferred delivery window. You have the following options:\n1. Confirm current address and schedule delivery (Next available: Tomorrow)\n2. Update to alternative delivery address\n3. Schedule pickup from facility (Available today until 7 PM)\n4. Authorize delivery to neighbor or safe location\n\nUpdate your delivery information now to avoid delays. Packages not claimed within 5 business days will be returned to the sender. Our customer service representatives are available to assist you with any delivery concerns or special requests.'
    ],
    subject: 'Package Delivery Update - Action Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
        <div style="background: #ff6f00; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">📦 Delivery Update</h2>
        </div>
        <div style="background: #f5f5f5; padding: 30px; border: 1px solid #ddd; border-top: none;">
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            Hello,
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            We attempted to deliver your package today but were unable to complete the delivery.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            <strong>Tracking Number:</strong> {{TRACKING}}
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            To reschedule delivery or update your delivery preferences, please click the link below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{TRACKED_URL}}" style="display: inline-block; background: #ff6f00; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              Update Delivery
            </a>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 20px 0 0 0;">
            If you don't take action within 48 hours, your package will be returned to the sender.
          </p>
        </div>
      </div>
    `,
    text: `Hello,

We attempted to deliver your package today but were unable to complete the delivery.

Tracking Number: {{TRACKING}}

To reschedule delivery or update your delivery preferences, please visit: {{TRACKED_URL}}

If you don't take action within 48 hours, your package will be returned to the sender.`
  },
  
  social_media: {
    subjects: [
      'Security Alert: Suspicious Activity Detected',
      'Your Account Security Has Been Compromised',
      'Action Required: Verify Your Account',
      'Unauthorized Login Attempt Detected',
      'Immediate Action Required: Secure Your Account'
    ],
    messages: [
      'We detected a login from a new device or location. Our security system flagged a login attempt from a device we don\'t recognize (Device: Windows PC, Browser: Chrome, Location: New York, USA) at 3:22 AM your local time.\n\nIf this was you, no action is needed. Simply ignore this message and continue using your account as normal.\n\nIf you don\'t recognize this activity, please secure your account immediately by clicking the link below. This could indicate that someone else has gained access to your account. We recommend:\n- Changing your password immediately\n- Enabling two-factor authentication\n- Reviewing your recent account activity\n- Checking for any unauthorized posts or messages\n\nOur security team is monitoring this situation. If you confirm this was not you, we will immediately lock your account and investigate the unauthorized access. Your account security is our top priority.',
      'Our security system has flagged unusual activity on your account. We detected multiple login attempts from different locations (New York at 10:15 AM, London at 10:47 AM, Tokyo at 11:23 AM) within a short time period, which is inconsistent with your normal usage patterns.\n\nTo protect your information and ensure your account remains secure, we need you to verify your identity. This is a standard security procedure that helps us confirm you are the legitimate account owner.\n\nClick below to review recent account activity and secure your account. You\'ll be able to:\n- View all recent login attempts and locations\n- See which devices are currently logged in\n- Review any changes made to your account settings\n- Verify or remove unrecognized devices\n- Update your security settings\n\nThis verification process takes less than 3 minutes and helps protect your account from unauthorized access. If you notice any suspicious activity, please contact our security team immediately.',
      'We noticed a login from an unrecognized device (iPhone 13, iOS 17.2) from an IP address in a location you haven\'t accessed from before (Berlin, Germany). This login occurred at 1:45 AM your local time, which is outside your typical usage hours.\n\nFor your security, please verify this was you. Our automated security system has temporarily restricted certain account features until verification is complete. This is a protective measure to prevent unauthorized access.\n\nIf this was you, simply verify your identity to restore full account access. If this wasn\'t you, secure your account immediately by:\n- Changing your password to a strong, unique password\n- Enabling two-factor authentication\n- Reviewing and removing any unauthorized devices\n- Checking for any unauthorized posts, messages, or account changes\n\nWe take account security seriously. If you confirm unauthorized access, we will immediately lock your account and begin an investigation. Your personal information and account data are important to us.',
      'Suspicious activity has been detected on your account. Our security monitoring system identified multiple login attempts from various IP addresses and devices that don\'t match your account\'s normal access patterns.\n\nActivity Details:\n- 3 login attempts from different locations\n- 2 attempts from unrecognized devices\n- 1 attempt from a location you\'ve never accessed from\n- All attempts occurred within a 2-hour window\n\nTo prevent unauthorized access and protect your account, please verify your identity and review your account security settings immediately.\n\nTake action now to protect your account. The verification process includes:\n- Confirming your account email address\n- Verifying your phone number via SMS code\n- Reviewing recent account activity\n- Updating security settings if needed\n\nAfter verification, we recommend:\n- Enabling login alerts\n- Setting up two-factor authentication\n- Reviewing connected apps and devices\n- Using a strong, unique password\n\nIf you did not attempt these logins, please contact our security team immediately. We are here to help secure your account and investigate any unauthorized access attempts.'
    ],
    subject: 'Security Alert: Suspicious Activity Detected',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff;">
        <div style="background: #1976d2; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; font-size: 24px;">🔒 Security Alert</h2>
        </div>
        <div style="background: #f5f5f5; padding: 30px; border: 1px solid #ddd; border-top: none;">
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            Hi there,
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            We noticed a new login to your account from an unrecognized device. If this was you, no action is needed.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            <strong>Login Details:</strong><br>
            Location: {{LOCATION}}<br>
            Device: {{DEVICE}}<br>
            Time: {{TIME}}
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">
            If this wasn't you, please secure your account immediately:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{TRACKED_URL}}" style="display: inline-block; background: #1976d2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              Secure My Account
            </a>
          </div>
          <p style="font-size: 14px; line-height: 1.6; color: #666; margin: 20px 0 0 0;">
            Stay safe,<br>Your Security Team
          </p>
        </div>
      </div>
    `,
    text: `Hi there,

We noticed a new login to your account from an unrecognized device. If this was you, no action is needed.

Login Details:
Location: {{LOCATION}}
Device: {{DEVICE}}
Time: {{TIME}}

If this wasn't you, please secure your account immediately: {{TRACKED_URL}}

Stay safe,
Your Security Team`
  }
};

function getRandomTemplate() {
  const keys = Object.keys(templates);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return templates[randomKey];
}

function getTemplate(type) {
  return templates[type] || templates.banking;
}

function replacePlaceholders(template, trackedUrl, customMessage = '') {
  const randomNum = Math.floor(Math.random() * 10000);
  const amount = String((Math.random() * 500 + 50).toFixed(2));
  const locations = ['New York, USA', 'London, UK', 'Tokyo, Japan', 'Sydney, Australia', 'Berlin, Germany'];
  const devices = ['iPhone 13', 'Samsung Galaxy S21', 'Windows PC', 'MacBook Pro', 'iPad'];
  const tracking = `1Z999AA10123456784${randomNum}`;
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();
  const time = new Date().toLocaleString();
  
  // First unescape any escaped placeholders, then replace them
  let html = template.html
    .replace(/\\\{\{TRACKED_URL\}\\\}/g, '{{TRACKED_URL}}')
    .replace(/\\\{\{RANDOM\}\\\}/g, '{{RANDOM}}')
    .replace(/\\\{\{AMOUNT\}\\\}/g, '{{AMOUNT}}')
    .replace(/\\\{\{DUE_DATE\}\\\}/g, '{{DUE_DATE}}')
    .replace(/\\\{\{TRACKING\}\\\}/g, '{{TRACKING}}')
    .replace(/\\\{\{LOCATION\}\\\}/g, '{{LOCATION}}')
    .replace(/\\\{\{DEVICE\}\\\}/g, '{{DEVICE}}')
    .replace(/\\\{\{TIME\}\\\}/g, '{{TIME}}')
    .replace(/\{\{TRACKED_URL\}\}/g, trackedUrl)
    .replace(/\{\{RANDOM\}\}/g, String(randomNum))
    .replace(/\{\{AMOUNT\}\}/g, amount)
    .replace(/\{\{DUE_DATE\}\}/g, dueDate)
    .replace(/\{\{TRACKING\}\}/g, tracking)
    .replace(/\{\{LOCATION\}\}/g, locations[Math.floor(Math.random() * locations.length)])
    .replace(/\{\{DEVICE\}\}/g, devices[Math.floor(Math.random() * devices.length)])
    .replace(/\{\{TIME\}\}/g, time);
  
  let text = template.text
    .replace(/\\\{\{TRACKED_URL\}\\\}/g, '{{TRACKED_URL}}')
    .replace(/\\\{\{RANDOM\}\\\}/g, '{{RANDOM}}')
    .replace(/\\\{\{AMOUNT\}\\\}/g, '{{AMOUNT}}')
    .replace(/\\\{\{DUE_DATE\}\\\}/g, '{{DUE_DATE}}')
    .replace(/\\\{\{TRACKING\}\\\}/g, '{{TRACKING}}')
    .replace(/\\\{\{LOCATION\}\\\}/g, '{{LOCATION}}')
    .replace(/\\\{\{DEVICE\}\\\}/g, '{{DEVICE}}')
    .replace(/\\\{\{TIME\}\\\}/g, '{{TIME}}')
    .replace(/\{\{TRACKED_URL\}\}/g, trackedUrl)
    .replace(/\{\{RANDOM\}\}/g, String(randomNum))
    .replace(/\{\{AMOUNT\}\}/g, amount)
    .replace(/\{\{DUE_DATE\}\}/g, dueDate)
    .replace(/\{\{TRACKING\}\}/g, tracking)
    .replace(/\{\{LOCATION\}\}/g, locations[Math.floor(Math.random() * locations.length)])
    .replace(/\{\{DEVICE\}\}/g, devices[Math.floor(Math.random() * devices.length)])
    .replace(/\{\{TIME\}\}/g, time);
  
  // Add custom message if provided
  if (customMessage) {
    const customHtml = `<p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0 0 20px 0;">${customMessage.replace(/\n/g, '<br>')}</p>`;
    html = html.replace('</p>', `</p>${customHtml}`);
    text = `\n\n${customMessage}\n\n${text}`;
  }
  
  return { html, text, subject: template.subject };
}

function getTemplateOptions(type) {
  const template = templates[type];
  if (!template) return { subjects: [], messages: [] };
  
  return {
    subjects: template.subjects || [template.subject],
    messages: template.messages || []
  };
}

module.exports = {
  getTemplate,
  getRandomTemplate,
  replacePlaceholders,
  getTemplateOptions,
  templates
};

