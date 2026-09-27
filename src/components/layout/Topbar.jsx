import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icons.jsx';
import { useSession } from '../../store/useSession.js';
import { useAppStore } from '../../store/useAppStore.js';
import { initials } from '../../utils/format.js';
import { useToast } from '../ui/Toast.jsx';

export function Topbar({ onOpenCmdk, onOpenNotifications }) {
  const navigate = useNavigate();
  const {
    theme, lang,
    toggleTheme, toggleLang, toggleSidebar,
    user, role, loginType, district, department,
    signOut
  } = useSession();
  const notifications = useAppStore(s => s.notifications);
  const unread = notifications.filter(n => !n.read).length;
  const toast = useToast();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const roleLabel = {
    officer: 'Innovation Officer',
    evaluator: 'Domain Expert',
    validator: 'Principal Validator',
    accounts: 'Accounts Officer',
    startup: 'Startup / Vendor',
    public: 'Public Viewer'
  }[role] || role;

  const handleSignOut = () => {
    setMenuOpen(false);
    signOut();
    toast.info('Signed out securely', 'See you again soon.');
    navigate('/signin');
  };

  return (
    <header className="topbar">
      {/* Mobile menu */}
      <button
        className="icon-btn mobile-only"
        onClick={() => document.getElementById('sidebar')?.classList.add('open')}
        aria-label="Menu"
      >
        <Icon name="menu" />
      </button>

      {/* Desktop collapse */}
      <button
        className="icon-btn desktop-only"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Icon name="menu" />
      </button>

      {/* Search */}
      <button className="search-trigger" onClick={onOpenCmdk}>
        <Icon name="search" />
        <span>Search challenges, startups, pilots…</span>
        <kbd>⌘K</kbd>
      </button>

      <div className="tb-spacer" />

      {/* Public view indicator */}
      {loginType === 'public' && (
        <span
          className="demo-chip"
          style={{
            background: 'var(--info-50)',
            borderColor: '#DBEAFE',
            color: 'var(--info)'
          }}
        >
          Public view
        </span>
      )}

      {/* Language */}
      <button
        className="icon-btn"
        onClick={toggleLang}
        aria-label="Language"
        style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)' }}
      >
        {lang}
      </button>

      {/* Theme */}
      <button
        className="icon-btn"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </button>

      {/* Notifications */}
      <button
        className="icon-btn"
        onClick={onOpenNotifications}
        aria-label="Notifications"
      >
        <Icon name="bell" />
        {unread > 0 && <span className="badge-dot" />}
      </button>

      {/* ============ PROFILE MENU ============ */}
      <div className="user-menu" ref={menuRef}>
        <button
          className={`user-trigger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <div className="user-avatar">
            {initials(user?.name || 'U')}
            <span className="presence" />
          </div>
          <div className="user-trigger-text desktop-only">
            <b>{user?.name || 'User'}</b>
            <span>{roleLabel}</span>
          </div>
          <Icon name="chevronDown" className="chev desktop-only" />
        </button>

        {menuOpen && (
          <div className="user-dropdown" role="menu">
            {/* ---- Identity header ---- */}
            <div className="user-dropdown-header">
              <div className="user-dropdown-identity">
                <div className="user-dropdown-avatar">
                  {initials(user?.name || 'U')}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="user-dropdown-name">
                    {user?.name || 'User'}
                  </div>
                  <div className="user-dropdown-title">
                    {user?.designation || user?.company || roleLabel}
                  </div>
                </div>
              </div>

              <span className="user-dropdown-role-chip">
                <Icon name="shield" />
                {roleLabel}
              </span>
            </div>

            {/* ---- Meta info ---- */}
            {(district || department || user?.email) && (
              <div className="user-dropdown-meta">
                {district && (
                  <div className="user-dropdown-meta-item">
                    <Icon name="mapPin" />
                    <span>{district}, Maharashtra</span>
                  </div>
                )}
                {department && (
                  <div className="user-dropdown-meta-item">
                    <Icon name="building" />
                    <span>{department}</span>
                  </div>
                )}
                {user?.email && (
                  <div className="user-dropdown-meta-item">
                    <Icon name="file" />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>
            )}

            {/* ---- Menu items ---- */}
            <div className="user-dropdown-body">
              <div className="user-dropdown-section">Account</div>

              <button
                className="user-dropdown-item"
                onClick={() => { setMenuOpen(false); navigate('/settings'); }}
                role="menuitem"
              >
                <Icon name="settings" />
                <span>Account settings</span>
              </button>

              <button
                className="user-dropdown-item"
                onClick={() => { setMenuOpen(false); }}
                role="menuitem"
              >
                <Icon name="shieldCheck" />
                <span>Security &amp; privacy</span>
              </button>

              <div className="user-dropdown-divider" />

              <div className="user-dropdown-section">Workspace</div>

              <button
                className="user-dropdown-item"
                onClick={() => { setMenuOpen(false); navigate('/templates'); }}
                role="menuitem"
              >
                <Icon name="templates" />
                <span>Templates library</span>
              </button>

              <button
                className="user-dropdown-item"
                onClick={() => { setMenuOpen(false); navigate('/audit'); }}
                role="menuitem"
              >
                <Icon name="audit" />
                <span>Audit trail</span>
              </button>

              <button
                className="user-dropdown-item"
                onClick={() => { setMenuOpen(false); onOpenCmdk?.(); }}
                role="menuitem"
              >
                <Icon name="search" />
                <span>Search</span>
                <span className="kbd-hint">⌘K</span>
              </button>

              <div className="user-dropdown-divider" />

              <button
                className="user-dropdown-item"
                onClick={() => { setMenuOpen(false); }}
                role="menuitem"
              >
                <Icon name="info" />
                <span>Help &amp; documentation</span>
              </button>

              <button
                className="user-dropdown-item danger"
                onClick={handleSignOut}
                role="menuitem"
              >
                <Icon name="logout" />
                <span>Sign out</span>
              </button>
            </div>

            {/* ---- Footer ---- */}
            <div className="user-dropdown-footer">
              <Icon name="shieldCheck" />
              <span>Signed in securely · NIC-compliant session</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}