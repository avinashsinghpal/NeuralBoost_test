import React from 'react';
import { api } from '../api/apiClient';
import useFetch from '../hooks/useFetch';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

function monthName(idx) { return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][idx-1]; }

export default function Dashboard() {
  const { data, loading } = useFetch(api.dashboard, []);

  const trend = (data?.trend || []).map(d => ({ name: monthName(d.month), threats: d.threats }));
  const radial = [
    { name: 'Safe', value: Math.max(0, (data?.totals?.analyzed || 0) - (data?.totals?.threats || 0)), fill: '#30d158' },
    { name: 'Threats', value: data?.totals?.threats || 0, fill: '#ff3b30' }
  ];

  return (
    <section className="page">
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
        </div>
      )}
    </section>
  );
}
