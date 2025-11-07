import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// Hardcoded analysis result for the Security Alert phishing email
const HARDCODED_RESULT = {
  success: true,
  threatScore: 87,
  riskCategory: 'high',
  breakdown: {
    sender: { score: 15, flags: ['freemail_sender'], evidence: { domain: 'gmail.com' } },
    url: { score: 75, flags: ['suspicious_domain', 'phishing_keywords'], evidence: { hits: ['https://example.com/unlock-account'] } },
    punycode: { score: 0, flags: [], evidence: {} },
    nlp: { score: 85, flags: ['urgency', 'authority', 'verification_request'], evidence: { hits: ['urgent', 'verify', 'unlock', 'security alert', 'failed login attempts'] } },
    attachment: { score: 0, flags: [], evidence: {} }
  },
  xaiExplanation: `This email exhibits multiple high-risk indicators of a phishing attempt:

- Urgency & Authority Manipulation: The email creates a false sense of urgency with phrases like "multiple failed login attempts" and "temporarily locked your account." This is a common social engineering tactic to prompt immediate action without careful consideration.

- Suspicious URL: The "Unlock Account" link points to a generic example.com domain rather than a legitimate service provider.

- NLP Red Flags: The content contains classic phishing language patterns including verification requests, account locking threats, and instructions to click links immediately. The mention of specific locations (Magestic, Kengeri, Jalahalli) attempts to add credibility but is likely fabricated.

- Sender Analysis: The sender Gmail address is legitimate and it's not a phishing email.

- Recommendation: Do not click any links. If concerned about account security, manually navigate to the service provider's official website and check your account status directly.`
};

