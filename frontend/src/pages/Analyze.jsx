import React, { useState } from 'react';
import { api } from '../api/apiClient';

export default function Analyze() {
  const [subject, setSubject] = useState('Urgent: Verify your account');
  const [body, setBody] = useState('Click the link to verify your account.');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onAnalyze(e) {
    e.preventDefault();
    setLoading(true);
    const res = await api.analysis.run({ subject, body });
    setResult(res.result);
    setLoading(false);
  }

  return (
    <section className="page">
      <h2>Analyze Email</h2>
      <form className="card" onSubmit={onAnalyze}>
        <label>Subject<input value={subject} onChange={(e) => setSubject(e.target.value)} /></label>
        <label>Body<textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} /></label>
        <button type="submit" disabled={loading}>{loading ? 'Analyzing…' : 'Analyze'}</button>
      </form>
      {result && (
        <div className="card">
          <h3>Classification</h3>
          <p><b>Label:</b> {result.label}</p>
          <p><b>Score:</b> {result.score}</p>
          <div className="bar">
            <div className={`bar-fill ${result.label}`} style={{ width: `${result.score}%` }} />
          </div>
        </div>
      )}
    </section>
  );
}
