import React, { useMemo, useRef, useState } from 'react';
import { api } from '../../api/apiClient';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'I am RakshaAI. Ask me how to spot fake emails, verify links, or what to do if you clicked.' }
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  const containerStyle = useMemo(() => ({
    position: 'fixed',
    right: '16px',
    bottom: '80px', // sit above SOS button
    zIndex: 1000
  }), []);

  async function send() {
    const prompt = input.trim();
    if (!prompt || busy) return;
    setBusy(true);
    setMessages((m) => [...m, { role: 'user', text: prompt }]);
    setInput('');
    try {
      const res = await api.chat.ask(prompt);
      const reply = res?.reply || 'Sorry, I did not catch that.';
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    } catch (_e) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Network error. Please try again.' }]);
    } finally {
      setBusy(false);
      setTimeout(() => { try { endRef.current?.scrollIntoView({ behavior: 'smooth' }); } catch (_e) {} }, 50);
    }
  }

  function onKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function renderMessage(text, role) {
    // Simple formatting: bullet lists and preserved line breaks
    const lines = String(text).split('\n');
    const groups = [];
    let currentList = null;
    for (const line of lines) {
      const trimmed = line.trim();
      const isBullet = /^([•\-\*]|\d+\))/i.test(trimmed);
      if (isBullet) {
        if (!currentList) currentList = [];
        currentList.push(trimmed.replace(/^([•\-\*]|\d+\))\s*/, ''));
      } else {
        if (currentList) { groups.push({ type: 'list', items: currentList }); currentList = null; }
        if (trimmed.length) groups.push({ type: 'p', text: trimmed });
      }
    }
    if (currentList) groups.push({ type: 'list', items: currentList });

    return (
      <div style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial', fontSize: 14, lineHeight: '20px', whiteSpace: 'pre-wrap' }}>
        {groups.length === 0 && <span>{text}</span>}
        {groups.map((g, idx) => g.type === 'p' ? (
          <p key={idx} style={{ margin: '0 0 6px 0' }}>{g.text}</p>
        ) : (
          <ul key={idx} style={{ paddingLeft: 18, margin: '0 0 6px 0' }}>
            {g.items.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        ))}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            background: '#1f2937',
            color: '#fff',
            border: 'none',
            borderRadius: '999px',
            padding: '10px 14px',
            boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            fontWeight: 700,
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial'
          }}
          aria-label="Open RakshaAI chatbot"
          title="Open RakshaAI chatbot"
        >
          RakshaAI
        </button>
      )}
      {open && (
        <div style={{ width: 320, height: 380, background: '#ffffff', borderRadius: 12, boxShadow: '0 12px 32px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ background: '#111827', color: '#fff', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: 700, fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial' }}>RakshaAI</div>
            <button onClick={() => setOpen(false)} style={{ background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }} aria-label="Close chatbot">×</button>
          </div>
          <div style={{ flex: 1, padding: 12, overflowY: 'auto', background: '#f9fafb' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 10, display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '85%', padding: '8px 10px', borderRadius: 10, background: m.role === 'user' ? '#7c3aed' : '#ffffff', color: m.role === 'user' ? '#fff' : '#111827', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  {renderMessage(m.text, m.role)}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div style={{ padding: 10, borderTop: '1px solid #e5e7eb', background: '#fff' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                rows={1}
                placeholder="Ask RakshaAI how to spot fake emails…"
                style={{ flex: 1, resize: 'none', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb', fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial' }}
                aria-label="Chat prompt"
              />
              <button onClick={send} disabled={busy || !input.trim()} style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontWeight: 700, fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial' }}>{busy ? '…' : 'Send'}</button>
            </div>
            <div style={{ marginTop: 6, fontSize: 12, color: '#6b7280', fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial' }}>Try: "How to spot fake emails"</div>
          </div>
        </div>
      )}
    </div>
  );
}


