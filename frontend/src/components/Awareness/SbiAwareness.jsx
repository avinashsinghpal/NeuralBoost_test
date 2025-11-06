// ./components/Awareness/SbiAwareness.jsx
// Training-only simulation with image-based coaching overlays (no real links or credentials).

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ImageCoach({ src, alt, onClose }) {
  if (!src) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          width: "min(720px, 94vw)",
          background: "#fff",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          style={{ display: "block", width: "100%", height: "auto" }}
        />
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function SbiAwareness() {
  const navigate = useNavigate();

  // flow: "login" -> "payment" -> "safe"
  const [step, setStep] = useState("login");
  const [hoverLink, setHoverLink] = useState("");
  const [verifiedUrl, setVerifiedUrl] = useState(false);
  const [userId, setUserId] = useState("");
  const [pwd, setPwd] = useState("");
  const [coachKey, setCoachKey] = useState(null);

  const colors = {
    header: "#0b3a75",
    accent: "#1e429f",
    bannerBg: "#f8fafc",
    warnBg: "#fee2e2",
    warnText: "#991b1b",
  };

  // Map mistake keys to overlay images
  const coachImages = {
    verifyDomain: {
      src: "/assets/awareness/verify-domain.png",
      alt: "Verify the exact domain using a bookmark or by typing the address",
    },
    weakPassword: {
      src: "/assets/awareness/strong-password.png",
      alt: "Use a strong, unique password and enable MFA",
    },
    padlockMyth: {
      src: "/assets/awareness/padlock-myth.png",
      alt: "A padlock/HTTPS indicates encryption, not legitimacy",
    },
    noDeposit: {
      src: "/assets/awareness/no-deposit.png",
      alt: "Do not pay verification deposits or send gift card codes",
    },
    report: {
      src: "/assets/awareness/report-phishing.png",
      alt: "Report phishing and contact the bank via known channels",
    },
    safe: {
      src: "/assets/awareness/safe-exit.png",
      alt: "Exit safely and use your trusted bookmark to access the real site",
    },
  };

  function openCoach(key) {
    setCoachKey(key);
  }

  function closeCoach() {
    setCoachKey(null);
  }

  function submitLogin(e) {
    e.preventDefault();

    if (!verifiedUrl) {
      return openCoach("verifyDomain");
    }
    if (!userId || !pwd || pwd.length < 8) {
      return openCoach("weakPassword");
    }

    // Show padlock reminder once before proceeding
    openCoach("padlockMyth");
    setTimeout(() => {
      closeCoach();
      setStep("payment");
    }, 900);
  }

  function proceedVerificationDeposit() {
    openCoach("noDeposit");
  }

  function exitSafely() {
    setStep("safe");
    openCoach("safe");
  }

  const fakeDeceptive = "retail.sbi.bank.in.secure-verify-login.com/session/auth"; // training-only string

  return (
    <div style={{ fontFamily: "ui-sans-serif, system-ui", color: "#111827" }}>
      {/* Top header */}
      <div style={{ background: colors.header, color: "#fff" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "10px 16px",
          }}
        >
          <div style={{ fontWeight: 800, letterSpacing: 0.3 }}>
            SBI Online — Training Simulation
          </div>
          <div style={{ marginLeft: "auto", opacity: 0.9, fontSize: 13 }}>
            This page is for awareness only — not the real site
          </div>
        </div>
      </div>

      {/* Faux address bar */}
      <div
        style={{
          maxWidth: 1200,
          margin: "12px auto 0",
          padding: "8px 12px",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span>🔒</span>
        <span style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 14 }}>
          retail.sbi.bank.in
        </span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#6b7280" }}>
          Lock shows encryption, not legitimacy
        </span>
      </div>

      {/* Notices */}
      <div style={{ maxWidth: 1200, margin: "8px auto 0" }}>
        <div
          style={{
            background: colors.bannerBg,
            border: "1px solid #e5e7eb",
            color: "#0f172a",
            padding: "8px 12px",
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          Training: Banks do not ask for PIN, OTP, or passwords via calls, links, or messages — validate independently before acting.
        </div>
        <div
          style={{
            background: colors.warnBg,
            color: colors.warnText,
            padding: "8px 12px",
            borderRadius: 8,
            marginTop: 8,
            border: "1px solid #fecaca",
            fontSize: 13,
          }}
        >
          Urgent countdowns and threats are pressure tactics intended to rush decisions.
        </div>
      </div>

      {/* LOGIN STEP */}
      {step === "login" && (
        <div
          style={{
            maxWidth: 1200,
            margin: "14px auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {/* Personal Banking */}
          <section
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              background: "#fff",
              padding: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 28 }}>👤</div>
              <h2 style={{ margin: 0, fontSize: 18 }}>
                Personal <span style={{ fontWeight: 400 }}>Banking</span>
              </h2>
            </div>

            <form onSubmit={submitLogin} style={{ marginTop: 12 }}>
              <label style={{ display: "block", fontSize: 13, color: "#374151" }}>
                Username
              </label>
              <input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="user123"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  outline: "none",
                  fontSize: 14,
                  marginTop: 6,
                }}
              />
              <label
                style={{
                  display: "block",
                  marginTop: 10,
                  fontSize: 13,
                  color: "#374151",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  outline: "none",
                  fontSize: 14,
                  marginTop: 6,
                }}
              />

              <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  id="verify-url"
                  type="checkbox"
                  checked={verifiedUrl}
                  onChange={(e) => setVerifiedUrl(e.target.checked)}
                />
                <label htmlFor="verify-url" style={{ fontSize: 12, color: "#374151" }}>
                  I typed the address or used a trusted bookmark and verified the domain
                </label>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: 12,
                  background: colors.header,
                  color: "#fff",
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                LOGIN ▶
              </button>
            </form>

            <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
              Hover this example link to preview target:
            </div>
            <div>
              <a
                href="#"
                onMouseEnter={() =>
                  setHoverLink("retail.sbi.bank.in.secure-verify-login.com/session/auth")
                }
                onMouseLeave={() => setHoverLink("")}
                style={{ color: colors.accent, textDecoration: "underline", fontSize: 14 }}
              >
                Secure Login (example)
              </a>
              {hoverLink && (
                <div
                  style={{
                    marginTop: 8,
                    padding: "8px 10px",
                    background: "#f9fafb",
                    border: "1px dashed #e5e7eb",
                    borderRadius: 8,
                    fontSize: 12,
                    wordBreak: "break-all",
                  }}
                >
                  Link preview: {hoverLink}
                </div>
              )}
            </div>
          </section>

          {/* Corporate Banking teaching panel */}
          <section
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              background: "#fff",
              padding: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 28 }}>🏢</div>
              <h2 style={{ margin: 0, fontSize: 18 }}>
                Corporate <span style={{ fontWeight: 400 }}>Banking</span>
              </h2>
            </div>

            <ul style={{ marginTop: 12, lineHeight: 1.6, fontSize: 13, paddingLeft: 18 }}>
              <li>Navigate using a bookmark or typed address; avoid message links.</li>
              <li>Validate exact domain spelling and context before credentials.</li>
              <li>Enable MFA and avoid password reuse across accounts.</li>
            </ul>
          </section>
        </div>
      )}

      {/* PAYMENT STEP */}
      {step === "payment" && (
        <div
          style={{
            maxWidth: 900,
            margin: "16px auto",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            background: "#fff",
            padding: 16,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Verification Deposit (Simulation)</h2>
          <div
            style={{
              background: colors.warnBg,
              color: colors.warnText,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #fecaca",
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            Urgent: Your account will be restricted in 10 minutes unless you pay a refundable verification deposit now. (Phishing lure, training.)
          </div>

          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
            <button
              onClick={proceedVerificationDeposit}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              Make verification deposit via bank transfer
            </button>
            <button
              onClick={proceedVerificationDeposit}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              Provide gift card codes for verification
            </button>
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button
              onClick={exitSafely}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: colors.header,
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Exit safely
            </button>
            <button
              onClick={() => openCoach("report")}
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: "#fff",
                border: "1px solid #e5e7eb",
                cursor: "pointer",
              }}
            >
              Report this (training)
            </button>
            <Link
              to="/awareness"
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background: "#fff",
                border: "1px solid #e5e7eb",
                textDecoration: "none",
                color: "#111827",
              }}
            >
              ← Back to Catalog
            </Link>
          </div>
        </div>
      )}

      {/* SAFE STEP */}
      {step === "safe" && (
        <div
          style={{
            maxWidth: 900,
            margin: "16px auto",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            background: "#ecfdf5",
            padding: 16,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Safe outcome</h2>
          <p style={{ fontSize: 13, color: "#065f46" }}>
            Great job stopping the flow. Now use your trusted bookmark to access the real portal and enable multi‑factor authentication.
          </p>
          <div style={{ marginTop: 8 }}>
            <Link
              to="/awareness"
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                textDecoration: "none",
                color: "#fff",
                background: "#16a34a",
              }}
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      )}

      {/* Image overlay coach */}
      <ImageCoach
        src={coachKey ? coachImages[coachKey]?.src : null}
        alt={coachKey ? coachImages[coachKey]?.alt : ""}
        onClose={closeCoach}
      />
    </div>
  );
}
