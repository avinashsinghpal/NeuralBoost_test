// ./components/Awareness/BankPhishingAwareness.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function BankPhishingAwareness() {
  const navigate = useNavigate();

  const cards = [
    { id: "sbi", title: "SBI Online", emoji: "🏦", path: "sbi" },
    { id: "canara", title: "Canara Bank", emoji: "💠", path: "canara" },
  ];

  return (
    <div style={{ maxWidth: 1080, margin: "24px auto", padding: 16 }}>
      <h2>Banking site simulations (educational)</h2>
      <p style={{ color: "#555", fontSize: 14, marginBottom: 12 }}>
        Learn to spot red flags like deceptive URLs, pressure tactics, and why a lock icon alone does not prove legitimacy.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 16 }}>
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => navigate(c.path)}        // relative to /awareness
            style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12, background: "#fff", cursor: "pointer", textAlign: "left" }}
          >
            <div style={{ fontSize: 28 }}>{c.emoji}</div>
            <div style={{ fontWeight: 700, marginTop: 8 }}>{c.title}</div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>Open simulation</div>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 16, fontSize: 13, color: "#374151" }}>
        Tips: Type the address or use a trusted bookmark, hover links to preview true destinations, and don’t trust the padlock alone.
      </div>
    </div>
  );
}
