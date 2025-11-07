import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/apiClient';
import { useCompany } from '../context/CompanyContext';
import ParticleCanvas from '../components/Shared/ParticleCanvas';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useCompany();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.auth.login({ email, password });
        if (res.success) {
          login(res.company, res.employees);
          navigate('/simulate');
        }
      } else {
        const res = await api.auth.signup({ 
          companyName, 
          email, 
          password,
          employees: [] // Can add employees later
        });
        if (res.success) {
          login(res.company, []);
          navigate('/simulate');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page" style={{ color: '#e5e7eb', position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ParticleCanvas />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1200, padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
          {/* Left Side - Login/Signup Form */}
          <div style={{ background: 'linear-gradient(180deg,#0b0f1e 0%, #0b1220 100%)', border: '1px solid #1f2937', borderRadius: 16, padding: 32 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                TRACE
              </h1>
              <p style={{ marginTop: 8, opacity: 0.8, fontSize: 14 }}>Threat Recognition And Cybersecurity Education</p>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: '#0b1220', padding: 4, borderRadius: 8 }}>
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 6,
                  border: 'none',
                  background: isLogin ? 'linear-gradient(135deg, #0ea5e9, #7c3aed)' : 'transparent',
                  color: isLogin ? '#fff' : '#e5e7eb',
                  cursor: 'pointer',
                  fontWeight: isLogin ? 600 : 400,
                  fontSize: 14
                }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 6,
                  border: 'none',
                  background: !isLogin ? 'linear-gradient(135deg, #0ea5e9, #7c3aed)' : 'transparent',
                  color: !isLogin ? '#fff' : '#e5e7eb',
                  cursor: 'pointer',
                  fontWeight: !isLogin ? 600 : 400,
                  fontSize: 14
                }}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
              {!isLogin && (
                <label style={{ display: 'grid', gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>Company Name</span>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., IBM, DELL, AMAZON"
                    required={!isLogin}
                    style={{ background: '#0b1220', color: '#e5e7eb', border: '1px solid #334155', borderRadius: 8, padding: 12, fontSize: 14 }}
                  />
                </label>
              )}

              <label style={{ display: 'grid', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isLogin ? "admin@ibm.com" : "admin@yourcompany.com"}
                  required
                  style={{ background: '#0b1220', color: '#e5e7eb', border: '1px solid #334155', borderRadius: 8, padding: 12, fontSize: 14 }}
                />
              </label>

              <label style={{ display: 'grid', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                  required
                  style={{ background: '#0b1220', color: '#e5e7eb', border: '1px solid #334155', borderRadius: 8, padding: 12, fontSize: 14 }}
                />
              </label>

              {error && (
                <div style={{ padding: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#fecaca', fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #7c3aed)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: 14,
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
              </button>
            </form>

            {isLogin && (
              <div style={{ marginTop: 24, padding: 16, background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 8 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#60a5fa', marginBottom: 8 }}>Demo Accounts:</p>
                <div style={{ fontSize: 12, color: '#93c5fd', lineHeight: 1.8 }}>
                  <div><strong>IBM:</strong> admin@ibm.com / IBM@2024</div>
                  <div><strong>DELL:</strong> admin@dell.com / DELL@2024</div>
                  <div><strong>AMAZON:</strong> admin@amazon.com / AMAZON@2024</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Features & Benefits */}
          <div style={{ display: 'grid', gap: 24 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Why Choose TRACE?</h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.9, marginBottom: 24 }}>
                TRACE is a comprehensive cybersecurity education and phishing simulation platform designed to help organizations train their employees and protect against cyber threats.
              </p>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              <FeatureCard
                icon="🎯"
                title="Realistic Phishing Simulations"
                description="Create and send realistic phishing emails, SMS, and QR codes to test your employees' awareness and response to cyber threats."
              />
              <FeatureCard
                icon="📊"
                title="Comprehensive Analytics"
                description="Track who clicked, when they clicked, and from which device. Get detailed insights into your organization's security posture."
              />
              <FeatureCard
                icon="👥"
                title="Employee Management"
                description="Manage your company's employees, send targeted simulations, and track individual performance over time."
              />
              <FeatureCard
                icon="🔒"
                title="Secure & Private"
                description="Your data is secure and private. All simulations are tracked anonymously and stored securely in your company's database."
              />
              <FeatureCard
                icon="📈"
                title="Department Analytics"
                description="View phishing statistics grouped by department to identify which teams need additional training."
              />
              <FeatureCard
                icon="🚀"
                title="Easy to Use"
                description="Intuitive interface that makes it easy to create campaigns, track results, and generate reports for your security team."
              />
            </div>

            <div style={{ padding: 20, background: 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(124,58,237,0.1))', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 12 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Key Features</h3>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 2, opacity: 0.9 }}>
                <li>Email phishing simulations with customizable templates</li>
                <li>QR code phishing campaigns for mobile device testing</li>
                <li>Real-time click tracking and device information</li>
                <li>Multi-device support (Desktop, Android, iPhone)</li>
                <li>Historical data and trend analysis</li>
                <li>Export capabilities for reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div style={{ padding: 20, background: '#0f172a', border: '1px solid #1f2937', borderRadius: 12 }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, opacity: 0.8 }}>{description}</p>
    </div>
  );
}

