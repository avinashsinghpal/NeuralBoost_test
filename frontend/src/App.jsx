// ./App.jsx
import React from 'react';
import SOSButton from './components/Shared/SOSButton.jsx';
import Chatbot from './components/Shared/Chatbot.jsx';
import AppShell from './components/chrome/AppShell.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CompanyProvider, useCompany } from './context/CompanyContext';
import Home from './pages/Home.jsx';
import Analyze from './pages/Analyze.jsx';
import AnalyzeExtracted from './pages/AnalyzeExtracted.jsx';
import Awareness from './pages/Awareness.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Simulation from './pages/Simulation.jsx';
import Login from './pages/Login.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useCompany();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <CompanyProvider>
      <div className="app">
        <Routes>
          {/* Home and Login pages don't use AppShell */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* All other pages use AppShell */}
          <Route path="/analyze" element={
            <AppShell>
              <Analyze />
            </AppShell>
          } />
          <Route path="/analyze-extracted" element={
            <AppShell>
              <AnalyzeExtracted />
            </AppShell>
          } />
          <Route path="/awareness" element={
            <AppShell>
              <Awareness />
            </AppShell>
          } />
          <Route path="/dashboard" element={
            <AppShell>
              <Dashboard />
            </AppShell>
          } />
          <Route path="/simulate" element={
            <ProtectedRoute>
              <AppShell>
                <Simulation />
              </AppShell>
            </ProtectedRoute>
          } />
        </Routes>
        <SOSButton />
        <Chatbot />
      </div>
    </CompanyProvider>
  );
}
