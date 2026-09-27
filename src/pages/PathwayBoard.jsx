import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { ChallengeCard } from '../components/widgets/ChallengeCard.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { STAGES } from '../data/seed.js';

export default function PathwayBoard() {
  const challenges = useAppStore(s => s.challenges);
  const [filters, setFilters] = useState({ q: '', dept: '', district: '', priority: '' });

  const depts = useMemo(() => [...new Set(challenges.map(c => c.dept))], [challenges]);
  const districts = useMemo(() => [...new Set(challenges.map(c => c.district))], [challenges]);

  const filtered = useMemo(() => challenges.filter(c =>
    (!filters.dept || c.dept === filters.dept) &&
    (!filters.district || c.district === filters.district) &&
    (!filters.priority || c.priority === filters.priority) &&
    (!filters.q || (c.title + c.id).toLowerCase().includes(filters.q.toLowerCase()))
  ), [challenges, filters]);

  const hasFilters = Object.values(filters).some(v => v);

  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left">
          <h1 className="h1">Pathway Board</h1>
          <p>Every challenge flows through 10 governed stages from problem definition to scale-up decision.</p>
        </div>
        <div className="ph-actions">
          <Link className="btn btn-primary" to="/challenges/new"><Icon name="plus" />New Challenge</Link>
        </div>
      </div>

      <div className="filter-bar">
        <input className="input" placeholder="Search challenges…" value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <select className="select" value={filters.dept} onChange={(e) => setFilters({ ...filters, dept: e.target.value })}>
          <option value="">All departments</option>
          {depts.map(d => <option key={d}>{d}</option>)}
        </select>
        <select className="select" value={filters.district} onChange={(e) => setFilters({ ...filters, district: e.target.value })}>
          <option value="">All districts</option>
          {districts.map(d => <option key={d}>{d}</option>)}
        </select>
        <select className="select" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
          <option value="">All priorities</option>
          <option>High</option><option>Medium</option><option>Low</option>
        </select>
        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ q: '', dept: '', district: '', priority: '' })}>
            <Icon name="x" />Clear
          </button>
        )}
      </div>

      <div className="board-wrap">
        <div className="board">
          {STAGES.map(s => {
            const items = filtered.filter(c => c.stage === s.key);
            return (
              <div className="board-col" key={s.key}>
                <div className="board-col-head">
                  <b>{s.num}. {s.name}</b>
                  <span className="cnt">{items.length}</span>
                </div>
                <div className="board-col-body">
                  {items.length
                    ? items.map(c => <ChallengeCard key={c.id} challenge={c} />)
                    : <div className="board-empty">No challenges in this stage</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}