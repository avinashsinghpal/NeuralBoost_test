const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export const api = {
  health: () => request('/health'),
  analysis: {
    list: () => request('/analysis'),
    run: (payload) => request('/analysis', { method: 'POST', body: JSON.stringify(payload) })
  },
  awareness: () => request('/awareness'),
  dashboard: () => request('/dashboard'),
  channels: () => request('/channels')
};
