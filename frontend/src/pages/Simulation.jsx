import React, { useMemo, useState, useEffect } from 'react';
import { api } from '../api/apiClient';

export default function Simulation() {
  const [mode, setMode] = useState('email'); // email | sms | qr
  const [recipients, setRecipients] = useState('alice@example.com\nbob@example.com');
  const [department, setDepartment] = useState('Finance');
  const [industry, setIndustry] = useState('IT Services');
  const [subject, setSubject] = useState('Urgent: Account Verification Required');
  const [message, setMessage] = useState('Please verify your account immediately at the link provided.');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [phished, setPhished] = useState([]);
  const [loadingPhished, setLoadingPhished] = useState(false);
  const [dbView, setDbView] = useState(null);
  const [loadingDb, setLoadingDb] = useState(false);
  const [showDbView, setShowDbView] = useState(false);

  const stats = result?.summary;

  async function loadPhished() {
    try {
      setLoadingPhished(true);
      const res = await api.simulation.getPhished();
      setPhished(res.phished || []);
    } catch (err) {
      console.error('Failed to load phished recipients:', err);
    } finally {
      setLoadingPhished(false);
    }
  }

  async function loadDbView() {
    try {
      setLoadingDb(true);
      const res = await api.simulation.getAllPhishedDetails();
      setDbView(res);
    } catch (err) {
      console.error('Failed to load database view:', err);
      setDbView({ error: err.message });
    } finally {
      setLoadingDb(false);
    }
  }

  useEffect(() => {
    loadPhished();
    const interval = setInterval(loadPhished, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  async function onSend(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        mode,
        recipients: recipients.split(/\r|\n/).map(s => s.trim()).filter(Boolean),
        meta: { department, industry },
        content: { subject, message }
      };
      const res = await api.simulation.send(payload);
      setResult(res);
      // Refresh phished list after sending
      await loadPhished();
    } catch (err) {
      setResult({ error: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  }

  const accent = useMemo(() => ({
    from: '#0ea5e9', to: '#7c3aed'
  }), []);

  return (
    <section className="page" style={{ color: '#e5e7eb' }}>
      <div style={{ position:'relative', overflow:'hidden', borderRadius: 16, padding: 18, background: 'linear-gradient(180deg,#0b0f1e 0%, #0b1220 100%)', border: '1px solid #1f2937' }}>
        <Glow />
        <h2 style={{ margin: 0 }}>Simulation Campaign</h2>
        <p style={{ marginTop: 6, opacity: .8 }}>Send simulated phishing via Email, SMS, or QR and track who gets phished.</p>

        <form onSubmit={onSend} className="card" style={{ background:'#0f172a', border:'1px solid #1f2937', borderRadius: 12, padding: 16, display:'grid', gap: 12 }}>
          <div style={{ display:'flex', gap: 8, flexWrap:'wrap' }}>
            {['email','sms','qr'].map(m => (
              <button key={m} type="button" onClick={() => setMode(m)}
                style={{ padding: '8px 12px', borderRadius: 999, border: '1px solid #334155', background: mode===m? `linear-gradient(135deg,${accent.from},${accent.to})` : 'transparent', color: mode===m? '#fff':'#e5e7eb', cursor:'pointer' }}>
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          <label style={{ display:'grid', gap:6 }}>
            <span>Recipients ({mode==='sms' ? 'phone numbers' : 'emails'})</span>
            <textarea rows={4} value={recipients} onChange={e=>setRecipients(e.target.value)} placeholder={mode==='sms'?'9876543210\n9123456780':'alice@example.com\nbob@example.com'} style={{ background:'#0b1220', color:'#e5e7eb', border:'1px solid #334155', borderRadius:10, padding:10 }} />
          </label>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
            <label style={{ display:'grid', gap:6 }}>
              <span>Department</span>
              <input value={department} onChange={e=>setDepartment(e.target.value)} placeholder="Finance" style={{ background:'#0b1220', color:'#e5e7eb', border:'1px solid #334155', borderRadius:10, padding:10 }} />
            </label>
            <label style={{ display:'grid', gap:6 }}>
              <span>Industry</span>
              <input value={industry} onChange={e=>setIndustry(e.target.value)} placeholder="IT Services" style={{ background:'#0b1220', color:'#e5e7eb', border:'1px solid #334155', borderRadius:10, padding:10 }} />
            </label>
          </div>

          {mode !== 'qr' && (
            <label style={{ display:'grid', gap:6 }}>
              <span>Subject</span>
              <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Urgent: Account Verification Required" style={{ background:'#0b1220', color:'#e5e7eb', border:'1px solid #334155', borderRadius:10, padding:10 }} />
            </label>
          )}

          <label style={{ display:'grid', gap:6 }}>
            <span>{mode==='qr' ? 'Landing message' : 'Message'}</span>
            <textarea rows={5} value={message} onChange={e=>setMessage(e.target.value)} placeholder={mode==='qr'? 'Scan this QR to access the secure portal.' : 'Please verify your account immediately at the link provided.'} style={{ background:'#0b1220', color:'#e5e7eb', border:'1px solid #334155', borderRadius:10, padding:10 }} />
          </label>

          <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
            <button type="submit" disabled={loading} style={{ background: `linear-gradient(135deg,${accent.from},${accent.to})`, color:'#fff', border:'none', borderRadius:10, padding:'10px 14px', fontWeight:800, cursor:'pointer', boxShadow: '0 10px 24px rgba(124,58,237,0.35)' }}>
              {loading? 'Sending…':'Send Simulation'}
            </button>
            <span className="subtle" style={{ opacity:.8 }}>Tracked links auto‑generated for clicks/scans.</span>
          </div>
        </form>

        {result && (
          <div className="card" style={{ background:'#0f172a', border:'1px solid #1f2937', borderRadius: 12, padding: 16, marginTop: 14 }}>
            {result.error ? (
              <div style={{ color:'#fecaca' }}>Error: {result.error}</div>
            ) : (
              <div style={{ display:'grid', gap:10 }}>
                <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
                  <Badge color="#10b981">Campaign Created</Badge>
                  <span style={{ opacity:.8 }}>Mode: {result.mode.toUpperCase()}</span>
                  <span style={{ opacity:.8 }}>Recipients: {result.summary?.totalRecipients ?? 0}</span>
                </div>
                {stats && (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap: 10 }}>
                    <Stat label="Delivered" value={stats.delivered} color="#60a5fa" />
                    <Stat label="Bounced" value={stats.bounced} color="#f59e0b" />
                    <Stat label="Tracked Base" value={stats.trackedUrlBase} color="#a78bfa" mono />
                  </div>
                )}
                {Array.isArray(result.recipients) && result.recipients.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <h4>Per‑recipient tracking links</h4>
                    <div style={{ overflowX:'auto' }}>
                      <table style={{ width:'100%', borderCollapse:'collapse' }}>
                        <thead>
                          <tr style={{ textAlign:'left' }}>
                            <th style={{ padding:'6px 8px', borderBottom:'1px solid #1f2937' }}>Contact</th>
                            <th style={{ padding:'6px 8px', borderBottom:'1px solid #1f2937' }}>Name</th>
                            <th style={{ padding:'6px 8px', borderBottom:'1px solid #1f2937' }}>Tracked URL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.recipients.map((r, idx) => (
                            <tr key={idx}>
                              <td style={{ padding:'6px 8px', borderBottom:'1px solid #111827' }}>{r.contact}</td>
                              <td style={{ padding:'6px 8px', borderBottom:'1px solid #111827' }}>{r.name || '—'}</td>
                              <td style={{ padding:'6px 8px', borderBottom:'1px solid #111827', fontFamily:'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}>{r.trackedUrl}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {result.qr && (
                  <div style={{ marginTop: 8 }}>
                    <h4>QR code</h4>
                    <img src={result.qr} alt="QR" style={{ width: 180, height: 180, imageRendering:'crisp-edges', border:'1px solid #1f2937', borderRadius: 8 }} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Phished Recipients Section */}
      <div className="card" style={{ background:'#0f172a', border:'1px solid #1f2937', borderRadius: 12, padding: 16, marginTop: 16 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Phished Recipients</h3>
          <button type="button" onClick={loadPhished} disabled={loadingPhished} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #334155', background: 'transparent', color: '#e5e7eb', cursor: 'pointer', fontSize: 12 }}>
            {loadingPhished ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
        {phished.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', opacity: 0.7 }}>
            <p>No one has clicked a phishing link yet.</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>This list updates automatically every 5 seconds.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #1f2937' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 600, color: '#cbd5e1' }}>Name</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, color: '#cbd5e1' }}>Contact</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, color: '#cbd5e1' }}>Department</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, color: '#cbd5e1' }}>Industry</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, color: '#cbd5e1' }}>Clicked At</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, color: '#cbd5e1' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {phished.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #111827', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#0b1220'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#0ea5e9,#7c3aed)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14 }}>
                          {(p.name || p.contact || '?').charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{p.name || '—'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: 13 }}>{p.contact}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <Badge color="#60a5fa">{p.department || '—'}</Badge>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <Badge color="#a78bfa">{p.industry || '—'}</Badge>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 12, opacity: 0.8 }}>
                      {new Date(p.clickedAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <Badge color="#ef4444">Phished</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {phished.length > 0 && (
          <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: 12, color: '#fecaca' }}>
            ⚠️ <strong>{phished.length}</strong> {phished.length === 1 ? 'person has' : 'people have'} clicked a phishing link
          </div>
        )}
      </div>

      {/* Database View Section */}
      <div className="card" style={{ background:'#0f172a', border:'1px solid #1f2937', borderRadius: 12, padding: 16, marginTop: 16 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Database Records</h3>
          <div style={{ display:'flex', gap: 8 }}>
            <button type="button" onClick={() => { setShowDbView(!showDbView); if (!showDbView && !dbView) loadDbView(); }} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #334155', background: showDbView ? 'linear-gradient(135deg,#0ea5e9,#7c3aed)' : 'transparent', color: '#e5e7eb', cursor: 'pointer', fontSize: 12 }}>
              {showDbView ? 'Hide' : 'Show'} Database
            </button>
            {showDbView && (
              <button type="button" onClick={loadDbView} disabled={loadingDb} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #334155', background: 'transparent', color: '#e5e7eb', cursor: 'pointer', fontSize: 12 }}>
                {loadingDb ? 'Loading...' : '🔄 Refresh'}
              </button>
            )}
          </div>
        </div>
        
        {showDbView && (
          <>
            {loadingDb ? (
              <div style={{ textAlign: 'center', padding: '24px', opacity: 0.7 }}>
                <p>Loading database records...</p>
              </div>
            ) : dbView?.error ? (
              <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#fecaca' }}>
                Error: {dbView.error}
              </div>
            ) : dbView?.data && dbView.data.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <div style={{ marginBottom: 12, padding: '8px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 12, color: '#6ee7b7' }}>
                  📊 <strong>{dbView.count}</strong> records in database
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #1f2937', background: '#0b1220' }}>
                      {dbView.table.headers.map((h, idx) => (
                        <th key={idx} style={{ padding: '10px 12px', fontWeight: 600, color: '#cbd5e1', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dbView.table.rows.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #111827', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#0b1220'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} style={{ padding: '10px 12px', fontFamily: cellIdx === 2 || cellIdx === 7 || cellIdx === 8 ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' : undefined, fontSize: cellIdx === 7 || cellIdx === 8 ? 11 : 13, maxWidth: cellIdx === 8 ? 300 : undefined, overflow: cellIdx === 8 ? 'hidden' : 'visible', textOverflow: cellIdx === 8 ? 'ellipsis' : 'clip' }} title={cellIdx === 8 ? String(cell) : undefined}>
                            {String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px', opacity: 0.7 }}>
                <p>No records in database yet.</p>
                <p style={{ fontSize: 12, marginTop: 4 }}>Records will appear here when recipients click phishing links.</p>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .card { transition: transform .25s ease, box-shadow .25s ease; }
        .card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,.35); }
      `}</style>
    </section>
  );
}

function Glow() {
  return (
    <div aria-hidden style={{ position:'absolute', inset: -1, zIndex: 0, pointerEvents:'none' }}>
      <div style={{ position:'absolute', top:-120, left:-80, width:260, height:260, background:'radial-gradient(closest-side, rgba(14,165,233,.35), rgba(14,165,233,0))', filter:'blur(12px)' }} />
      <div style={{ position:'absolute', bottom:-140, right:-100, width:320, height:320, background:'radial-gradient(closest-side, rgba(124,58,237,.35), rgba(124,58,237,0))', filter:'blur(14px)' }} />
    </div>
  );
}

function Badge({ children, color }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 10px', borderRadius:999, background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.08)', color:'#e5e7eb' }}>
      <span style={{ width:8, height:8, borderRadius:999, background: color }} />
      <strong style={{ letterSpacing:.3, fontSize:12 }}>{children}</strong>
    </span>
  );
}

function Stat({ label, value, color, mono }) {
  return (
    <div style={{ border:'1px solid #1f2937', borderRadius:12, padding:12, background:'#0b1220' }}>
      <div className="subtle" style={{ color:'#cbd5e1' }}>{label}</div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
        <span style={{ width:10, height:10, borderRadius:999, background: color }} />
        <span style={{ fontWeight:800, fontFamily: mono? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' : undefined }}>{String(value ?? '—')}</span>
      </div>
    </div>
  );
}


