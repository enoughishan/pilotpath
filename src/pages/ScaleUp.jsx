import { useAppStore } from '../store/useAppStore.js';
import { useSession } from '../store/useSession.js';
import { useToast } from '../components/ui/Toast.jsx';
import { PublicValue } from '../components/widgets/PublicValue.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { useState } from 'react';
import { Modal } from '../components/ui/Modal.jsx';
import { Icon } from '../components/Icons.jsx';
import { fmtDate, fmtINR } from '../utils/format.js';

export default function ScaleUp() {
  const state = useAppStore();
  const { role, persona } = useSession();
  const toast = useToast();
  const [decisionModal, setDecisionModal] = useState(null);
  const [reason, setReason] = useState('');
  const [evidenceRef, setEvidenceRef] = useState('');

  const handleConfirm = () => {
    if (!reason.trim() || !evidenceRef.trim()) { toast.error('Required fields'); return; }
    state.update('scaleup', decisionModal.decision.id, {
      status: 'Decided',
      decision: decisionModal.pathway,
      reason,
      evidenceRef,
      officer: persona()?.name,
      decidedAt: new Date().toISOString()
    });
    state.logAudit({ user: persona()?.name, role: 'Government Officer', action: 'Scale-up decision recorded', entity: decisionModal.decision.id, details: `${decisionModal.pathway}. ${reason}` });
    toast.success('Decision recorded', decisionModal.pathway);
    setDecisionModal(null);
    setReason('');
    setEvidenceRef('');
  };

  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left">
          <h1 className="h1">Scale-up Decisions</h1>
          <p>Decision support only — the authorised officer makes the final call</p>
        </div>
      </div>

      {state.scaleup.map(d => {
        const pilot = state.pilots.find(p => p.id === d.pilotId);
        const validation = state.validations.find(v => v.pilotId === d.pilotId);
        return (
          <div className="card" key={d.id} style={{ marginBottom: 20 }}>
            <div className="card-head">
              <div><h3>{pilot?.title}</h3><p>{d.id}</p></div>
              <Badge status={d.status} />
            </div>
            <div className="card-pad">
              <PublicValue pilot={pilot} validation={validation} />
              <div className="matrix" style={{ marginBottom: 16 }}>
                {Object.entries(d.matrix).map(([k, v]) => {
                  const tone = v === 'High' ? 'success' : v === 'Medium' ? 'warning' : 'danger';
                  return (
                    <div className="matrix-cell" key={k}>
                      <div className="mc-label">{k.charAt(0).toUpperCase() + k.slice(1)}</div>
                      <div className="mc-val" style={{ color: `var(--${tone})` }}>{v}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ padding: 14, background: 'var(--primary-50)', borderRadius: 10, marginBottom: 16 }}>
                <div className="xsmall" style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
                  <Icon name="sparkles" /> Decision support
                </div>
                <p className="small">{d.recommendation}</p>
              </div>
              {role === 'gov' && d.status === 'Pending' && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Continue pilot', 'Extend pilot', 'Departmental procurement', 'Multi-district scale-up', 'Re-evaluation', 'Close pilot'].map(opt => (
                    <button key={opt} className="btn btn-secondary" onClick={() => setDecisionModal({ decision: d, pathway: opt })}>{opt}</button>
                  ))}
                </div>
              )}
              {d.decision && (
                <div className="card card-pad" style={{ background: 'var(--success-50)', borderColor: 'var(--success-100)' }}>
                  <div className="h4" style={{ color: 'var(--success)', marginBottom: 8 }}><Icon name="checkCircle" /> Decision recorded</div>
                  <div className="metric-row"><span className="mr-label">Decision</span><span className="mr-val">{d.decision}</span></div>
                  <div className="metric-row"><span className="mr-label">Officer</span><span className="mr-val">{d.officer}</span></div>
                  <div className="metric-row"><span className="mr-label">Date</span><span className="mr-val">{fmtDate(d.decidedAt)}</span></div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <Modal open={!!decisionModal} title="Record scale-up decision" onClose={() => setDecisionModal(null)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDecisionModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleConfirm}><Icon name="check" />Record decision</button>
          </>
        }>
        {decisionModal && (
          <>
            <div style={{ padding: 12, background: 'var(--warning-50)', borderRadius: 10, marginBottom: 16 }}>
              <div className="h4" style={{ color: 'var(--warning)' }}><Icon name="alertTriangle" /> Government decision</div>
              <p className="small" style={{ marginTop: 4 }}>This will be permanently recorded in the audit log.</p>
            </div>
            <div className="field"><label>Pathway</label><input className="input" value={decisionModal.pathway} readOnly /></div>
            <div className="field">
              <label>Reason <span className="req">*</span></label>
              <textarea className="textarea" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            <div className="field">
              <label>Evidence reference <span className="req">*</span></label>
              <input className="input" value={evidenceRef} onChange={(e) => setEvidenceRef(e.target.value)} placeholder="e.g. VL-022 validation certificate" />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}