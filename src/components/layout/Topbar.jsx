import { Icon } from '../Icons.jsx';
import { useSession } from '../../store/useSession.js';
import { useAppStore } from '../../store/useAppStore.js';
import { initials } from '../../utils/format.js';

export function Topbar({ onOpenCmdk, onOpenNotifications, onOpenRoleSwitcher }) {
  const { theme, lang, toggleTheme, toggleLang, toggleSidebar, persona } = useSession();
  const notifications = useAppStore((s) => s.notifications);
  const unread = notifications.filter(n => !n.read).length;
  const p = persona();

  return (
    <header className="topbar">
      <button className="icon-btn mobile-only" onClick={() => document.getElementById('sidebar')?.classList.add('open')} aria-label="Menu">
        <Icon name="menu" />
      </button>
      <button className="icon-btn desktop-only" onClick={toggleSidebar} aria-label="Toggle sidebar">
        <Icon name="menu" />
      </button>
      <button className="search-trigger" onClick={onOpenCmdk}>
        <Icon name="search" />
        <span>Search challenges, startups, pilots, contracts…</span>
        <kbd>⌘K</kbd>
      </button>
      <div className="tb-spacer" />
      <div className="demo-chip"><span className="dot" />DEMO · 22 Sep 2026</div>
      <button className="icon-btn" onClick={toggleLang} aria-label="Language" style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)' }}>
        {lang}
      </button>
      <button className="icon-btn" onClick={toggleTheme} aria-label="Theme">
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </button>
      <button className="icon-btn" onClick={onOpenNotifications} aria-label="Notifications">
        <Icon name="bell" />
        {unread > 0 && <span className="badge-dot" />}
      </button>
      <button className="role-chip" onClick={onOpenRoleSwitcher}>
        <div className="avatar" style={{ background: p?.color || 'var(--primary)' }}>
          {initials(p?.name || 'User')}
        </div>
        <div className="role-chip-text desktop-only">
          <b>{p?.name || 'User'}</b>
          <span>{p?.title || ''}</span>
        </div>
        <Icon name="chevronDown" className="desktop-only" />
      </button>
    </header>
  );
}