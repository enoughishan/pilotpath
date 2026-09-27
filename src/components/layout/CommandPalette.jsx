import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../Icons.jsx';
import { useAppStore } from '../../store/useAppStore.js';
import { fmtINR } from '../../utils/format.js';

export function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const state = useAppStore();

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const match = (s) => !query || String(s).toLowerCase().includes(query.toLowerCase());

  const groups = useMemo(() => {
    const g = [];

    const challenges = state.challenges.filter(c => match(c.id) || match(c.title) || match(c.dept) || match(c.district)).slice(0, 5);
    if (challenges.length) g.push({
      label: 'Challenges',
      items: challenges.map(c => ({ icon: 'challenge', title: c.title, meta: c.id, link: `/challenges/${c.id}` }))
    });

    const startups = state.startups.filter(s => match(s.name) || match(s.tech) || match(s.industry)).slice(0, 4);
    if (startups.length) g.push({
      label: 'Startups',
      items: startups.map(s => ({ icon: 'startup', title: s.name, meta: s.id, link: `/startups/${s.id}` }))
    });

    const pilots = state.pilots.filter(p => match(p.id) || match(p.title)).slice(0, 4);
    if (pilots.length) g.push({
      label: 'Pilots',
      items: pilots.map(p => ({ icon: 'pilot', title: p.title, meta: p.id, link: `/pilots/${p.id}` }))
    });

    const contracts = state.contracts.filter(c => match(c.id)).slice(0, 3);
    if (contracts.length) g.push({
      label: 'Contracts',
      items: contracts.map(c => ({ icon: 'contract', title: c.id, meta: fmtINR(c.value), link: `/contracts/${c.id}` }))
    });

    const pages = [
      { label: 'Dashboard', link: '/dashboard', icon: 'dashboard' },
      { label: 'Pathway Board', link: '/pathway', icon: 'pathway' },
      { label: 'Public Value', link: '/publicvalue', icon: 'trendingUp' },
      { label: 'Analytics', link: '/analytics', icon: 'analytics' },
      { label: 'Audit Trail', link: '/audit', icon: 'audit' }
    ].filter(p => match(p.label));
    if (pages.length) g.push({ label: 'Pages', items: pages.map(p => ({ ...p, title: p.label, meta: '' })) });

    return g;
  }, [query, state]);

  const flat = groups.flatMap(g => g.items);

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, flat.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter') {
      const item = flat[selected];
      if (item) { navigate(item.link); onClose(); }
    }
  };

  if (!open) return null;

  let runningIndex = -1;

  return (
    <>
      <div className="overlay open" onClick={onClose} />
      <div className="cmdk open">
        <div className="cmdk-input">
          <Icon name="search" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKey}
            placeholder="Search challenges, startups, pilots, contracts…"
            autoComplete="off"
          />
          <kbd>ESC</kbd>
        </div>
        <div className="cmdk-results">
          {!groups.length ? (
            <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
              No results for "{query}"
            </div>
          ) : groups.map(g => (
            <div key={g.label}>
              <div className="cmdk-group-label">{g.label}</div>
              {g.items.map(item => {
                runningIndex++;
                const isSel = runningIndex === selected;
                return (
                  <div
                    key={item.link}
                    className={`cmdk-item ${isSel ? 'active' : ''}`}
                    onMouseEnter={() => setSelected(runningIndex)}
                    onClick={() => { navigate(item.link); onClose(); }}
                  >
                    <Icon name={item.icon} />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.title}
                    </span>
                    {item.meta && <span className="ci-meta">{item.meta}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}