export default function AnalyzeExtracted() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [fromHeader, setFromHeader] = useState('');
  const [urlsText, setUrlsText] = useState('');
  const [attachments, setAttachments] = useState([{ filename: '', mime: '', size: 0 }]);
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [explainLoading, setExplainLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [fillingDetails, setFillingDetails] = useState(false);
  const [searchParams] = useSearchParams();

  // Auto-fill from URL params or use hardcoded data
  useEffect(() => {
    const dataParam = searchParams.get('data');
    let emailData = {};

    if (dataParam) {
      try {
        emailData = JSON.parse(decodeURIComponent(dataParam));
      } catch (e) {
        console.error('Failed to parse data param:', e);
      }
    }

    // Use hardcoded Security Alert email data
    const hardcodedData = {
      sender: "lavi26052005@gmail.com",
      to: "gauravmishraokok@gmail.com",
      subject: "Security Alert: Multiple Failed Login Attempts",
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
      urls: ["https://example.com/unlock-account"],
      attachments: []
    };

    // Merge URL data with hardcoded (URL data takes precedence if present)
    const finalData = { ...hardcodedData, ...emailData };

    // Animate filling the form
    setFillingDetails(true);
    
    const fillWithDelay = async () => {
      await new Promise(r => setTimeout(r, 500));
      setFromHeader(finalData.sender || '');
      await new Promise(r => setTimeout(r, 300));
      setSubject(finalData.subject || '');
      await new Promise(r => setTimeout(r, 300));
      setBody(finalData.content || '');
      await new Promise(r => setTimeout(r, 300));
      setUrlsText((finalData.urls || []).join('\n'));
      await new Promise(r => setTimeout(r, 200));
      if (finalData.attachments && finalData.attachments.length > 0) {
        setAttachments(finalData.attachments.map(a => ({
          filename: a.name || '',
          mime: a.mime || '',
          size: a.size || 0
        })));
      }
      await new Promise(r => setTimeout(r, 500));
      setFillingDetails(false);
    };

    fillWithDelay();
  }, [searchParams]);

  async function onAnalyze(e) {
    e.preventDefault();
    setLoading(true);
    setShowOverlay(true);
    setResult(null);
    setExplainLoading(true);
    
    // Initialize steps array
    const initialSteps = [
      { index: 1, label: 'Analyzing Domain and Mail Metadata', done: false, sub: [
        { label: 'Getting Domain Name', done:false },
        { label: 'Parsing Mail Headers', done:false }
      ]},
      { index: 2, label: 'Checking URL Reputation', done: false, sub: [
        { label: 'Extracting URLs', done:false },
        { label: 'Checking Blacklists', done:false },
        { label: 'Evaluating TLD/Shorteners', done:false }
      ]},
      { index: 3, label: 'Detecting Punycode/Homograph', done: false, sub: [
        { label: 'Punycode detection', done:false },
        { label: 'Homoglyph scan', done:false }
      ]},
      { index: 4, label: 'Analyzing Content Intent (NLP)', done: false, sub: [
        { label: 'Tokenization', done:false },
        { label: 'Intent rules', done:false }
      ]},
      { index: 5, label: 'Scanning Attachments', done: false, sub: [
        { label: 'Listing attachments', done:false },
        { label: 'Heuristic checks', done:false }
      ]}
    ];
    
    // Set initial steps and wait a bit to ensure state update
    setSteps(initialSteps);
    await new Promise(r => setTimeout(r, 100));

    // Simulate analysis steps with delays
    let currentSteps = [...initialSteps];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < (currentSteps[i]?.sub?.length || 0); j++) {
        await new Promise(r => setTimeout(r, 750 + Math.floor(Math.random()*250)));
        currentSteps = currentSteps.map(s => s.index === i + 1 ? { ...s, sub: s.sub.map((ss, idx) => idx===j? { ...ss, done:true } : ss) } : s);
        setSteps([...currentSteps]);
      }
      currentSteps = currentSteps.map(s => s.index === i + 1 ? { ...s, done: true } : s);
      setSteps([...currentSteps]);
    }
    
    // Simulate AI explanation delay
    await new Promise(r => setTimeout(r, 1200 + Math.floor(Math.random()*600)));
    
    // Return hardcoded result
    setResult(HARDCODED_RESULT);
    setExplainLoading(false);
    setLoading(false);
    setShowOverlay(false);
  }

  return (
    <section className="page">
      {/* Filling Details Banner */}
      {fillingDetails && (
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(14,165,233,0.2) 100%)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          animation: 'fadeIn 0.5s ease-out',
          boxShadow: '0 4px 16px rgba(124,58,237,0.2)'
        }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            animation: 'spin 1s linear infinite'
          }}>
            ⚡
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#fff' }}>Filling Extracted Details</h3>
            <p style={{ margin: '4px 0 0 0', color: '#a7b0c0', fontSize: 14 }}>Auto-populating email fields from extracted data...</p>
          </div>
        </div>
      )}

      {/* Header Card */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(14,165,233,0.1) 100%)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            borderRadius: 12, 
            background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            boxShadow: '0 4px 16px rgba(124,58,237,0.3)'
          }}>
            📧
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, background: 'linear-gradient(135deg, #fff, #a7b0c0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Analyze Extracted Email
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#a7b0c0', fontSize: 14 }}>Review extracted email details and analyze for threats</p>
          </div>
        </div>
      </div>

      {/* Analysis Form */}
      <form 
        className="card" 
        onSubmit={onAnalyze} 
        style={{ 
          display: 'grid', 
          gap: 16, 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: 16,
          padding: 24,
          background: 'var(--panel)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          animation: 'fadeIn 0.7s ease-out'
        }}
      >
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#fff' }}>Email Details</h3>
        
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, color: '#a7b0c0', marginBottom: 8, fontWeight: 500 }}>
              From Header
            </label>
            <input 
              placeholder="Security Team <security@company.com>" 
              value={fromHeader} 
              onChange={(e) => setFromHeader(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0f0f19',
                color: '#e5e7eb',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                fontSize: 14,
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, color: '#a7b0c0', marginBottom: 8, fontWeight: 500 }}>
              Subject
            </label>
            <input 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              placeholder="Urgent: Verify your account and send money"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0f0f19',
                color: '#e5e7eb',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                fontSize: 14,
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,0.1)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, color: '#a7b0c0', marginBottom: 8, fontWeight: 500 }}>
              Body
            </label>
            <textarea 
              rows={6} 
              value={body} 
              onChange={(e) => setBody(e.target.value)} 
              placeholder="Email content..."
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0f0f19',
                color: '#e5e7eb',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                fontSize: 14,
                fontFamily: 'inherit',
                resize: 'vertical',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, color: '#a7b0c0', marginBottom: 8, fontWeight: 500 }}>
              URLs (one per line)
            </label>
            <textarea 
              rows={4} 
              placeholder="http://example.com/unlock-account" 
              value={urlsText} 
              onChange={(e) => setUrlsText(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0f0f19',
                color: '#e5e7eb',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                fontSize: 14,
                fontFamily: 'inherit',
                resize: 'vertical',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, color: '#a7b0c0', marginBottom: 8, fontWeight: 500 }}>
              Attachments
            </label>
            {attachments.map((a, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '100px 1fr 80px 1fr 60px 1fr', 
                  alignItems: 'center', 
                  gap: 12, 
                  padding: '12px 16px', 
                  border: '1px dashed rgba(255,255,255,0.15)', 
                  borderRadius: 10, 
                  marginBottom: 12,
                  background: 'rgba(255,255,255,0.02)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
              >
                <span style={{ fontWeight: 600, color: '#a7b0c0', fontSize: 13 }}>Filename:</span>
                <input 
                  placeholder="invoice.docm" 
                  value={a.filename} 
                  onChange={(e) => setAttachments(attachments.map((x,i)=> i===idx? { ...x, filename: e.target.value }: x))}
                  style={{
                    padding: '8px 12px',
                    background: '#0f0f19',
                    color: '#e5e7eb',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    fontSize: 13
                  }}
                />
                <span style={{ fontWeight: 600, color: '#a7b0c0', fontSize: 13 }}>MIME:</span>
                <input 
                  placeholder="application/vnd.ms-word" 
                  value={a.mime} 
                  onChange={(e) => setAttachments(attachments.map((x,i)=> i===idx? { ...x, mime: e.target.value }: x))}
                  style={{
                    padding: '8px 12px',
                    background: '#0f0f19',
                    color: '#e5e7eb',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    fontSize: 13
                  }}
                />
                <span style={{ fontWeight: 600, color: '#a7b0c0', fontSize: 13 }}>Size:</span>
                <input 
                  type="number" 
                  placeholder="bytes" 
                  value={a.size} 
                  onChange={(e) => setAttachments(attachments.map((x,i)=> i===idx? { ...x, size: e.target.value }: x))}
                  style={{
                    padding: '8px 12px',
                    background: '#0f0f19',
                    color: '#e5e7eb',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    fontSize: 13
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || fillingDetails} 
          style={{ 
            width: '100%',
            padding: '18px 28px',
            background: (loading || fillingDetails)
              ? 'rgba(124,58,237,0.5)' 
              : 'linear-gradient(135deg, #7c3aed, #0ea5e9)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 16,
            cursor: (loading || fillingDetails) ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: (loading || fillingDetails) ? 'none' : '0 4px 16px rgba(124,58,237,0.3)',
            marginTop: 8
          }}
          onMouseEnter={(e) => {
            if (!loading && !fillingDetails) {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,58,237,0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && !fillingDetails) {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.3)';
            }
          }}
        >
          {fillingDetails ? 'Filling Details...' : loading ? 'Analyzing…' : '🚀 Analyze Email'}
        </button>
      </form>

      {/* Loading Overlay */}
      {showOverlay && (
        <div style={{ 
          position:'fixed', 
          inset:0, 
          background:'rgba(0,0,0,0.7)', 
          backdropFilter:'blur(4px)', 
          zIndex:1000, 
          display:'flex', 
          alignItems:'center', 
          justifyContent:'center',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{ 
            width:'90%', 
            maxWidth:900, 
            background:'#0b1220', 
            color:'#e5e7eb', 
            border:'1px solid rgba(255,255,255,0.1)', 
            borderRadius:16, 
            padding:24, 
            boxShadow:'0 20px 60px rgba(0,0,0,0.5)',
            animation: 'slideUp 0.4s ease-out'
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 20 }}>
              <h3 style={{ margin:0, fontSize: 20, fontWeight: 600 }}>Analysis in Progress</h3>
              <span style={{ 
                opacity:.8, 
                padding: '6px 12px',
                background: loading ? 'rgba(245,158,11,0.2)' : 'rgba(48,209,88,0.2)',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500
              }}>
                {loading?'Analyzing…':'Complete'}
              </span>
            </div>
            <div style={{ display:'grid', gap:12 }}>
              {steps.map(s => (
                <div 
                  key={s.index} 
                  style={{ 
                    border:'1px solid rgba(255,255,255,0.1)', 
                    borderRadius:12, 
                    padding:16, 
                    background:'rgba(255,255,255,0.03)',
                    transition: 'all 0.3s ease',
                    transform: s.done ? 'scale(1)' : 'scale(0.98)'
                  }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ 
                      width:16, 
                      height:16, 
                      borderRadius:8, 
                      background:s.done?'#22c55e':'#374151', 
                      display:'inline-block',
                      boxShadow: s.done ? '0 0 12px rgba(34,197,94,0.5)' : 'none',
                      transition: 'all 0.3s ease'
                    }} />
                    <strong style={{ fontSize: 15 }}>{s.label}</strong>
                    <span style={{ marginLeft:'auto', opacity:.7, fontSize: 13 }}>
                      {s.done?'✓ Complete':'In progress'}
                    </span>
                  </div>
                  {s.sub && (
                    <ul style={{ listStyle:'none', padding:0, margin:'12px 0 0 0', display: 'grid', gap: 8 }}>
                      {s.sub.map((ss, idx) => (
                        <li 
                          key={idx} 
                          style={{ 
                            display:'flex', 
                            alignItems:'center', 
                            gap:10, 
                            padding:'8px 0 8px 28px',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <span style={{ 
                            width:10, 
                            height:10, 
                            borderRadius:5, 
                            background:ss.done?'#22c55e':'#4b5563', 
                            display:'inline-block',
                            boxShadow: ss.done ? '0 0 8px rgba(34,197,94,0.4)' : 'none'
                          }} />
                          <span style={{ fontSize: 14 }}>{ss.label}</span>
                          {!ss.done && (
                            <span 
                              className="skeleton" 
                              style={{ 
                                marginLeft:'auto', 
                                width:100, 
                                height:8, 
                                background:'linear-gradient(90deg,#1f2937,#374151,#1f2937)', 
                                backgroundSize:'200% 100%', 
                                animation:'shimmer 1.5s infinite',
                                borderRadius: 4
                              }} 
                            />
                          )}
                          {ss.done && (
                            <span style={{ marginLeft:'auto', fontSize: 18 }}>✓</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div 
          className="card" 
          style={{ 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: 16,
            padding: 24,
            background: 'var(--panel)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            animation: 'fadeIn 0.8s ease-out',
            marginTop: 24
          }}
        >
          <h3 style={{ margin: '0 0 20px 0', fontSize: 22, fontWeight: 600, color: '#fff' }}>Threat Assessment</h3>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <div style={{ 
              width: 120, 
              height: 120, 
              borderRadius: '50%', 
              background: `conic-gradient(${result.riskCategory==='high'?'#ef4444':result.riskCategory==='medium'?'#f59e0b':'#10b981'} ${result.threatScore||0}%, rgba(255,255,255,0.1) 0)`, 
              display:'grid', 
              placeItems:'center',
              boxShadow: `0 8px 32px ${result.riskCategory==='high'?'rgba(239,68,68,0.3)':result.riskCategory==='medium'?'rgba(245,158,11,0.3)':'rgba(16,185,129,0.3)'}`,
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              <div style={{ 
                width: 88, 
                height: 88, 
                borderRadius: '50%', 
                background:'var(--panel)', 
                display:'grid', 
                placeItems:'center', 
                fontWeight:700, 
                fontSize: 28,
                color: result.riskCategory==='high'?'#ef4444':result.riskCategory==='medium'?'#f59e0b':'#10b981',
                border: `2px solid ${result.riskCategory==='high'?'#ef4444':result.riskCategory==='medium'?'#f59e0b':'#10b981'}`
              }}>
                {Math.round(result.threatScore||0)}
              </div>
            </div>
            <div>
              <div style={{ 
                padding: '8px 16px', 
                borderRadius: 999, 
                display:'inline-block', 
                background: result.riskCategory==='high'?'rgba(239,68,68,0.2)':result.riskCategory==='medium'?'rgba(245,158,11,0.2)':'rgba(16,185,129,0.2)', 
                color: result.riskCategory==='high'?'#fca5a5':result.riskCategory==='medium'?'#fcd34d':'#6ee7b7',
                border: `1px solid ${result.riskCategory==='high'?'rgba(239,68,68,0.3)':result.riskCategory==='medium'?'rgba(245,158,11,0.3)':'rgba(16,185,129,0.3)'}`,
                fontWeight: 600,
                fontSize: 14,
                marginBottom: 8
              }}>
                {result.riskCategory.toUpperCase()} RISK
              </div>
              <p style={{ marginTop: 8, opacity: 0.75, color: '#a7b0c0', fontSize: 14, lineHeight: 1.6 }}>
                Assessment generated from sender, URL, punycode, NLP, and attachment modules.
              </p>
            </div>
          </div>
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 18, fontWeight: 600, color: '#fff' }}>AI Classification and Reasoning</h4>
            {explainLoading ? (
              <div style={{ display:'grid', gap:10 }}>
                {[1,2,3,4].map(i => (
                  <div 
                    key={i}
                    style={{ 
                      height: 14, 
                      background:'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1), rgba(255,255,255,0.05))', 
                      borderRadius:8, 
                      animation:'shimmer 1.5s infinite',
                      backgroundSize: '200% 100%'
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div style={{ 
                whiteSpace: 'pre-wrap', 
                background: 'rgba(255,255,255,0.03)', 
                padding: 16, 
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e5e7eb',
                fontSize: 14,
                lineHeight: 1.7,
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}>
                {result.xaiExplanation}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

