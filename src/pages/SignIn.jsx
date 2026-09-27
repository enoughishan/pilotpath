import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { useSession } from '../store/useSession.js';
import { useToast } from '../components/ui/Toast.jsx';
import { STATE, DEPARTMENTS, ROLES, DEMO_USERS, DEMO_STARTUP } from '../data/maharashtra.js';

export default function SignIn() {
  const navigate = useNavigate();
  const { signInGovernment, signInStartup, publicView } = useSession();
  const toast = useToast();
  const [tab, setTab] = useState('gov');

  // Government form
  const [state] = useState(STATE.name);
  const [district, setDistrict] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');

  // Startup form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGovSignIn = (e) => {
    e.preventDefault();
    if (!district || !department || !role) {
      toast.error('Please complete all fields', 'District, Department and Role are required.');
      return;
    }
    const user = DEMO_USERS[role];
    signInGovernment({ district, department, role, ...user });
    toast.success(`Welcome, ${user.name}`, user.designation);
    navigate('/dashboard');
  };

  const handleStartupSignIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email and password required');
      return;
    }
    signInStartup({ email, ...DEMO_STARTUP });
    toast.success(`Welcome, ${DEMO_STARTUP.name}`, DEMO_STARTUP.company);
    navigate('/dashboard');
  };

  const handlePublic = () => {
    publicView();
    toast.info('Viewing public dashboard', 'Read-only access');
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      {/* LEFT PANEL — Branding */}
      <div className="login-brand">
        <div className="login-emblem">
          <svg viewBox="0 0 100 100" width="80" height="80">
            {/* Simplified Ashoka Chakra inspired emblem */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#fff" strokeWidth="2" opacity="0.4"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6"/>
            <circle cx="50" cy="50" r="5" fill="#fff"/>
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 15) * Math.PI / 180;
              const x1 = 50 + 5 * Math.cos(angle);
              const y1 = 50 + 5 * Math.sin(angle);
              const x2 = 50 + 30 * Math.cos(angle);
              const y2 = 50 + 30 * Math.sin(angle);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="1" opacity="0.7"/>;
            })}
          </svg>
        </div>

        <div className="login-brand-text">
          <div className="login-ministry">Government of Maharashtra</div>
          <div className="login-ministry-mr">महाराष्ट्र शासन</div>
          <h1 className="login-title">उद्भव</h1>
          <h2 className="login-subtitle">Udbhav</h2>
          <p className="login-tagline">
            Innovation Procurement &amp; Pilot Management Platform
          </p>
          <p className="login-tagline-mr">
            नवोन्मेष खरेदी व पायलट व्यवस्थापन मंच
          </p>
        </div>

        <div className="login-footnote">
          <Icon name="shield" />
          <span>Secure Government Portal · NIC Compliant</span>
        </div>
      </div>

      {/* RIGHT PANEL — Sign In */}
      <div className="login-form-wrap">
        <div className="login-form">
          <div className="login-form-header">
            <h2>Sign in to continue</h2>
            <p>Select your login type below</p>
          </div>

          <div className="login-tabs">
            <button
              className={`login-tab ${tab === 'gov' ? 'active' : ''}`}
              onClick={() => setTab('gov')}
            >
              <Icon name="building" />
              <div>
                <b>Government Authority</b>
                <span>शासकीय अधिकारी</span>
              </div>
            </button>
            <button
              className={`login-tab ${tab === 'startup' ? 'active' : ''}`}
              onClick={() => setTab('startup')}
            >
              <Icon name="startup" />
              <div>
                <b>Startup / Vendor</b>
                <span>स्टार्टअप / पुरवठादार</span>
              </div>
            </button>
          </div>

          {tab === 'gov' && (
            <form className="login-form-body" onSubmit={handleGovSignIn}>
              <div className="field">
                <label>State / राज्य</label>
                <input className="input" value={state} readOnly />
              </div>

              <div className="field">
                <label>District / जिल्हा <span className="req">*</span></label>
                <select className="select" value={district} onChange={(e) => setDistrict(e.target.value)}>
                  <option value="">Select district</option>
                  {STATE.districts.map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.nameMr})</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Department / विभाग <span className="req">*</span></label>
                <select className="select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Role / भूमिका <span className="req">*</span></label>
                <div className="role-picker">
                  {ROLES.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      className={`role-option ${role === r.id ? 'selected' : ''}`}
                      onClick={() => setRole(r.id)}
                    >
                      <Icon name={r.icon} />
                      <div>
                        <b>{r.name}</b>
                        <span>{r.desc}</span>
                      </div>
                      {role === r.id && <Icon name="check" className="check" />}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 8 }}>
                <Icon name="lock" />
                Sign In as Government Authority
              </button>

              <div className="login-hint">
                <Icon name="info" />
                <span>Demo credentials are pre-filled. In production, this would use NIC SSO.</span>
              </div>
            </form>
          )}

          {tab === 'startup' && (
            <form className="login-form-body" onSubmit={handleStartupSignIn}>
              <div className="field">
                <label>Email or Mobile <span className="req">*</span></label>
                <input
                  className="input"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@startup.in"
                />
              </div>

              <div className="field">
                <label>Password <span className="req">*</span></label>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--primary)' }} />
                  Remember me
                </label>
                <a href="#" style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>Forgot password?</a>
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg">
                <Icon name="check" />
                Sign In
              </button>

              <div className="login-divider">or</div>

              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={() => toast.info('Registration', 'Startup registration form would open here.')}
              >
                <Icon name="plus" />
                Register as new Startup
              </button>

              <div className="login-hint">
                <Icon name="info" />
                <span>DPIIT-recognised startups can register with their recognition number.</span>
              </div>
            </form>
          )}

          <div className="login-footer">
            <button className="link-btn" onClick={handlePublic}>
              <Icon name="eye" />
              View Public Dashboard
            </button>
            <div className="login-footer-links">
              <a href="#">Help</a>
              <span>·</span>
              <a href="#">Privacy Policy</a>
              <span>·</span>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>

        <div className="login-legal">
          © 2026 Government of Maharashtra · Information Technology Directorate
          <br />
          This is a demonstration environment. Data shown is illustrative.
        </div>
      </div>
    </div>
  );
}