import React from 'react';
import { api } from '../api/apiClient';
import useFetch from '../hooks/useFetch';

export default function Home() {
  const { data } = useFetch(api.health, []);
  return (
    <section className="page">
      <div className="hero">
        <h1>TRACE</h1>
        <p>AI-powered phishing analysis, awareness, and response.</p>
      </div>
      <div className="status">
        <span className={`dot ${data ? 'ok' : 'warn'}`} /> Backend {data ? 'Online' : 'Connecting...'}
      </div>
    </section>
  );
}
