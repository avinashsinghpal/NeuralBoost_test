import React from 'react';
import { NavLink } from 'react-router-dom';
import { api } from '../api/apiClient';
import useFetch from '../hooks/useFetch';

export default function Home() {
  const { data } = useFetch(api.health, []);
  return (
    <section className="page" id="hero" aria-label="Hero">
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, padding: '36px 20px', background: 'radial-gradient(1200px 380px at 10% -10%, rgba(14,165,233,0.35) 0, rgba(14,165,233,0) 60%), radial-gradient(900px 300px at 90% 0%, rgba(124,58,237,0.35) 0, rgba(124,58,237,0) 60%), linear-gradient(180deg, #0b1020 0%, #0b1226 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)' }}>
        <GridOverlay />
        <ParticleCanvas />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', color: '#a7b0c0', fontWeight: 700, fontSize: 12, letterSpacing: 0.6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: data ? '#30d158' : '#f59e0b', boxShadow: `0 0 0 6px ${data ? 'rgba(48,209,88,0.15)' : 'rgba(245,158,11,0.15)'}` }} />
            {data ? 'Backend Online' : 'Backend Connecting…'}
          </div>
          <h1 style={{ margin: '14px 0 8px', color: '#ffffff', fontSize: 38, lineHeight: '44px', letterSpacing: 0.2 }}>TRACE Cyber Defense</h1>
          <p style={{ margin: 0, color: '#a7b0c0' }}>Detect. Educate. Respond. Shield your organization from phishing threats.</p>

          <div style={{ marginTop: 18, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <NavLink to="/analyze" style={{ textDecoration: 'none' }}>
              <button style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 14px', fontWeight: 800, boxShadow: '0 10px 24px rgba(124,58,237,0.35)', cursor: 'pointer' }}>Analyze Email</button>
            </NavLink>
            <NavLink to="/dashboard" style={{ textDecoration: 'none' }}>
              <button style={{ background: 'transparent', color: '#e5e7eb', border: '1px solid rgba(229,231,235,0.2)', borderRadius: 10, padding: '10px 14px', fontWeight: 800, cursor: 'pointer' }}>View Dashboard</button>
            </NavLink>
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ minWidth: 140, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', color: '#e5e7eb', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>+25K</div>
              <div className="subtle">Emails analyzed</div>
            </div>
            <div style={{ minWidth: 140, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', color: '#e5e7eb', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>98%</div>
              <div className="subtle">Phish detection</div>
            </div>
            <div style={{ minWidth: 140, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', color: '#e5e7eb', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>1930</div>
              <div className="subtle">SOS helpline ready</div>
            </div>
          </div>
        </div>
        <ShieldDecoration />
      </div>

      <div className="grid3" style={{ marginTop: 16 }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="subtle" style={{ fontWeight: 700, color: '#7c3aed' }}>Real‑time Threat Intel</div>
          <h3 style={{ marginTop: 6 }}>Spot phishing patterns before they spread</h3>
          <p className="subtle">Genome‑style analysis surfaces intent, sender anomalies, and risky URLs.</p>
        </div>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="subtle" style={{ fontWeight: 700, color: '#0ea5e9' }}>RakshaAI Assistant</div>
          <h3 style={{ marginTop: 6 }}>Learn how to identify fake emails</h3>
          <p className="subtle">Ask RakshaAI for step‑by‑step guidance and safety checklists.</p>
        </div>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="subtle" style={{ fontWeight: 700, color: '#ff3b30' }}>SOS Response</div>
          <h3 style={{ marginTop: 6 }}>One‑tap emergency reporting</h3>
          <p className="subtle">Instant defensive actions and links to India’s cybercrime helpline/portal.</p>
        </div>
      </div>
    </section>
  );
}

function GridOverlay() {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

function ShieldDecoration() {
  return (
    <div aria-hidden style={{ position: 'absolute', right: -30, bottom: -24, width: 220, height: 220, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.35))', opacity: 0.9 }}>
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>
        <path d="M100 10 L170 40 L170 100 C170 140 140 170 100 190 C60 170 30 140 30 100 L30 40 Z" fill="url(#g1)" opacity="0.9" />
        <path d="M100 28 L150 48 L150 98 C150 128 130 150 100 166 C70 150 50 128 50 98 L50 48 Z" fill="#0b1020" opacity="0.65" />
        <circle cx="100" cy="86" r="28" fill="none" stroke="#a78bfa" strokeWidth="4" />
        <path d="M88 86 L98 96 L120 74" fill="none" stroke="#34d399" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ParticleCanvas() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const particles = [];

    function init() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const count = Math.floor((w * h) / 14000); // density-based
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: 1 + Math.random() * 1.6
        });
      }
    }

    function draw(t) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        init();
      }
      ctx.clearRect(0,0,w,h);
      // draw connections first (thin lines)
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx*dx + dy*dy;
          if (d2 < 120*120) {
            const alpha = Math.max(0, 0.25 - d2 / (120*120) * 0.25);
            const hue = 200 + 60 * Math.sin(t/3000 + (i*0.13));
            ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        const hue = 190 + 80 * Math.sin((t/2000) + p.x * 0.002 + p.y * 0.002);
        ctx.fillStyle = `hsla(${hue}, 90%, 70%, 0.9)`;
        ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.6)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // move
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
      }
      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    const onResize = () => { init(); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', opacity: 0.9, pointerEvents: 'none' }}
      aria-hidden
    />
  );
}
