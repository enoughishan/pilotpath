import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { Badge, PriorityBadge } from '../components/ui/Badge.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { STAGES } from '../data/seed.js';
import { fmtDate } from '../utils/format.js';

export default function Challenges() {
  const challenges = useAppStore(s => s.challenges);
  const [filters, setFilters] = useState({ q: '', dept: '', stage: '' });
  const depts = useMemo(() => [...new Set(challenges.map(c => c.dept))], [challenges]);

  const filtered = challenges.filter(c =>
    (!filters.dept || c.dept === filters.dept) &&
    (!filters.stage || c.stage === filters.stage) &&
    (!filters.q || (c.title + c.id + c.district).toLowerCase().includes(filters.q.toLowerCase()))
  );

  const hasFilters = Object.values(filters).some(v => v);

  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left">
          <h1 className="h1">Challenges</h1>
          <p>{challenges.length} challenges across {depts.length} departments and 5 districts</p>
        </div>
        <div className="ph-actions">
          <Link className="btn btn-primary" to="/challenges/new"><Icon name="plus" />New Challenge</Link>
        </div>
      </div>

      <div className="filter-bar">
        <input className="input" placeholder="Search by title, ID, district…" value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <select className="select" value={filters.dept} onChange={(e) => setFilters({ ...filters, dept: e.target.value })}>
          <option value="">All departments</option>
          {depts.map(d => <option key={d}>{d}</option>)}
        </select>
        <select className="select" value={filters.stage} onChange={(e) => setFilters({ ...filters, stage: e.target.value })}>
          <option value="">All stages</option>
          {STAGES.map(s => <option key={s.key} value={s.key}>{s.name}</option>)}
        </select>
        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ q: '', dept: '', stage: '' })}>
            <Icon name="x" />Clear
          </button>
        )}
      </div>

      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Title</th><th>Department</th><th>District</th>
              <th>Stage</th><th>Priority</th><th>Day</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? filtered.map(c => (
              <tr key={c.id} onClick={() => window.location.hash = `#/challenges/${c.id}`} style={{ cursor: 'pointer' }}>
                <td><span className="mono" style={{ fontWeight: 700 }}>{c.id}</span></td>
                <td style={{ fontWeight: 600, maxWidth: 340 }}>{c.title}</td>
                <td className="muted">{c.dept}</td>
                <td className="muted">{c.district}</td>
                <td><Badge status={c.stage} /></td>
                <td><PriorityBadge priority={c.priority} /></td>
                <td className="muted">Day {c.day}</td>
                <td><Badge status={c.status} /></td>
                <td><Icon name="chevronRight" /></td>
              </tr>
            )) : (
              <tr><td colSpan="9"><EmptyState icon="challenge" title="No challenges match your filters" body="Try clearing filters or search with a different term." /></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}