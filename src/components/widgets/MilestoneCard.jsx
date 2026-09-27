import { Badge } from '../ui/Badge.jsx';
import { fmtINR, fmtDate } from '../../utils/format.js';

const TONE_MAP = { PAID: 'success', AWAITING_VALIDATION: 'warning', AWAITING_PAYMENT: 'warning', IN_PROGRESS: 'primary', LOCKED: 'border-2' };

export function MilestoneCard({ milestone, contractValue }) {
  const m = milestone;
  const pct = contractValue ? Math.round((m.amount / contractValue) * 100) : 0;
  const tone = TONE_MAP[m.status] || 'border-2';

  return (
    <div className="card card-pad" style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: 'var(--primary-50)', color: 'var(--primary)',
            display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0
          }}>{m.id}</div>
          <div style={{ minWidth: 0 }}>
            <div className="h3">{m.name}</div>
            <div className="small muted">Due {fmtDate(m.due)} · {pct}% of contract</div>
          </div>
        </div>
        <Badge status={m.status} />
      </div>
      <div className="progress" style={{ marginBottom: 10 }}>
        <span style={{ width: `${pct}%`, background: `var(--${tone})` }} />
      </div>
      <div className="grid g-2" style={{ gap: 10 }}>
        <div><div className="xsmall muted">Amount</div><div className="h4">{fmtINR(m.amount)}</div></div>
        <div><div className="xsmall muted">Evidence required</div><div className="h4">{m.evidenceRequired ? 'Yes' : 'No'}</div></div>
      </div>
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
        <div className="xsmall muted" style={{ marginBottom: 2 }}>Deliverables</div>
        <div className="small">{m.deliverables}</div>
      </div>
      {m.paidAt && <div className="small muted" style={{ marginTop: 8 }}>Paid on {fmtDate(m.paidAt)}</div>}
    </div>
  );
}