import React, { useEffect, useState } from 'react';
import { api } from '../api/apiClient';

export default function Analyze() {
  const [subject, setSubject] = useState('Urgent: Verify your account and send money');
  const [body, setBody] = useState('Hi,\n\nThis is a final notice. Your account will be closed today. Verify now at http://bad-actor.com/reset and review the attached invoice.docm.\n\nThanks, Security Team');
  const [fromHeader, setFromHeader] = useState('Security Team <security@company.com>');
  const [urlsText, setUrlsText] = useState('http://bad-actor.com/reset');
  const [attachments, setAttachments] = useState([{ filename: 'invoice.docm', mime: 'application/vnd.ms-word', size: 20480 }]);
  // channel removed in UI; backend treats it as optional

  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState('');
  const [explainLoading, setExplainLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const urlsFromBody = Array.from((body.match(/https?:\/\/[\w.-]+[^\s\)]*/gi) || []));
    if (urlsFromBody.length) setUrlsText(urlsFromBody.join('\n'));
    if (/invoice\.docm/i.test(body)) {
      setAttachments([{ filename: 'invoice.docm', mime: 'application/vnd.ms-word', size: 20480 }]);
    }
  }, [body]);

  async function onAnalyze(e) {
    e.preventDefault();
    setLoading(true);
    setShowOverlay(true);
    setResult(null);
    setSteps([
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
    ]);
    setExplainLoading(true);

    const urlsManual = urlsText.split(/\n|\r/).map(s => s.trim()).filter(Boolean);
    const urls = Array.from(new Set(urlsManual));
    const cleanAttachments = attachments.filter(a => a && (a.filename || a.mime || a.size));

    const payload = {
      headers: { From: fromHeader, Subject: subject },
      bodyText: `${subject}\n\n${body}`,
      urls,
      attachmentsMeta: cleanAttachments.map(a => ({ filename: a.filename || '', mime: a.mime || '', size: Number(a.size || 0) })),
      scenario: scenario || undefined
    };

    // Kick off API but reveal steps gradually
    const promise = api.analysis.runEmail(payload);
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < (steps[i]?.sub?.length || 0); j++) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setTimeout(r, 750 + Math.floor(Math.random()*250)));
        setSteps(prev => prev.map(s => s.index === i + 1 ? { ...s, sub: s.sub.map((ss, idx) => idx===j? { ...ss, done:true } : ss) } : s));
      }
      setSteps(prev => prev.map(s => s.index === i + 1 ? { ...s, done: true } : s));
    }
    const res = await promise;
    // Simulate separate AI explanation reveal
    await new Promise(r => setTimeout(r, 1200 + Math.floor(Math.random()*600)));
    setResult(res);
    setExplainLoading(false);
    setLoading(false);
    setShowOverlay(false);
  }

  return (
    <section className="page">
      <h2 style={{ marginBottom: 8 }}>Analyze Email</h2>
      <div className="card" style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <strong>Load Scenario:</strong>
        {['metadata','url','homograph','punycode','nlp','attachment','clean'].map(k => (
          <button key={k} type="button" onClick={() => { presetScenario({ setSubject, setBody, setFromHeader, setUrlsText, setAttachments }, k); setScenario(k); }} style={{ border: scenario===k? '2px solid #4f46e5' : '1px solid #ccc' }}>{
            ({metadata:'1) Metadata scam',url:'2) URL scam',homograph:'3) Homograph URL',punycode:'4) Punycode apple',nlp:'5) NLP scam',attachment:'6) Attachment scam',clean:'7) No scam'})[k]
          }</button>
        ))}
      </div>
      <form className="card" onSubmit={onAnalyze} style={{ display: 'grid', gap: 12, border: '1px solid #e5e7eb', borderRadius: 12 }}>
        <h3>Headers</h3>
        <label>From<input placeholder="Security Team <security@company.com>" value={fromHeader} onChange={(e) => setFromHeader(e.target.value)} /></label>

        <h3>Content</h3>
        <label>Subject<input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Urgent: Verify your account and send money" /></label>
        <label>Body<textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} placeholder={`Explain the context, include URLs like http://bad-actor.com/reset and mention files like invoice.docm so they are auto-detected.`} /></label>

        <h3>URLs</h3>
        <label>Derived URLs (edit if needed)
          <textarea rows={4} placeholder={`http://bad-actor.com/reset\nhttps://xn--pple-43d.com/login`} value={urlsText} onChange={(e) => setUrlsText(e.target.value)} />
        </label>

        <h3>Attachments</h3>
        {attachments.map((a, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 120px 1fr 100px 1fr', alignItems: 'center', gap: 8, padding: '8px 10px', border: '1px dashed #e5e7eb', borderRadius: 8, marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>Filename:</span>
            <input placeholder="invoice.docm" value={a.filename} onChange={(e) => setAttachments(attachments.map((x,i)=> i===idx? { ...x, filename: e.target.value }: x))} />
            <span style={{ fontWeight: 600 }}>MIME:</span>
            <input placeholder="application/vnd.ms-word" value={a.mime} onChange={(e) => setAttachments(attachments.map((x,i)=> i===idx? { ...x, mime: e.target.value }: x))} />
            <span style={{ fontWeight: 600 }}>Size:</span>
            <input type="number" placeholder="bytes" value={a.size} onChange={(e) => setAttachments(attachments.map((x,i)=> i===idx? { ...x, size: e.target.value }: x))} />
          </div>
        ))}
        <div style={{ display:'flex', gap: 8, marginBottom: 12 }}>
          <button type="button" onClick={() => setAttachments([...attachments, { filename:'', mime:'', size:0 }])}>Add Attachment</button>
          <button type="button" onClick={() => setAttachments(attachments.slice(0, -1))} disabled={attachments.length<=1}>Remove Last</button>
        </div>

        <div style={{ marginTop: 12, display:'flex', gap:8, flexWrap:'wrap' }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 14px' }}>{loading ? 'Analyzing…' : 'Analyze'}</button>
        </div>
      </form>
      {showOverlay && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(2px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:'90%', maxWidth:900, background:'#0b1220', color:'#e5e7eb', border:'1px solid #1f2937', borderRadius:12, padding:16, boxShadow:'0 10px 30px rgba(0,0,0,.5)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h3 style={{ margin:0 }}>Analyzing Domain and Mail Metadata</h3>
              <span style={{ opacity:.8 }}>{loading?'Analyzing…':'Done'}</span>
            </div>
            <div style={{ display:'grid', gap:12, marginTop:12 }}>
              {steps.map(s => (
                <div key={s.index} style={{ border:'1px solid #1f2937', borderRadius:10, padding:12, background:'#111827' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:12, height:12, borderRadius:6, background:s.done?'#22c55e':'#374151', display:'inline-block' }} />
                    <strong>{s.label}</strong>
                    <span style={{ marginLeft:'auto', opacity:.7 }}>{s.done?'Complete':'In progress'}</span>
                  </div>
                  {s.sub && (
                    <ul style={{ listStyle:'none', padding:0, margin:'8px 0 0 0' }}>
                      {s.sub.map((ss, idx) => (
                        <li key={idx} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0' }}>
                          <span style={{ width:10, height:10, borderRadius:5, background:ss.done?'#22c55e':'#4b5563', display:'inline-block' }} />
                          <span>{ss.label}</span>
                          {!ss.done && <span className="skeleton" style={{ marginLeft:'auto', width:100, height:10, background:'linear-gradient(90deg,#1f2937,#374151,#1f2937)', backgroundSize:'200% 100%', animation:'pulse 1.2s infinite' }} />}
                          {ss.done && <span style={{ marginLeft:'auto' }}>✅</span>}
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
      {result && (
        <div className="card" style={{ border: '1px solid #e5e7eb', borderRadius: 12 }}>
          <h3>Threat Assessment</h3>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: 110, height: 110, borderRadius: '50%', background: `conic-gradient(${result.riskCategory==='high'?'#ef4444':result.riskCategory==='medium'?'#f59e0b':'#10b981'} ${result.threatScore||0}%, #e5e7eb 0)` , display:'grid', placeItems:'center' }}>
              <div style={{ width: 78, height: 78, borderRadius: '50%', background:'#fff', display:'grid', placeItems:'center', fontWeight:700, color:'#111827' }}>{Math.round(result.threatScore||0)}</div>
            </div>
            <div>
              <div style={{ padding: '4px 10px', borderRadius: 999, display:'inline-block', background: result.riskCategory==='high'?'#fee2e2':result.riskCategory==='medium'?'#fef9c3':'#dcfce7', color: '#111827' }}>{result.riskCategory.toUpperCase()}</div>
              <p style={{ marginTop: 6, opacity: 0.75 }}>Assessment generated from sender, URL, punycode, NLP, and attachment modules.</p>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <h4 style={{ margin: '8px 0' }}>AI explanation</h4>
            {explainLoading ? (
              <div style={{ display:'grid', gap:8 }}>
                <div style={{ height: 12, background:'#f3f4f6', borderRadius:6, animation:'pulse 1.2s infinite' }} />
                <div style={{ height: 12, background:'#f3f4f6', borderRadius:6, animation:'pulse 1.2s infinite' }} />
                <div style={{ height: 12, background:'#f3f4f6', borderRadius:6, animation:'pulse 1.2s infinite' }} />
                <div style={{ height: 12, background:'#f3f4f6', borderRadius:6, animation:'pulse 1.2s infinite' }} />
              </div>
            ) : (
              <pre style={{ whiteSpace: 'pre-wrap', background: '#f9fafb', padding: 12, borderRadius: 8 }}>{result.xaiExplanation}</pre>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%{opacity:.6} 50%{opacity:1} 100%{opacity:.6} }
        @keyframes progress { 0%{transform: translateX(-80%)} 50%{transform: translateX(10%)} 100%{transform: translateX(120%)} }
      `}</style>
    </section>
  );
}

function presetScenario(api, kind) {
  const { setSubject, setBody, setFromHeader, setUrlsText, setAttachments } = api;
  switch(kind) {
    case 'metadata':
      setSubject('Payroll Update');
      setBody('Please review attached payroll changes. Visit https://company.example.com/policy for details.');
      setFromHeader('HR <hr@payroll.example.com>');
      setUrlsText('https://company.example.com/policy');
      setAttachments([{ filename: 'changes.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 102400 }]);
      break;
    case 'url':
      setSubject('Reset your password');
      setBody('Please reset your password immediately using the following link: http://bad-actor.com/reset');
      setFromHeader('IT Support <it@example.com>');
      setUrlsText('http://bad-actor.com/reset');
      setAttachments([{ filename: '', mime: '', size: 0 }]);
      break;
    case 'homograph':
      setSubject('Your Apple receipt');
      setBody('Check your receipt link: http://appⅼe.com/login');
      setFromHeader('Apple Support <support@apple.com>');
      setUrlsText('http://appⅼe.com/login');
      setAttachments([{ filename: '', mime: '', size: 0 }]);
      break;
    case 'punycode':
      setSubject('Apple ID locked');
      setBody('Verify your Apple ID: http://xn--pple-43d.com/login');
      setFromHeader('Apple <no-reply@apple.com>');
      setUrlsText('http://xn--pple-43d.com/login');
      setAttachments([{ filename: '', mime: '', size: 0 }]);
      break;
    case 'nlp':
      setSubject('URGENT: Final Notice');
      setBody('Verify your account now or it will be closed. Send a gift card code.');
      setFromHeader('Security Team <sec@company.com>');
      setUrlsText('');
      setAttachments([{ filename: '', mime: '', size: 0 }]);
      break;
    case 'attachment':
      setSubject('Invoice Attached');
      setBody('Please pay the attached invoice.docm today.');
      setFromHeader('Billing <billing@vendor.com>');
      setUrlsText('https://vendor.com/help');
      setAttachments([{ filename: 'invoice.docm', mime: 'application/vnd.ms-word', size: 20480 }]);
      break;
    case 'clean':
      setSubject('Team Lunch');
      setBody('Let’s meet at 12 PM for lunch. See menu: https://company.com/menu');
      setFromHeader('Manager <manager@company.com>');
      setUrlsText('https://company.com/menu');
      setAttachments([{ filename: '', mime: '', size: 0 }]);
      break;
    default:
      break;
  }
}
