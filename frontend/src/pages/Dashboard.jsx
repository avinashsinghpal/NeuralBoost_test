import React from 'react';
import { api } from '../api/apiClient';
import useFetch from '../hooks/useFetch';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import ParticleCanvas from '../components/Shared/ParticleCanvas';

function monthName(idx) { return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][idx-1]; }

export default function Dashboard() {
  const { data, loading } = useFetch(api.dashboard, []);

  const trend = (data?.trend || []).map(d => ({ name: monthName(d.month), threats: d.threats }));
  const radial = [
    { name: 'Safe', value: Math.max(0, (data?.totals?.analyzed || 0) - (data?.totals?.threats || 0)), fill: '#30d158' },
    { name: 'Threats', value: data?.totals?.threats || 0, fill: '#ff3b30' }
  ];

  const dept = (data?.departments && data.departments.length ? data.departments : [
    { name: 'Finance', clickedPct: 60 },
    { name: 'Tech', clickedPct: 15 }
  ]).map(d => ({ ...d }));

  const geo = (data?.geoSources && data.geoSources.length ? data.geoSources : [
    { lat: 28.6139, lon: 77.2090, count: 18, region: 'India' },
    { lat: 40.7128, lon: -74.0060, count: 9, region: 'NA' }
  ]);

  function projectEquirectangular(lat, lon, width, height) {
    const x = (lon + 180) * (width / 360);
    const y = (90 - lat) * (height / 180);
    return { x, y };
  }

  function labelForCountry(g) {
    // Very light mapping based on approximate coordinates
    const { lat, lon, region } = g;
    if (region === 'India' || (lat > 6 && lat < 36 && lon > 68 && lon < 98)) return 'India';
    // NYC region
    if (Math.abs(lat - 40.7128) < 3 && Math.abs(lon + 74.0060) < 3) return 'United States';
    // London region
    if (Math.abs(lat - 51.5074) < 3 && Math.abs(lon + 0.1278) < 3) return 'United Kingdom';
    // Singapore region
    if (Math.abs(lat - 1.3521) < 3 && Math.abs(lon - 103.8198) < 3) return 'Singapore';
    // Sydney region
    if (Math.abs(lat + 33.8688) < 3 && Math.abs(lon - 151.2093) < 3) return 'Australia';
    // São Paulo region
    if (Math.abs(lat + 23.5505) < 3 && Math.abs(lon + 46.6333) < 3) return 'Brazil';
    return region || 'Unknown';
  }

  return (
    <section className="page" style={{ position: 'relative', zIndex: 1 }}>
      <ParticleCanvas />
      <div style={{ position: 'relative', zIndex: 1 }}>
      <h2>Threat Dashboard</h2>
      {loading && 'Loading…'}
      {!loading && (
        <div className="grid3">
          <div className="card">
            <h3>Monthly Threats</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trend} margin={{ top: 10, right: 16, bottom: 0, left: -20 }}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="threats" stroke="#7c3aed" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3>Genome Ring</h3>
            <div className="subtle">Unique radial split showing safe vs threats</div>
            <ResponsiveContainer width="100%" height={220}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="90%" barSize={18} data={radial} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, (data?.totals?.analyzed || 1)]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="legend-row">
              {radial.map(r => (
                <span key={r.name} className="legend-pill" style={{ background: r.fill }}>{r.name}: {r.value}</span>
              ))}
            </div>
          </div>
          <div className="card stats">
            <div>
              <div className="stat-num">{data?.totals?.analyzed}</div>
              <div className="stat-label">Analyzed</div>
            </div>
            <div>
              <div className="stat-num danger">{data?.totals?.threats}</div>
              <div className="stat-label">Threats</div>
            </div>
            <div>
              <div className="stat-num warn">{data?.totals?.sosTriggers}</div>
              <div className="stat-label">SOS Triggers</div>
            </div>
          </div>
          <div className="card">
            <h3>Behavioral Analytics</h3>
            <div className="subtle">Department-wise vulnerability (clicked links)</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dept} margin={{ top: 10, right: 16, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="%" domain={[0, 100]} allowDecimals={false} />
                <Tooltip formatter={(v) => [`${v}%`, 'Clicked']} />
                <Legend />
                <Bar dataKey="clickedPct" name="Clicked" fill="#f59e0b" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="legend-row">
              {dept.map(d => (
                <span key={d.name} className="legend-pill" style={{ background: '#f59e0b' }}>{d.name}: {d.clickedPct}% clicked</span>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Real-Time Global Threat Map</h3>
            <div className="subtle">Phishing attack sources by region (simulated)</div>
            <ThreatMapCard geo={geo} project={projectEquirectangular} labelForCountry={labelForCountry} />
            <div className="legend-row">
              {geo.slice(0,5).map((g, i) => (
                <span key={i} className="legend-pill" style={{ background: '#111827', color: '#fff' }}>{g.region}: {g.count}</span>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
}

function WorldCanvas({ geo, project }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    function drawFrame(t) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
      }
      // background glow grid
      ctx.clearRect(0,0,w,h);
      ctx.fillStyle = '#0b1020';
      ctx.fillRect(0,0,w,h);
      // subtle grid
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      const step = Math.max(40, Math.min(80, w/12));
      for (let x = 0; x < w; x += step) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
      for (let y = 0; y < h; y += step) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

      // draw pulsing points
      geo.forEach((g, idx) => {
        const { x, y } = project(g.lat, g.lon, w, h);
        const base = Math.max(3, Math.min(10, 3 + g.count * 0.4));
        const pulse = (Math.sin((t/500) + idx) + 1) * 0.5; // 0..1
        const r = base + pulse * 4;
        const hue = 260 - Math.min(200, g.count * 6);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2);
        ctx.fillStyle = `hsla(${hue}, 90%, 60%, 0.8)`;
        ctx.fill();
        // outer glow
        const grad = ctx.createRadialGradient(x,y,0,x,y,r*2.2);
        grad.addColorStop(0, `hsla(${hue}, 100%, 65%, 0.35)`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(x,y,r*2.2,0,Math.PI*2); ctx.fill();
      });

      raf = requestAnimationFrame(drawFrame);
    }
    raf = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(raf);
  }, [geo, project]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: 260, display: 'block' }} />;
}

function ThreatMapCard({ geo, project, labelForCountry }) {
  const wrapperRef = React.useRef(null);
  const [hover, setHover] = React.useState(null); // { x, y, label, count }

  function handleHover(evt) {
    const canvas = evt.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    let nearest = null;
    let bestDist2 = Infinity;
    geo.forEach((g, idx) => {
      const p = project(g.lat, g.lon, w, h);
      const dx = p.x - x;
      const dy = p.y - y;
      const d2 = dx*dx + dy*dy;
      if (d2 < bestDist2) {
        bestDist2 = d2;
        nearest = { p, g };
      }
    });
    if (!nearest) { setHover(null); return; }
    const radius = 18; // hover radius
    if (bestDist2 <= radius*radius) {
      setHover({ x, y, label: labelForCountry(nearest.g), count: nearest.g.count });
    } else {
      setHover(null);
    }
  }

  function clearHover() { setHover(null); }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%', height: 260, borderRadius: 8, overflow: 'hidden', background: 'radial-gradient(1200px 400px at 20% 0%, #0ea5e9 0, transparent 60%), radial-gradient(800px 300px at 80% 20%, #7c3aed 0, transparent 60%), #0b1020' }}>
      <WorldCanvas geo={geo} project={project} />
      {/* transparent overlay to capture mouse events */}
      <canvas
        onMouseMove={handleHover}
        onMouseLeave={clearHover}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', background: 'transparent', cursor: 'crosshair' }}
      />
      {hover && (
        <div style={{ position: 'absolute', left: Math.max(8, Math.min(hover.x + 12, (wrapperRef.current?.clientWidth || 0) - 160)), top: Math.max(8, hover.y + 12), background: '#ffffff', color: '#111827', padding: '6px 8px', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', pointerEvents: 'none', fontSize: 12, fontWeight: 600 }}>
          {hover.label} · {hover.count}
        </div>
      )}
    </div>
  );
}

