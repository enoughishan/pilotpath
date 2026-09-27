import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import { CommandPalette } from './CommandPalette.jsx';
import { Drawer } from '../ui/Drawer.jsx';
import { Icon } from '../Icons.jsx';
import { useSession } from '../../store/useSession.js';
import { useAppStore } from '../../store/useAppStore.js';
import { PERSONAS } from '../../data/seed.js';
import { initials, timeAgo } from '../../utils/format.js';

export function AppShell() {
  const { sidebarCollapsed, setPersona } = useSession();
  const { notifications, markAllRead } = useAppStore();
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdkOpen(true); }
      if (e.key === 'Escape') { setCmdkOpen(false); setNotifOpen(false); setRoleOpen(false); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const toneIcon = (t) => t === 'success' ? 'checkCircle' : t === 'error' ? 'alert' : t === 'warning' ? 'alertTriangle' : 'info';
  const toneColor = (t) => t === 'success' ? 'var(--success)' : t === 'error' ? 'var(--danger)' : t === 'warning' ? 'var(--warning)' : 'var(--primary)';

  return (
    <div className={`shell ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <Sidebar />
      <div className="main">
        <Topbar
          onOpenCmdk={() => setCmdkOpen(true)}
          onOpenNotifications={() => setNotifOpen(true)}
          onOpenRoleSwitcher={() => setRoleOpen(true)}
        />
        <Outlet />
      </div>

      <CommandPalette open={cmdkOpen} onClose={() => setCmdkOpen(false)} />

      <Drawer open={notifOpen} title="Notifications" onClose={() => setNotifOpen(false)}
        footer={<button className="btn btn-secondary btn-block" onClick={markAllRead}>Mark all as read</button>}>
        {notifications.length ? notifications.map(n => (
          <div key={n.id} className="attention-item" style={{ opacity: n.read ? .7 : 1, cursor: 'default' }}>
            <div className="ai-icon" style={{ background: 'var(--surface-2)', color: toneColor(n.type) }}>
              <Icon name={toneIcon(n.type)} />
            </div>
            <div className="ai-body">
              <b>{n.title}</b>
              <span>{n.body}</span>
              <div className="xsmall muted" style={{ marginTop: 3 }}>{timeAgo(n.ts)}</div>
            </div>
          </div>
        )) : <div className="empty"><Icon name="bell" /><b>No notifications</b></div>}
      </Drawer>

      <Drawer open={roleOpen} title="Switch role" onClose={() => setRoleOpen(false)}>
        <p className="small muted" style={{ marginBottom: 14 }}>
          Choose a different persona to explore Pilot Bridge from another perspective.
        </p>
        {PERSONAS.map(p => (
          <button key={p.id} className="attention-item" style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
            onClick={() => { setPersona(p.id); setRoleOpen(false); }}>
            <div className="ai-icon" style={{ background: p.color, color: '#fff', fontWeight: 700, fontSize: 12 }}>
              {initials(p.name)}
            </div>
            <div className="ai-body">
              <b>{p.name}</b>
              <span>{p.title} · {p.org}</span>
            </div>
            <Icon name="chevronRight" className="arrow" />
          </button>
        ))}
      </Drawer>
    </div>
  );
}