const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  console.log('[API] Request:', options.method || 'GET', url);
  
  try {
    const res = await fetch(url, {
      headers: { 
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options,
    });
    
    console.log('[API] Response:', res.status, res.statusText);
    
    if (!res.ok) {
      const errorText = await res.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || `HTTP ${res.status}` };
      }
      const errorMsg = errorData.error || errorData.message || `API ${res.status}`;
      console.error('[API] Error:', errorMsg);
      throw new Error(errorMsg);
    }
    return res.json();
  } catch (err) {
    console.error('[API] Fetch error:', err);
    if (err.message && err.message.includes('Failed to fetch')) {
      throw new Error(`Cannot connect to backend at ${BASE_URL}. Make sure the backend is running on port 5001.`);
    }
    if (err.message) throw err;
    throw new Error(`Network error: ${err.message || 'Failed to connect to backend'}`);
  }
}

export const api = {
  health: () => request('/health'),
  analysis: {
    list: () => request('/analysis'),
    runLegacy: (payload) => request('/analysis', { method: 'POST', body: JSON.stringify(payload) }),
    runEmail: (payload) => request('/analyze/email', { method: 'POST', body: JSON.stringify(payload) })
  },
  simulation: {
    send: (payload) => request('/simulation/send', { method: 'POST', body: JSON.stringify(payload) }),
    getPhished: () => request('/simulation/phished'),
    getAllPhishedDetails: () => request('/simulation/phished/all'),
    getPhishedByDepartment: () => request('/simulation/phished/by-department'),
    getTemplateOptions: (type) => request(`/simulation/template-options/${type}`),
  },
  awareness: () => request('/awareness'),
  dashboard: () => request('/dashboard'),
  channels: () => request('/channels'),
  sos: {
    trigger: (payload) => request('/sos/trigger', { method: 'POST', body: JSON.stringify(payload) }),
    state: () => request('/sos/state')
  },
  chat: {
    ask: (prompt) => request('/chat/ask', { method: 'POST', body: JSON.stringify({ prompt }) })
  }
};
