import { useState } from 'react';
import { EvidenceCard } from '../components/widgets/EvidenceCard.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { useAppStore } from '../store/useAppStore.js';

export default function EvidenceVault() {
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
          <h1 className="h1">Evidence Vault</h1>
          <p>{evidence.length} evidence items · traceable to milestones, KPIs and verifiers</p>
        </div>
      </div>

      <div className="filter-bar">
        <input className="input" placeholder="Search evidence…" value={filters.q}
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
        : <EmptyState icon="evidence" title="No evidence matches your filters" />}
    </div>
  );
}