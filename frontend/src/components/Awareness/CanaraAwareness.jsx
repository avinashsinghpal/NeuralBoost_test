// ./components/Awareness/CanaraAwareness.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CanaraAwareness() {
  const navigate = useNavigate();
  const [hover, setHover] = useState("");
  const accent = "#0ea5e9";
  const shownDomain = "www.canarabank.in";
  const deceptive = "canarabank.in.customer-verify-secure.net/login/validate"; // training-only string

  const Box = ({ title, children }) => (
    <div style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 10, background: "#ffffff" }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: "#374151" }}>{children}</div>
    </div>
  );

  return (
    <div style={{ marginTop: 16 }}>
      {/* Local nav */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <button onClick={() => navigate(-1)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}>
          ← Back
        </button>
        <Link to="/awareness" style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", textDecoration: "none", color: "#111827" }}>
          Catalog
        </Link>
        <Link to="/awareness/sbi" style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e7eb", textDecoration: "none", color: "#111827" }}>
          SBI
        </Link>
        <Link to="/awareness/canara" style={{ padding: "6px 10px", borderRadius: 8, background: accent, color: "#fff", textDecoration: "none" }}>
          Canara
        </Link>
      </div>

      {/* Header */}
      <div style={{ background: accent, color: "#fff", padding: "10px 16px", borderRadius: 10 }}>
        <div style={{ fontWeight: 800 }}>Canara Bank Training Simulation</div>
        <div style={{ fontSize: 12, opacity: 0.9 }}>For awareness only — not the real site</div>
      </div>

      {/* Faux URL bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 12px", marginTop: 12, background: "#fff" }}>
        <span>🔒</span>
        <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 14 }}>{shownDomain}</span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#6b7280" }}>Padlock = encryption, not authenticity</span>
      </div>

      {/* Hero + urgency */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, marginTop: 12, background: "#f0f9ff" }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Net Banking & Digital Products (Simulation)</div>
        <div style={{ fontSize: 12, color: "#0b3b4f", marginTop: 4 }}>Recognize layout cues; verify identity before entering data</div>
      </div>
      <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 16px", margin: "12px 0", borderRadius: 10 }}>
        Unusual device detected: verify now to keep net banking active.
      </div>

      {/* Hover preview demo */}
      <div style={{ fontSize: 12, color: "#6b7280" }}>Hover link to preview true destination</div>
      <div style={{ marginTop: 6 }}>
        <a href="#" onMouseEnter={() => setHover(deceptive)} onMouseLeave={() => setHover("")} style={{ color: accent, textDecoration: "underline" }}>
          Secure Login
        </a>
        {hover && (
          <div style={{ marginTop: 8, padding: "8px 10px", background: "#f9fafb", border: "1px dashed #e5e7eb", borderRadius: 8, fontSize: 12 }}>
            Link preview: {hover}
          </div>
        )}
      </div>

      {/* Checklist */}
      <div style={{ marginTop: 16, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))" }}>
        <Box title="Type or bookmark the address">
          Avoid clicking banking links in messages; navigate directly to reduce redirect‑based phishing risk.  
        </Box>
        <Box title="Padlock only shows encryption">
          Treat HTTPS/lock as privacy indicators and still confirm site identity and context.  
        </Box>
        <Box title="Check legal & contact pages">
          Real sites publish privacy policy and support channels; missing or vague info warrants caution.  
        </Box>
      </div>
    </div>
  );
}
