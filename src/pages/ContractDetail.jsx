import { useParams, Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { fmtINR, fmtDate } from '../utils/format.js';

export default function ContractDetail() {
  const { id } = useParams();
  const state = useAppStore();
  const ct = state.contracts.find(x => x.id === id);
  if (!ct) return <div className="content"><EmptyState icon="alert" title="Contract not found" /></div>;

  const ch = state.challenges.find(c => c.id === ct.challengeId);
  const s = state.startups.find(x => x.id === ct.startupId);
  const pays = state.payments.filter(p => p.contractId === ct.id);

  return (
    <div className="content">
      <div className="breadcrumb">
        <Link to="/contracts">Contracts</Link><span> / {ct.id}</span>
      </div>
      <div className="page-head">
        <div className="ph-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span className="mono" style={{ fontWeight: 800, color: 'var(--primary)' }}>{ct.id}</span>
            <Badge status={ct.status} />
          </div>
          <h1 className="h1">{ch?.title}</h1>
          <p>{s?.name} · Signed {fmtDate(ct.signedAt)}</p>
        </div>
      </div>
      <div className="grid g-2-1">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card card-pad">
            <div className="grid g-3" style={{ gap: 16 }}>
              <div><div className="xsmall muted">Value</div><div className="h2">{fmtINR(ct.value)}</div></div>
              <div><div className="xsmall muted">Start</div><div className="h3">{fmtDate(ct.start)}</div></div>
              <div><div className="xsmall muted">End</div><div className="h3">{fmtDate(ct.end)}</div></div>
            </div>
          </div>
          {['ipClause', 'dataClause', 'securityClause', 'termination'].map(key => (
            <div key={key} className="card card-pad">
              <h3 className="h3" style={{ marginBottom: 10, textTransform: 'capitalize' }}>
                {key.replace(/([A-Z])/g, ' $1').replace(/Clause/g, 'Clause')}
              </h3>
              <p style={{ color: 'var(--text-2)', lineHeight: 1.65 }}>{ct[key]}</p>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-head"><h3>Payment schedule</h3></div>
          <div className="card-pad">
            {pays.map(p => (
              <div className="metric-row" key={p.id}>
                <div><div className="mr-label" style={{ fontWeight: 600, color: 'var(--navy)' }}>{p.milestone}</div><div className="xsmall muted">{fmtINR(p.amount)}</div></div>
                <Badge status={p.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}