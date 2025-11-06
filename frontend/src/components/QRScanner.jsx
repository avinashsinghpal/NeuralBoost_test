// Dependencies: react, html5-qrcode, ../api/apiClient
// Purpose: QR code scanner component that analyzes scanned URLs for phishing threats

import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { api } from '../api/apiClient';

export default function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [steps, setSteps] = useState([]);
  const [explainLoading, setExplainLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  async function analyzeUrl(url) {
    setLoading(true);
    setShowOverlay(true);
    setError(null);
    setResult(null);
    setExplainLoading(true);
    
    // Initialize analysis steps
    const initialSteps = [
      { index: 1, label: 'Extracting URL from QR Code', done: false, sub: [
        { label: 'Decoding QR data', done: false },
        { label: 'Validating URL format', done: false }
      ]},
      { index: 2, label: 'Analyzing URL Structure', done: false, sub: [
        { label: 'Parsing domain and path', done: false },
        { label: 'Checking for suspicious patterns', done: false }
      ]},
      { index: 3, label: 'Checking URL Reputation', done: false, sub: [
        { label: 'Evaluating TLD risk', done: false },
        { label: 'Detecting punycode/homographs', done: false },
        { label: 'Checking URL length', done: false }
      ]},
      { index: 4, label: 'Content Analysis', done: false, sub: [
        { label: 'Scanning for phishing keywords', done: false },
        { label: 'Checking safe domain list', done: false }
      ]},
      { index: 5, label: 'Calculating Threat Score', done: false, sub: [
        { label: 'Aggregating risk factors', done: false },
        { label: 'Finalizing assessment', done: false }
      ]}
    ];
    setSteps(initialSteps);

    // Simulate progress steps
    const promise = api.qr.scan(url);
    
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < (initialSteps[i]?.sub?.length || 0); j++) {
        await new Promise(r => setTimeout(r, 600 + Math.floor(Math.random()*200)));
        setSteps(prev => prev.map(s => s.index === i + 1 ? { 
          ...s, 
          sub: s.sub.map((ss, idx) => idx === j ? { ...ss, done: true } : ss) 
        } : s));
      }
      setSteps(prev => prev.map(s => s.index === i + 1 ? { ...s, done: true } : s));
    }

    try {
      const response = await promise;
      
      // Simulate AI explanation loading
      await new Promise(r => setTimeout(r, 1000 + Math.floor(Math.random()*500)));
      
      // Generate AI explanation
      const explanation = generateExplanation(response);
      setResult({ ...response, xaiExplanation: explanation });
      setExplainLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to analyze URL');
      setResult(null);
      setExplainLoading(false);
    } finally {
      setLoading(false);
      setShowOverlay(false);
    }
  }

  function generateExplanation(result) {
    const { score, category, reasons, url } = result;
    let explanation = `Analysis of QR code URL: ${url}\n\n`;
    
    explanation += `Threat Score: ${score}/100 (${category.toUpperCase()} Risk)\n\n`;
    
    if (category === 'high') {
      explanation += `⚠️ HIGH RISK: This QR code contains multiple suspicious indicators that suggest it may be part of a phishing or malicious campaign. `;
    } else if (category === 'medium') {
      explanation += `⚡ MEDIUM RISK: This QR code shows some concerning characteristics that warrant caution. `;
    } else {
      explanation += `✅ LOW RISK: This QR code appears relatively safe, but always verify the source before interacting. `;
    }
    
    explanation += `\n\nKey Findings:\n`;
    reasons.forEach((reason, idx) => {
      explanation += `${idx + 1}. ${reason}\n`;
    });
    
    explanation += `\nRecommendation: `;
    if (category === 'high') {
      explanation += `Do not scan or visit this URL. It exhibits multiple red flags associated with phishing attempts.`;
    } else if (category === 'medium') {
      explanation += `Exercise caution. Verify the source of this QR code before scanning, especially if received unexpectedly.`;
    } else {
      explanation += `Proceed with normal caution. While the URL appears safe, always verify the source when possible.`;
    }
    
    return explanation;
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setSelectedImage(file);
    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Scan QR from image
    const html5QrCode = new Html5Qrcode();
    html5QrCodeRef.current = html5QrCode;

    html5QrCode.scanFile(file, true)
      .then((decodedText) => {
        analyzeUrl(decodedText);
      })
      .catch((err) => {
        setError('Failed to decode QR code from image: ' + err.message);
        setSelectedImage(null);
        setImagePreview(null);
      });
  }

  function handleDummyQR(type) {
    const dummyUrls = {
      safe: 'https://www.google.com/search?q=safe+website',
      medium: 'http://verify-account-secure.tk/login?token=abc123',
      high: 'http://192.168.1.100/xn--pple-43d.com/secure-login/verify-account-urgent'
    };
    analyzeUrl(dummyUrls[type]);
  }

  function startScan() {
    setScanning(true);
    setError(null);
    setResult(null);
    setSelectedImage(null);
    setImagePreview(null);
    
    const html5QrCode = new Html5Qrcode('qr-reader');
    html5QrCodeRef.current = html5QrCode;

    html5QrCode.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      (decodedText) => {
        html5QrCode.stop().then(() => {
          setScanning(false);
          analyzeUrl(decodedText);
        }).catch(() => {
          setScanning(false);
        });
      },
      (errorMessage) => {
        // Ignore scanning errors
      }
    ).catch((err) => {
      setError('Failed to start camera: ' + err.message);
      setScanning(false);
    });
  }

  function stopScan() {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        setScanning(false);
      }).catch(() => {});
    }
  }

  function handleManualUrl(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    if (url) {
      analyzeUrl(url);
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCategoryBg = (category) => {
    switch (category) {
      case 'high': return 'rgba(239,68,68,0.2)';
      case 'medium': return 'rgba(245,158,11,0.2)';
      case 'low': return 'rgba(16,185,129,0.2)';
      default: return 'rgba(107,114,128,0.2)';
    }
  };

  return (
    <div style={{ 
      display: 'grid', 
      gap: 20,
      animation: 'fadeIn 0.7s ease-out'
    }}>
      {/* Dummy QR Options */}
      <div style={{
        background: 'var(--panel)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 18, fontWeight: 600, color: '#fff' }}>
          Quick Test Scenarios
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <button
            type="button"
            onClick={() => handleDummyQR('safe')}
            disabled={loading}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              border: '1px solid rgba(16,185,129,0.3)',
              background: 'rgba(16,185,129,0.1)',
              color: '#6ee7b7',
              fontWeight: 600,
              fontSize: 13,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            ✅ Safe QR
          </button>
          <button
            type="button"
            onClick={() => handleDummyQR('medium')}
            disabled={loading}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              border: '1px solid rgba(245,158,11,0.3)',
              background: 'rgba(245,158,11,0.1)',
              color: '#fcd34d',
              fontWeight: 600,
              fontSize: 13,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            ⚠️ Medium Risk
          </button>
          <button
            type="button"
            onClick={() => handleDummyQR('high')}
            disabled={loading}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              border: '1px solid rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.1)',
              color: '#fca5a5',
              fontWeight: 600,
              fontSize: 13,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            🚨 High Risk
          </button>
        </div>
      </div>

      {/* Image Upload Section */}
      <div style={{
        background: 'var(--panel)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 20, fontWeight: 600, color: '#fff' }}>
          Upload QR Code Image
        </h3>
        <div style={{ display: 'grid', gap: 16 }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '100%',
              minHeight: 200,
              background: imagePreview 
                ? 'transparent' 
                : 'rgba(255,255,255,0.03)',
              border: '2px dashed rgba(255,255,255,0.2)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 12,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              if (!imagePreview) {
                e.currentTarget.style.borderColor = '#7c3aed';
                e.currentTarget.style.background = 'rgba(124,58,237,0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!imagePreview) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }
            }}
          >
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="QR Code Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: 300, 
                  borderRadius: 8,
                  objectFit: 'contain'
                }} 
              />
            ) : (
              <>
                <div style={{ fontSize: 48 }}>📷</div>
                <p style={{ color: '#a7b0c0', margin: 0, textAlign: 'center' }}>
                  Click to upload QR code image
                </p>
                <p style={{ color: '#6b7280', margin: 0, fontSize: 12 }}>
                  Supports JPG, PNG, GIF
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          {imagePreview && (
            <button
              type="button"
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              style={{
                padding: '10px 16px',
                background: 'rgba(239,68,68,0.2)',
                color: '#fca5a5',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 10,
                fontWeight: 500,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Remove Image
            </button>
          )}
        </div>
      </div>

      {/* Camera Scanner Section */}
      <div style={{
        background: 'var(--panel)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 20, fontWeight: 600, color: '#fff' }}>
          Scan with Camera
        </h3>
        
        {!scanning ? (
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{
              width: '100%',
              height: 300,
              background: 'rgba(255,255,255,0.03)',
              border: '2px dashed rgba(255,255,255,0.2)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{ fontSize: 48 }}>📱</div>
              <p style={{ color: '#a7b0c0', margin: 0, textAlign: 'center' }}>
                Click "Start Scanner" to scan a QR code
              </p>
            </div>
            <button
              type="button"
              onClick={startScan}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: loading 
                  ? 'rgba(124,58,237,0.5)' 
                  : 'linear-gradient(135deg, #7c3aed, #0ea5e9)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(124,58,237,0.3)'
              }}
            >
              📷 Start Scanner
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            <div id="qr-reader" style={{ width: '100%' }} />
            <button
              type="button"
              onClick={stopScan}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: 'rgba(239,68,68,0.2)',
                color: '#fca5a5',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Stop Scanner
            </button>
          </div>
        )}
      </div>

      {/* Manual URL Input */}
      <div style={{
        background: 'var(--panel)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 20, fontWeight: 600, color: '#fff' }}>
          Or Enter URL Manually
        </h3>
        <form onSubmit={handleManualUrl} style={{ display: 'grid', gap: 12 }}>
          <input
            type="text"
            name="url"
            placeholder="https://example.com"
            required
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
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 20px',
              background: loading 
                ? 'rgba(124,58,237,0.5)' 
                : 'linear-gradient(135deg, #7c3aed, #0ea5e9)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Analyzing…' : '🔍 Analyze URL'}
          </button>
        </form>
      </div>

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
              <h3 style={{ margin:0, fontSize: 20, fontWeight: 600 }}>QR Code Analysis in Progress</h3>
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

      {/* Error Display */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 12,
          padding: 16,
          color: '#fca5a5'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div style={{
          background: 'var(--panel)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          animation: 'fadeIn 0.5s ease-out',
          marginTop: 24
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: 22, fontWeight: 600, color: '#fff' }}>
            Threat Assessment
          </h3>
          
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <div style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: `conic-gradient(${getCategoryColor(result.category)} ${result.score}%, rgba(255,255,255,0.1) 0)`,
              display: 'grid',
              placeItems: 'center',
              boxShadow: `0 8px 32px ${getCategoryColor(result.category)}30`,
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              <div style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                background: 'var(--panel)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                fontSize: 28,
                color: getCategoryColor(result.category),
                border: `2px solid ${getCategoryColor(result.category)}`
              }}>
                {result.score}
              </div>
            </div>
            <div>
              <div style={{
                padding: '8px 16px',
                borderRadius: 999,
                display: 'inline-block',
                background: getCategoryBg(result.category),
                color: getCategoryColor(result.category),
                border: `1px solid ${getCategoryColor(result.category)}40`,
                fontWeight: 600,
                fontSize: 14,
                marginBottom: 8
              }}>
                {result.category.toUpperCase()} RISK
              </div>
              <p style={{ margin: '8px 0 0 0', color: '#a7b0c0', fontSize: 14, lineHeight: 1.6 }}>
                URL: <code style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '2px 6px', 
                  borderRadius: 4,
                  fontSize: 12
                }}>{result.url}</code>
              </p>
            </div>
          </div>

          <div style={{ 
            marginTop: 24, 
            paddingTop: 24, 
            borderTop: '1px solid rgba(255,255,255,0.1)' 
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: 18, fontWeight: 600, color: '#fff' }}>
              Analysis Explanation
            </h4>
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

          <button
            type="button"
            onClick={() => {
              setResult(null);
              setError(null);
              setSelectedImage(null);
              setImagePreview(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            style={{
              marginTop: 20,
              width: '100%',
              padding: '12px 20px',
              background: 'rgba(255,255,255,0.05)',
              color: '#a7b0c0',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              fontWeight: 500,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
          >
            Scan Another
          </button>
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
      `}</style>
    </div>
  );
}
