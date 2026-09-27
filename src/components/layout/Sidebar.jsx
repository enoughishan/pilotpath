import { NavLink } from 'react-router-dom';
import { Icon } from '../Icons.jsx';
import { can } from '../../utils/perms.js';
import { useSession } from '../../store/useSession.js';
import { useAppStore } from '../../store/useAppStore.js';

const NAV = [
  { key:'dashboard',  label:'Dashboard',         icon:'dashboard', group:'Overview' },
  { key:'pathway',    label:'Pathway Board',     icon:'pathway',   group:'Overview' },
  { key:'challenges', label:'Challenges',        icon:'challenge', group:'Procurement' },
  { key:'startups',   label:'Startup Discovery', icon:'startup',   group:'Procurement' },
  { key:'evaluations',label:'Evaluations',       icon:'evaluation',group:'Procurement' },
  { key:'pilots',     label:'Active Pilots',     icon:'pilot',     group:'Pilots' },
  { key:'monitoring', label:'Monitoring',        icon:'monitoring',group:'Pilots' },
  { key:'evidence',   label:'Evidence Vault',    icon:'evidence',  group:'Pilots' },
  { key:'contracts',  label:'Contracts',         icon:'contract',  group:'Governance' },
  { key:'payments',   label:'Payments',          icon:'payment',   group:'Governance' },
  { key:'validation', label:'Validation',        icon:'validation',group:'Governance' },
  { key:'scaleup',    label:'Scale-up Decisions',icon:'scaleup',   group:'Governance' },
  { key:'publicvalue',label:'Public Value',      icon:'trendingUp',group:'Insights' },
  { key:'analytics',  label:'Analytics',         icon:'analytics', group:'Insights' },
  { key:'audit',      label:'Audit Trail',       icon:'audit',     group:'Insights' },
  { key:'templates',  label:'Templates',         icon:'templates', group:'System' },
  { key:'settings',   label:'Settings',          icon:'settings',  group:'System' }
];

export function Sidebar() {
  const { role, sidebarCollapsed, toggleSidebar } = useSession();
  const notifications = useAppStore((s) => s.notifications);
  const unread = notifications.filter(n => !n.read).length;

  const groups = {};
  NAV.forEach(n => {
    if (!can(role, n.key)) return;
    (groups[n.group] ||= []).push(n);
  });

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} id="sidebar">
      <div className="sb-brand">
        <div className="sb-logo">PB</div>
        <div className="sb-brand-text">
          <b>Pilot Bridge</b>
          <span>Innovation Procurement</span>
        </div>
      </div>
      <nav className="sb-nav">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <div className="sb-group-label">{group}</div>
            {items.map(n => (
              <NavLink
                key={n.key}
                to={`/${n.key}`}
                className={({ isActive }) => `sb-item ${isActive ? 'active' : ''}`}
              >
                <Icon name={n.icon} />
                <span className="sb-label">{n.label}</span>
                {n.key === 'dashboard' && unread > 0 && <span className="sb-count">{unread}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="sb-foot">
        <button className="sb-item" onClick={toggleSidebar} style={{ width: '100%' }}>
          <Icon name={sidebarCollapsed ? 'chevronRight' : 'chevronLeft'} />
          <span className="sb-label">Collapse</span>
        </button>
      </div>
    </aside>
  );
}