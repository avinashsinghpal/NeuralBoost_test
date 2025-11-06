// ./pages/Awareness.jsx
import React from "react";
import { Outlet } from "react-router-dom";

export default function Awareness() {
  return (
    <div style={{ maxWidth: 1080, margin: "24px auto", padding: 16 }}>
      <h1>Awareness</h1>
      {/* Child routes render here (catalog at index, or SBI/Canara pages) */}
      <Outlet />
    </div>
  );
}
