import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { ChallengeCard } from '../components/widgets/ChallengeCard.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { useSession } from '../store/useSession.js';
import { STAGES } from '../data/seed.js';

export default function PathwayBoard() {
  const challenges = useAppStore(s => s.challenges);
  const { role } = useSession();
  const [filters, setFilters] = useState({ q: '', dept: '', district: '', priority: '' });

  const depts = useMemo(() => [...new Set(challenges.map(c => c.dept))], [challenges]);
  const districts = useMemo(() => [...new Set(challenges.map(c => c.district))], [challenges]);

  const filtered = useMemo(
    () =>
      challenges.filter(
        c =>
          (!filters.dept || c.dept === filters.dept) &&
          (!filters.district || c.district === filters.district) &&
          (!filters.priority || c.priority === filters.priority) &&
          (!filters.q || (c.title + c.id).toLowerCase().includes(filters.q.toLowerCase()))
      ),
    [challenges, filters]
  );

  const hasFilters = Object.values(filters).some(v => v);

  return (
    <div className="content">
      {/* ================ PAGE HERO ================ */}
      <div className="page-hero">
        <div className="page-hero-eyebrow">
          <span className="dot" />
          Governed pathway
        </div>
        <h1 className="page-hero-title">Pathway Board</h1>
        <p className="page-hero-sub">
          Every challenge flows through 10 governed stages — from problem
          definition to scale-up decision. Click any card to open the full
          traceable record.
        </p>
        <div className="page-hero-meta">
          {STAGES.map(s => {
            const count = challenges.filter(c => c.stage === s.key).length;
            return (
              <span key={s.key}>
                <b>{s.num}.</b> {s.name}
                {count > 0 && (
                  <span
                    style={{
                      marginLeft: 4,
                      padding: '1px 7px',
                      borderRadius: 999,
                      background: 'var(--primary-50)',
                      color: 'var(--primary)',
                      fontSize: 10.5,
                      fontWeight: 700
                    }}
                  >
                    {count}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* ================ FILTER BAR ================ */}
      <div className="filter-bar-premium">
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Icon
            name="search"
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 15,
              height: 15,
              color: 'var(--text-4)'
            }}
          />
          <input
            className="input"
            style={{ paddingLeft: 36 }}
            placeholder="Search challenges…"
            value={filters.q}
            onChange={e => setFilters({ ...filters, q: e.target.value })}
          />
        </div>
        <select
          className="select"
          value={filters.dept}
          onChange={e => setFilters({ ...filters, dept: e.target.value })}
        >
          <option value="">All departments</option>
          {depts.map(d => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          className="select"
          value={filters.district}
          onChange={e => setFilters({ ...filters, district: e.target.value })}
        >
          <option value="">All districts</option>
          {districts.map(d => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          className="select"
          value={filters.priority}
          onChange={e => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        {hasFilters && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setFilters({ q: '', dept: '', district: '', priority: '' })}
          >
            <Icon name="x" />
            Clear
          </button>
        )}
      </div>

      {/* ================ BOARD ================ */}
      <div className="board-wrap">
        <div className="board">
          {STAGES.map(s => {
            const items = filtered.filter(c => c.stage === s.key);
            return (
              <div className="board-col board-col-premium" key={s.key}>
                <div className="board-col-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        background: 'var(--primary-50)',
                        color: 'var(--primary)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 11,
                        fontWeight: 800,
                        fontFamily: 'var(--font-display)'
                      }}
                    >
                      {s.num}
                    </span>
                    <b>{s.name}</b>
                  </div>
                  <span className="cnt">{items.length}</span>
                </div>
                <div className="board-col-body">
                  {items.length ? (
                    items.map(c => <ChallengeCard key={c.id} challenge={c} />)
                  ) : (
                    <div className="board-empty">No challenges in this stage</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}