// ./App.jsx
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Analyze from './pages/Analyze.jsx';
import Awareness from './pages/Awareness.jsx';
import Dashboard from './pages/Dashboard.jsx';

// awareness children
import BankPhishingAwareness from './components/Awareness/TrainingCards.jsx';
import SbiAwareness from './components/Awareness/SbiAwareness.jsx';
import CanaraAwareness from './components/Awareness/CanaraAwareness.jsx';

function Nav() {
  return (
    <nav className="nav">
      <div className="brand">TRACE</div>
      <div className="links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/analyze">Analyze</NavLink>
        <NavLink to="/awareness">Awareness</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
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

          {/* Parent layout with Outlet */}
          <Route path="/awareness" element={<Awareness />}>
            <Route index element={<BankPhishingAwareness />} />
            <Route path="sbi" element={<SbiAwareness />} />
            <Route path="canara" element={<CanaraAwareness />} />
          </Route>

          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <footer className="footer">© {new Date().getFullYear()} TRACE</footer>
    </div>
  );
}
