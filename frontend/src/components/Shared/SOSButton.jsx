import React, { useState } from 'react';
import { api } from '../../api/apiClient';

export default function SOSButton() {
  const [busy, setBusy] = useState(false);

  async function handleSOS() {
    if (busy) return;
    const confirmSOS = window.confirm('Emergency SOS: This will report and trigger defensive actions. Proceed?');
    if (!confirmSOS) return;
    setBusy(true);
    try {
      const payload = {
        user: 'anonymous',
        contact: {},
        incident: {}
      };
      const res = await api.sos.trigger(payload);

      // Copy prefill text for portal convenience
      const prefillText = JSON.stringify(res?.guidance?.prefill || {}, null, 2);
      try { await navigator.clipboard.writeText(prefillText); } catch (_e) {}

      // Open cybercrime portal in new tab
      const portalUrl = res?.guidance?.portal?.url || 'https://www.cybercrime.gov.in/';
      window.open(portalUrl, '_blank', 'noopener,noreferrer');

      // Offer to place a call to 1930
      const callNow = window.confirm('Do you want to call India Cybercrime Helpline (1930) now?');
      if (callNow) {
        const tel = res?.guidance?.helpline?.tel || 'tel:1930';
        window.location.href = tel;
      } else {
        // Create a temporary link so user can click later if needed
        const a = document.createElement('a');
        a.href = res?.guidance?.helpline?.tel || 'tel:1930';
        a.textContent = 'Call 1930';
        a.style.display = 'none';
        document.body.appendChild(a);
        setTimeout(() => { try { document.body.removeChild(a); } catch (_e) {} }, 3000);
      }
    } catch (e) {
      alert('Failed to trigger SOS. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleSOS}
      style={{
        position: 'fixed',
        right: '16px',
        bottom: '16px',
        zIndex: 1000,
        background: '#ff3b30',
        color: '#fff',
        border: 'none',
        borderRadius: '999px',
        padding: '12px 16px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        fontWeight: 700
      }}
      aria-label="Emergency SOS"
      title="Emergency SOS"
      disabled={busy}
    >
      {busy ? 'SOS…' : 'SOS'}
    </button>
  );
}
