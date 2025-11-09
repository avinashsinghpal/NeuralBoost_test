# 🛡️ TRACE - Threat Recognition And Cybersecurity Education

<div align="center">

![TRACE Logo](https://img.shields.io/badge/TRACE-Cybersecurity-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-0.1.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)

**A comprehensive cybersecurity education and phishing simulation platform designed to help organizations train employees and protect against cyber threats.**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Architecture](#-architecture)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Workflow](#-workflow)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**TRACE** (Threat Recognition And Cybersecurity Education) is a full-stack cybersecurity platform that combines:

- **🔍 Real-time Phishing Detection** - Advanced analysis engine with NLP, URL reputation checking, and attachment scanning
- **🎓 Employee Training** - Interactive phishing simulations and awareness programs
- **📊 Analytics Dashboard** - Comprehensive insights into organizational security posture
- **🚨 SOS Alert System** - Emergency reporting and response mechanism
- **🤖 AI-Powered Analysis** - Machine learning-based threat detection and explanation

### Why TRACE?

- ✅ **Multi-layered Analysis** - Combines NLP, URL reputation, punycode detection, and attachment scanning
- ✅ **Realistic Simulations** - Create convincing phishing campaigns for employee training
- ✅ **Comprehensive Analytics** - Track clicks, devices, departments, and individual performance
- ✅ **Educational Focus** - Learn from threats with detailed explanations and awareness content
- ✅ **Easy Integration** - RESTful API and browser extension support

---

## ✨ Features

### 🎯 Core Features

#### 1. **Phishing Email Analysis** 📧
- **NLP Content Analysis** - Detects phishing intent using natural language processing
- **URL Reputation Checking** - Real-time domain and URL threat intelligence
- **Punycode/Homograph Detection** - Identifies deceptive domain names (e.g., `microsft.com`)
- **Sender Analysis** - Detects email spoofing and suspicious sender patterns
- **Attachment Scanning** - Analyzes file attachments for malware indicators
- **Threat Scoring** - Comprehensive risk assessment with detailed breakdown

#### 2. **Phishing Simulation** 🎭
- **Email Simulations** - Send realistic phishing emails to employees
- **SMS Simulations** - Test employee awareness via SMS phishing
- **QR Code Simulations** - Generate QR codes with tracking links
- **Custom Templates** - Pre-built templates (banking, tech support, invoices, etc.)
- **Real-time Tracking** - Monitor who clicks, when, and from which device
- **Department Analytics** - Group results by department for targeted training

#### 3. **Employee Management** 👥
- **Company Management** - Multi-company support with authentication
- **Employee Database** - Add, manage, and track employees
- **Department Grouping** - Organize employees by department and industry
- **Performance Tracking** - Individual and team security awareness metrics

#### 4. **Analytics Dashboard** 📊
- **Click Tracking** - Real-time monitoring of simulation clicks
- **Device Information** - Track device type, OS, and browser
- **Geographic Data** - IP address tracking and analysis
- **Time-based Analytics** - Click patterns and trends over time
- **Department Reports** - Compare security awareness across departments
- **Visualizations** - Charts and graphs for easy data interpretation

#### 5. **Security Awareness** 🎓
- **Educational Content** - Interactive learning modules
- **Phishing Types** - Comprehensive guide to different phishing techniques
- **Best Practices** - Security tips and best practices
- **Phishing Genome** - Visual representation of phishing attack patterns
- **Real-time Explanations** - AI-powered threat explanations

#### 6. **SOS Alert System** 🚨
- **Emergency Reporting** - Quick threat reporting mechanism
- **Real-time Alerts** - Immediate notification system
- **Threat Response** - Rapid response to security incidents

#### 7. **QR Code Analysis** 📱
- **QR Scanner** - Scan and analyze QR codes for threats
- **Link Verification** - Check embedded URLs before redirect
- **Real-time Detection** - Instant threat identification

### 🔧 Advanced Features

- **Multi-channel Support** - Email, SMS, and QR code analysis
- **Sandbox Environment** - Safe attachment analysis
- **Blacklist Integration** - Real-time threat intelligence
- **Machine Learning** - Adaptive threat detection
- **Browser Extension** - Real-time email verification (optional)
- **RESTful API** - Complete API for integration
- **Database Storage** - SQLite for data persistence

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        TRACE Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend   │    │   Backend    │    │  Extension   │  │
│  │   (React)    │◄───┤  (Node.js)   │◄───┤  (Browser)   │  │
│  │   Port:5173  │    │  Port:5001   │    │  (Optional)  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                                 │
│         │                   │                                 │
│         ▼                   ▼                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Analysis Engine                          │   │
│  ├──────────┬──────────┬──────────┬──────────────────┤   │
│  │   NLP    │   URL    │  Sender  │   Attachment     │   │
│  │ Analysis │ Reputation│ Analysis │   Scanning      │   │
│  └──────────┴──────────┴──────────┴──────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Database (SQLite)                        │   │
│  │  - Campaigns  - Recipients  - Analytics  - Users     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

#### **Frontend (React + Vite)**
- **Pages**: Home, Analyze, Simulation, Dashboard, Awareness, Login
- **Components**: Analysis UI, Simulation Manager, Analytics Dashboard, QR Scanner
- **State Management**: React Context API
- **Styling**: Tailwind CSS, Framer Motion for animations
- **3D Visualizations**: React Three Fiber

#### **Backend (Node.js + Express)**
- **API Routes**: RESTful endpoints for all operations
- **Analysis Modules**: NLP, URL checking, sender analysis, attachment scanning
- **Database**: SQLite with better-sqlite3
- **Services**: Email (SMTP), SMS, QR code generation, threat intelligence
- **Middleware**: Authentication, error handling, logging

#### **Analysis Engine**
- **NLP Module**: Phishing intent detection using lexicons
- **URL Module**: Domain reputation, blacklist checking, punycode detection
- **Sender Module**: Email spoofing detection, header analysis
- **Attachment Module**: File type analysis, sandbox integration
- **Scoring System**: Weighted threat scoring algorithm

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NeuralBoost_7
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure environment variables**
   
   Create `backend/.env`:
   ```env
   PORT=5001
   TRACE_PUBLIC_URL=http://your-ip:5001
   
   # SMTP Configuration (for email simulations)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   # Optional: Database path
   DB_PATH=./services/db/data/trace.db
   ```

4. **Start the development servers**
   ```bash
   # From root directory - starts both frontend and backend
   npm run dev
   
   # Or start separately:
   npm run dev:back   # Backend only (port 5001)
   npm run dev:front  # Frontend only (port 5173)
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001
   - API Health Check: http://localhost:5001/api/health

---

## ⚙️ Configuration

### Environment Variables

#### Backend (.env)

```env
# Server Configuration
PORT=5001
TRACE_PUBLIC_URL=http://192.168.0.197:5001

# Database
DB_PATH=./services/db/data/trace.db

# SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS (Optional - Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### Network Configuration

For employees to access phishing simulation links:

1. **Find your IP address**
   ```bash
   cd backend
   node get-ip.js
   ```

2. **Set TRACE_PUBLIC_URL** in `.env`
   ```env
   TRACE_PUBLIC_URL=http://192.168.0.197:5001
   ```

3. **Configure firewall** (if needed)
   - Allow incoming connections on port 5001
   - Windows: Windows Defender Firewall
   - Linux: `sudo ufw allow 5001/tcp`

---

## 📖 Usage Guide

### 1. **Analyzing Phishing Emails** 🔍

1. Navigate to **Analyze** page
2. Enter email details:
   - Subject line
   - Email body/content
   - From header
   - URLs (if any)
   - Attachments (if any)
3. Click **Analyze**
4. Review the threat score and detailed analysis
5. Get AI-powered explanations of threats

### 2. **Running Phishing Simulations** 🎭

1. **Login** to your company account
2. Navigate to **Simulation** page
3. **Add employees** to your company
4. **Create a simulation**:
   - Select mode: Email, SMS, or QR Code
   - Choose template type (banking, tech support, etc.)
   - Add recipients
   - Customize subject and message
5. **Send simulation**
6. **Monitor results** in real-time:
   - Who clicked
   - When they clicked
   - Device information
   - Department statistics

### 3. **Viewing Analytics** 📊

1. Navigate to **Dashboard**
2. View comprehensive analytics:
   - Total clicks
   - Click rate by department
   - Device statistics
   - Time-based trends
3. Export reports (if available)

### 4. **Security Awareness Training** 🎓

1. Navigate to **Awareness** page
2. Explore educational content:
   - Phishing types
   - Best practices
   - Interactive learning modules
   - Phishing genome visualization

### 5. **QR Code Analysis** 📱

1. Navigate to **Analyze** page
2. Switch to **QR Code** mode
3. Scan QR code using camera
4. View analysis results before clicking

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Three Fiber** - 3D visualizations
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **SQLite (better-sqlite3)** - Database
- **Nodemailer** - Email sending
- **QRCode** - QR code generation
- **Natural Language Processing** - Content analysis

### Analysis Modules
- **NLP Engine** - Phishing intent detection
- **URL Reputation** - Domain and URL checking
- **Punycode Detection** - Homograph attack detection
- **Sender Analysis** - Email spoofing detection
- **Attachment Scanner** - File analysis

### Development Tools
- **Nodemon** - Auto-restart on changes
- **Concurrently** - Run multiple processes
- **ESLint** - Code linting

---

## 📁 Project Structure

```
NeuralBoost_7/
├── backend/                 # Backend server
│   ├── analytics/          # Analytics and reporting
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── db/                 # Database files
│   ├── middleware/         # Express middleware
│   ├── modules/            # Analysis modules
│   │   ├── attachmentAnalysis/
│   │   ├── nlpContent/
│   │   ├── punycodeAnalysis/
│   │   ├── senderAnalysis/
│   │   └── urlReputation/
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   │   ├── db/
│   │   ├── smtp/
│   │   ├── sms/
│   │   └── phishing/
│   ├── utils/              # Utility functions
│   └── server.js           # Entry point
│
├── frontend/               # Frontend application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # React components
│   │   ├── context/       # React context
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   └── styles/        # CSS styles
│   └── vite.config.js     # Vite configuration
│
├── mail-auth-extension/    # Browser extension (optional)
├── docs/                   # Documentation
└── scripts/                # Utility scripts
```

---

## 🔄 Workflow

### Phishing Email Analysis Workflow

```
1. User submits email for analysis
   ↓
2. Backend receives request
   ↓
3. Analysis Engine processes:
   ├─→ Sender Analysis (headers, spoofing)
   ├─→ URL Reputation (domain, blacklists)
   ├─→ Punycode Detection (homographs)
   ├─→ NLP Analysis (content intent)
   └─→ Attachment Scanning (file analysis)
   ↓
4. Calculate threat score
   ↓
5. Generate detailed report
   ↓
6. Return results to frontend
   ↓
7. Display analysis with explanations
```

### Phishing Simulation Workflow

```
1. Admin creates simulation campaign
   ↓
2. Select recipients and template
   ↓
3. Generate unique tracking tokens
   ↓
4. Send emails/SMS/QR codes
   ↓
5. Employee receives simulation
   ↓
6. Employee clicks link
   ↓
7. Track click event:
   ├─→ Record timestamp
   ├─→ Capture device info
   ├─→ Log IP address
   └─→ Store in database
   ↓
8. Show phishing awareness page
   ↓
9. Update analytics dashboard
   ↓
10. Generate reports
```

### Analysis Module Workflow

```
Input: Email data
   ↓
┌─────────────────────────────────────┐
│  Analysis Pipeline                  │
├─────────────────────────────────────┤
│  1. Parse email headers             │
│  2. Extract URLs and attachments    │
│  3. Analyze sender information      │
│  4. Check URL reputation            │
│  5. Detect punycode/homographs      │
│  6. Process content with NLP        │
│  7. Scan attachments                │
│  8. Calculate threat scores         │
│  9. Generate evidence and flags     │
└─────────────────────────────────────┘
   ↓
Output: Threat analysis report
```

---

## 📡 API Documentation

### Endpoints

#### Analysis
- `POST /api/analyze` - Analyze phishing email
- `POST /api/analysis/explain` - Get AI explanation of threat

#### Simulation
- `POST /api/simulation/send` - Send phishing simulation
- `GET /api/simulation/phished` - Get phished recipients
- `GET /api/simulation/phished/all` - Get all phished details
- `GET /api/simulation/phished/by-department` - Get department statistics
- `GET /t/:token` - Track click (public endpoint)

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/analytics` - Get analytics data

#### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register company
- `GET /api/auth/me` - Get current user

#### Awareness
- `GET /api/awareness/content` - Get awareness content

### Example Request

```javascript
// Analyze email
POST /api/analyze
Content-Type: application/json

{
  "subject": "Urgent: Verify your account",
  "body": "Click here to verify your account...",
  "fromHeader": "noreply@example.com",
  "urls": ["https://example.com/verify"],
  "attachments": []
}
```

### Example Response

```json
{
  "success": true,
  "threatScore": 85,
  "analysis": {
    "sender": { "score": 70, "flags": ["suspicious_domain"] },
    "url": { "score": 90, "flags": ["shortener_domain"] },
    "nlp": { "score": 85, "flags": ["urgency", "authority"] },
    "punycode": { "score": 0, "flags": [] },
    "attachment": { "score": 0, "flags": [] }
  },
  "explanation": "This email exhibits multiple phishing indicators..."
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. **Server not starting**
- Check if port 5001 is already in use
- Verify Node.js version (v18+)
- Check `.env` file configuration

#### 2. **Email simulation not working**
- Verify SMTP credentials in `.env`
- Check firewall settings
- Ensure SMTP port is open (587 for TLS)

#### 3. **Phishing links not accessible**
- Verify `TRACE_PUBLIC_URL` in `.env`
- Check if server is running
- Ensure firewall allows port 5001
- Verify employees are on same network (for local IP)

#### 4. **Database errors**
- Check database file permissions
- Verify database path in `.env`
- Ensure SQLite is properly installed

#### 5. **Analysis not working**
- Check API endpoint connectivity
- Verify analysis modules are loaded
- Check console for error messages

### Getting Help

- Check [TROUBLESHOOTING.md](backend/TROUBLESHOOTING.md) for detailed solutions
- Review [NETWORK_ACCESS.md](backend/NETWORK_ACCESS.md) for network setup
- Check [SMS_SETUP.md](backend/SMS_SETUP.md) for SMS configuration

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Follow semantic versioning

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Open Source Community** - For amazing tools and libraries
- **Security Researchers** - For threat intelligence and insights
- **Contributors** - For improvements and bug fixes

---

## 📞 Support

For support, email lavish.dev.work@gmail.com or open an issue on GitHub.

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] Advanced ML models for threat detection
- [ ] Real-time collaboration features
- [ ] Mobile app for iOS and Android
- [ ] Integration with SIEM systems
- [ ] Advanced reporting and exports
- [ ] Multi-language support
- [ ] Custom threat intelligence feeds
- [ ] Automated response workflows

---

<div align="center">

**Made with ❤️ by the TRACE Team**

[⬆ Back to Top](#-trace---threat-recognition-and-cybersecurity-education)

</div>

