import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { PERSONAS } from '../data/seed.js';
import { useSession } from '../store/useSession.js';
import { initials } from '../utils/format.js';
import { useAppStore } from '../store/useAppStore.js';
import { useToast } from '../components/ui/Toast.jsx';

export default function RoleSelect() {
  const navigate = useNavigate();
  const { setPersona } = useSession();
  const reset = useAppStore(s => s.reset);
  const toast = useToast();

  const handleSelect = (p) => {
    setPersona(p.id);
    toast.success(`Signed in as ${p.name}`, `${p.title} · ${p.org}`);
    navigate('/dashboard');
  };

  const handlePublic = () => {
    setPersona('P1');
    toast.info('Viewing public dashboard', 'Signed in as Government Officer (demo).');
    navigate('/dashboard');
  };

  return (
    <div className="role-screen">
      <div className="role-brand">
        <div className="sb-logo">PB</div>
        <div className="role-brand-text">
          <b>Pilot Bridge</b>
          <span>Government Innovation Procurement & Pilot Management</span>
        </div>
      </div>
      <div className="role-hero">
        <div className="role-tagline"><Icon name="shield" />Evidence-driven innovation procurement</div>
        <h1>Enter the platform as</h1>
        <p>Choose a role to explore Pilot Bridge from that perspective. Every role has a distinct workspace and permission set.</p>
      </div>
      <div className="role-grid">
        {PERSONAS.map(p => (
          <button key={p.id} className="role-card" onClick={() => handleSelect(p)}>
            <div className="role-avatar" style={{ background: p.color }}>{initials(p.name)}</div>
            <div>
              <h3>{p.name}</h3>
              <div className="rc-org">{p.title} · {p.org}</div>
            </div>
            <p className="rc-desc">{p.desc}</p>
            <div className="rc-cta">Enter as {p.title.split(' ')[0]} <Icon name="chevronRight" /></div>
          </button>
        ))}
      </div>
      <div className="role-foot">
        <button className="btn btn-secondary" onClick={handlePublic}>
          <Icon name="eye" />View public dashboard
        </button>
        <button className="btn btn-ghost" onClick={() => { reset(); toast.success('Demo data reset'); }}>
          <Icon name="refresh" />Reset demo data
        </button>
      </div>
    </div>
  );
}