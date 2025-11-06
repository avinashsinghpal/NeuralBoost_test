import React from 'react';
import { api } from '../api/apiClient';
import useFetch from '../hooks/useFetch';

export default function Awareness() {
  const { data, loading } = useFetch(api.awareness, []);
  return (
    <section className="page two-col">
      <div className="card">
        <h2>Security Tips</h2>
        {loading ? 'Loading…' : (
          <ul>
            {data?.tips?.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        )}
      </div>
      <div className="card">
        <h2>Training Modules</h2>
        {loading ? 'Loading…' : (
          <ul>
            {data?.trainings?.map((t) => (
              <li key={t.id}>{t.title} · {t.durationMin} min</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
