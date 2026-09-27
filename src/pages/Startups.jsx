import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { ScoreBar } from '../components/widgets/Chart.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { DISTRICTS } from '../data/seed.js';
import { matchScore } from '../utils/scoring.js';
import { fmtLakh, initials } from '../utils/format.js';

export default function Startups() {
  const state = useAppStore();
  const [filters, setFilters] = useState({ q: '', industry: '', district: '' });
  const industries = useMemo(() => [...new Set(state.startups.map(s => s.industry))], [state.startups]);

  const filtered = state.startups.filter(s =>
    (!filters.industry || s.industry === filters.industry) &&
    (!filters.district || s.district === filters.district) &&
    (!filters.q || (s.name + s.tech + s.industry).toLowerCase().includes(filters.q.toLowerCase()))
  );

  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left">
          <h1 className="h1">Startup Discovery</h1>
          <p>{state.startups.length} DPIIT-recognised startups · Match scores are explainable, not opaque</p>
        </div>
      </div>

      <div className="filter-bar">
        <input className="input" placeholder="Search startups…" value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <select className="select" value={filters.industry} onChange={(e) => setFilters({ ...filters, industry: e.target.value })}>
          <option value="">All industries</option>
          {industries.map(i => <option key={i}>{i}</option>)}
        </select>
        <select className="select" value={filters.district} onChange={(e) => setFilters({ ...filters, district: e.target.value })}>
          <option value="">All districts</option>
          {DISTRICTS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="grid g-3">
        {filtered.length ? filtered.map(s => {
          const challenge = state.challenges.find(c => c.industry === s.industry) || state.challenges[0];
          const ms = matchScore(s, challenge);
          return (
            <Link key={s.id} to={`/startups/${s.id}`} className="card card-pad" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                <div className="avatar" style={{ width: 44, height: 44, borderRadius: 11, fontSize: 14 }}>
                  {initials(s.name)}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="h3">{s.name}</div>
                  <div className="small muted">{s.tech}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                <span className="badge badge-neutral"><Icon name="mapPin" />{s.district}</span>
                <span className="badge badge-neutral"><Icon name="building" />{s.industry}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '12px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
                <div><div className="xsmall muted">Match</div><div className="h3" style={{ color: 'var(--primary)' }}>{ms.overall}%</div></div>
                <div><div className="xsmall muted">Deployments</div><div className="h3">{s.deployments}</div></div>
                <div><div className="xsmall muted">Est. cost</div><div className="h3">{fmtLakh(s.cost)}</div></div>
              </div>
              {ms.parts.slice(0, 3).map((p, i) => <ScoreBar key={i} label={p.label} value={p.value} color={p.color} />)}
            </Link>
          );
        }) : <EmptyState icon="startup" title="No startups match your filters" />}
      </div>
    </div>
  );
}