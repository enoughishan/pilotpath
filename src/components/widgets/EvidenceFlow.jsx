import { Icon } from '../Icons.jsx';
import { useAppStore } from '../../store/useAppStore.js';
import { fmtINR, fmtDate } from '../../utils/format.js';

export function EvidenceFlow({ pilot, validation }) {
  const state = useAppStore();
  if (!pilot) return null;
  const evidence = state.evidence.filter(e => e.pilotId === pilot.id);
  if (!evidence.length && !validation) return null;

  const verified = evidence.filter(e => e.status === 'Verified');
  const paid = state.payments.filter(p => p.pilotId === pilot.id && p.status === 'PAID');
  const locked = state.payments.filter(p => p.pilotId === pilot.id && p.status !== 'PAID');

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h3>Evidence → Validation → Payment</h3>
          <p>How collected evidence flows into financial and procurement decisions</p>
        </div>
      </div>
      <div className="card-pad">
        <div className="grid g-4" style={{ gap: 14, alignItems: 'start' }}>
          <div>
            <div className="xsmall" style={{ fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Evidence</div>
            {evidence.slice(0, 4).map(e => (
              <div className="flow-item" key={e.id}>
                <span style={{ color: e.status === 'Verified' ? 'var(--success)' : e.status === 'Rejected' ? 'var(--danger)' : 'var(--warning)' }}>
                  <Icon name={e.status === 'Verified' ? 'checkCircle' : e.status === 'Rejected' ? 'x' : 'clock'} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div className="flow-title">{e.type}</div>
                  <div className="flow-meta">{e.milestone} · {e.status}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="xsmall" style={{ fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Validator</div>
            {validation ? (
              <div className="flow-box" style={{
                background: validation.status === 'Validated' ? 'var(--success-50)' : 'var(--warning-50)',
                borderColor: validation.status === 'Validated' ? 'var(--success-100)' : 'var(--warning-100)'
              }}>
                <div style={{ color: validation.status === 'Validated' ? 'var(--success)' : 'var(--warning)', marginBottom: 4 }}>
                  <Icon name={validation.status === 'Validated' ? 'award' : 'clock'} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--navy)' }}>{validation.status}</div>
                <div className="xsmall muted" style={{ marginTop: 2 }}>{validation.validator}</div>
                {validation.validatedAt && <div className="xsmall muted">{fmtDate(validation.validatedAt)}</div>}
              </div>
            ) : (
              <div className="flow-box" style={{ background: 'var(--surface-2)' }}>
                <div style={{ color: 'var(--text-3)', marginBottom: 4 }}><Icon name="clock" /></div>
                <div style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--text-3)' }}>Not started</div>
              </div>
            )}
            <div className="xsmall muted" style={{ marginTop: 6 }}>{verified.length}/{evidence.length} verified</div>
          </div>

          <div>
            <div className="xsmall" style={{ fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Payment</div>
            {paid.map(p => (
              <div className="flow-item" key={p.id}>
                <span style={{ color: 'var(--success)' }}><Icon name="checkCircle" /></span>
                <div><div className="flow-title">{p.milestone}</div><div className="flow-meta">{fmtINR(p.amount)} released</div></div>
              </div>
            ))}
            {locked.slice(0, 2).map(p => (
              <div className="flow-item" key={p.id}>
                <span style={{ color: 'var(--text-4)' }}><Icon name="lock" /></span>
                <div><div className="flow-title">{p.milestone}</div><div className="flow-meta">{fmtINR(p.amount)} · {p.status.replace(/_/g, ' ').toLowerCase()}</div></div>
              </div>
            ))}
          </div>

          <div>
            <div className="xsmall" style={{ fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Outcome</div>
            <div className="flow-box" style={{ background: 'var(--primary-50)', borderColor: 'var(--primary-100)' }}>
              <div style={{ color: 'var(--primary)', marginBottom: 4 }}><Icon name="scaleup" /></div>
              <div style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--navy)' }}>Scale-up readiness</div>
              <div className="xsmall muted" style={{ marginTop: 2 }}>
                {validation?.status === 'Validated' ? 'Evidence supports procurement decision' : 'Awaiting independent validation'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}