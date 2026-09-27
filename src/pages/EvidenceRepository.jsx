import { useState } from 'react';
import { EvidenceCard } from '../components/widgets/EvidenceCard.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { Icon } from '../components/Icons.jsx';

export default function EvidenceRepository() {
  const evidence = useAppStore(s => s.evidence);
  const [filters, setFilters] = useState({ q: '', type: '', status: '' });
  const types = [...new Set(evidence.map(e => e.type))];

  const filtered = evidence.filter(e =>
    (!filters.status || e.status === filters.status) &&
    (!filters.type || e.type === filters.type) &&
    (!filters.q || (e.name + e.type + e.uploadedBy).toLowerCase().includes(filters.q.toLowerCase()))
  );

  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left">
          <h1 className="h1">Evidence Repository</h1>
          <p>All pilot evidence, traceable to milestones, KPIs and verifiers</p>
        </div>
        <div className="ph-actions">
          <button className="btn btn-secondary"><Icon name="download" />Export index</button>
        </div>
      </div>

      <div className="grid g-3" style={{ marginBottom: 16 }}>
        <div className="card card-pad">
          <div className="kpi-label"><Icon name="evidence" />Total evidence</div>
          <div className="kpi-value" style={{ marginTop: 6 }}>{evidence.length}</div>
        </div>
        <div className="card card-pad">
          <div className="kpi-label"><Icon name="checkCircle" />Verified</div>
          <div className="kpi-value" style={{ marginTop: 6, color: 'var(--success)' }}>
            {evidence.filter(e => e.status === 'Verified').length}
          </div>
        </div>
        <div className="card card-pad">
          <div className="kpi-label"><Icon name="clock" />Awaiting review</div>
          <div className="kpi-value" style={{ marginTop: 6, color: 'var(--warning)' }}>
            {evidence.filter(e => e.status !== 'Verified' && e.status !== 'Rejected').length}
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <input className="input" placeholder="Search by name, type, uploader…" value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <select className="select" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
          <option value="">All types</option>
          {types.map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          {['Submitted', 'Under review', 'Verified', 'Rejected'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length
        ? <div className="grid g-3">{filtered.map(e => <EvidenceCard key={e.id} evidence={e} />)}</div>
        : <EmptyState icon="evidence" title="No evidence matches your filters" body="Try a different search or clear filters." />}
    </div>
  );
}