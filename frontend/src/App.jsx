// ./App.jsx
import React from 'react';
import SOSButton from './components/Shared/SOSButton.jsx';
import Chatbot from './components/Shared/Chatbot.jsx';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Analyze from './pages/Analyze.jsx';
import AnalyzeExtracted from './pages/AnalyzeExtracted.jsx';
import Awareness from './pages/Awareness.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Simulation from './pages/Simulation.jsx';

function Nav() {
  return (
    <nav className="nav">
      <div className="brand">TRACE</div>
      <div className="links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/analyze">Analyze</NavLink>
        <NavLink to="/awareness">Awareness</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/simulate">Simulation</NavLink>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <div className="app">
      <Nav />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/analyze-extracted" element={<AnalyzeExtracted />} />

          {/* Parent layout with Outlet */}
          <Route path="/awareness" element={<Awareness />}>
            <Route index element={<BankPhishingAwareness />} />
            <Route path="sbi" element={<SbiAwareness />} />
            <Route path="canara" element={<CanaraAwareness />} />
          </Route>

          {/* Awareness is now a single page (no nested children) */}
          <Route path="/awareness" element={<Awareness />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/simulate" element={<Simulation />} />
        </Routes>
      </main>
      <footer className="footer">© {new Date().getFullYear()} TRACE</footer>
      <SOSButton />
      <Chatbot />
    </div>
  );
}
