import { useAppStore } from '../store/useAppStore.js';
import { Badge } from '../components/ui/Badge.jsx';
import { Icon } from '../components/Icons.jsx';
import { useSession } from '../store/useSession.js';
import { fmtDate } from '../utils/format.js';
import { useState } from 'react';
import { Modal } from '../components/ui/Modal.jsx';
import { useToast } from '../components/ui/Toast.jsx';

export default function Validation() {
  const state = useAppStore();
  const { role, persona } = useSession();
  const toast = useToast();
  const [activeValidation, setActiveValidation] = useState(null);
  const [comments, setComments] = useState('');

  const handleIssue = () => {
    if (!comments.trim()) { toast.error('Comments required'); return; }
    const v = activeValidation;
    const updatedKpis = v.kpis.map(k => ({ ...k, verified: k.startupReported, status: 'Verified' }));
    state.update('validations', v.id, {
      kpis: updatedKpis,
      status: 'Validated',
      validatedAt: new Date().toISOString(),
      validator: persona()?.name,
      comments
    });
    state.logAudit({ user: persona()?.name, role: 'Principal Validator', action: 'Validation completed', entity: v.id, details: comments });
    const pilot = state.pilots.find(p => p.id === v.pilotId);
    if (pilot) state.update('pilots', pilot.id, { status: 'Validated', progress: 100 });
    toast.success('Validation certificate issued', v.id);
    setActiveValidation(null);
    setComments('');
  };

  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left">
          <h1 className="h1">Independent Validation</h1>
          <p>Validator compares baseline, startup-reported and independently verified values</p>
        </div>
      </div>
      {state.validations.map(v => {
        const pilot = state.pilots.find(p => p.id === v.pilotId);
        return (
          <div className="card" key={v.id} style={{ marginBottom: 16 }}>
            <div className="card-head">
              <div><h3>{pilot?.title}</h3><p>{v.id} · {v.validator}</p></div>
              <Badge status={v.status} />
            </div>
            <div className="card-pad">
              <div style={{ padding: 14, background: 'var(--surface-2)', borderRadius: 10, marginBottom: 16 }}>
                <div className="xsmall muted" style={{ marginBottom: 4 }}>STARTUP CLAIM</div>
                <p style={{ color: 'var(--navy)', fontWeight: 600 }}>"{v.startupClaim}"</p>
                <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
                  <div><div className="xsmall muted">Claimed</div><div className="h4">{v.claimedValue}</div></div>
                  <div><div className="xsmall muted">Verified</div><div className="h4">{v.verifiedValue}</div></div>
                  <div><div className="xsmall muted">Variance</div><div className="h4">{v.variance}</div></div>
                </div>
              </div>

              <div className="tbl-wrap" style={{ marginBottom: 16 }}>
                <table>
                  <thead><tr><th>KPI</th><th>Baseline</th><th>Reported</th><th>Verified</th><th>Status</th></tr></thead>
                  <tbody>
                    {v.kpis.map((k, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{k.name}</td>
                        <td className="muted">{k.baseline}</td>
                        <td>{k.startupReported}</td>
                        <td><b>{k.verified}</b></td>
                        <td><Badge status={k.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="h4" style={{ marginBottom: 8 }}>Validator comments</div>
              <p className="small" style={{ color: 'var(--text-2)', marginBottom: 16 }}>{v.comments}</p>

              {role === 'validator' && v.status !== 'Validated' && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="btn btn-success" onClick={() => setActiveValidation(v)}>
                    <Icon name="checkCircle" />Approve & issue certificate
                  </button>
                  <button className="btn btn-secondary"><Icon name="upload" />Request more evidence</button>
                  <button className="btn btn-danger"><Icon name="x" />Reject</button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <Modal open={!!activeValidation} title="Issue validation certificate" onClose={() => setActiveValidation(null)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setActiveValidation(null)}>Cancel</button>
            <button className="btn btn-success" onClick={handleIssue}><Icon name="award" />Issue certificate</button>
          </>
        }>
        <p className="small muted" style={{ marginBottom: 14 }}>Approve pilot results and issue a validation certificate.</p>
        <div className="field">
          <label>Validator comments <span className="req">*</span></label>
          <textarea className="textarea" value={comments} onChange={(e) => setComments(e.target.value)}
            placeholder="Verified against sensor telemetry and field inspection…" />
        </div>
      </Modal>
    </div>
  );
}