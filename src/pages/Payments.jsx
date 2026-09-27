import { Badge } from '../components/ui/Badge.jsx';
import { KpiCard } from '../components/widgets/KpiCard.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { useSession } from '../store/useSession.js';
import { fmtINR } from '../utils/format.js';
import { useToast } from '../components/ui/Toast.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { useState } from 'react';
import { Icon } from '../components/Icons.jsx';

export default function Payments() {
  const state = useAppStore();
  const { role, persona } = useSession();
  const toast = useToast();
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState('');

  const totalPaid = state.payments.filter(p => p.status === 'PAID').reduce((a, p) => a + p.amount, 0);
  const totalPending = state.payments.filter(p => ['AWAITING_VALIDATION', 'AWAITING_PAYMENT', 'PENDING_EVIDENCE'].includes(p.status)).reduce((a, p) => a + p.amount, 0);
  const totalLocked = state.payments.filter(p => p.status === 'LOCKED').reduce((a, p) => a + p.amount, 0);

  const handleConfirm = () => {
    if (!reason.trim()) { toast.error('Reason required', 'A reason is mandatory.'); return; }
    const isApprove = action.type === 'approve';
    state.update('payments', action.payment.id, {
      status: isApprove ? 'PAID' : 'PENDING_EVIDENCE',
      approvedBy: persona()?.name,
      approvedAt: new Date().toISOString(),
      paidAt: isApprove ? new Date().toISOString() : null,
      reason
    });
    state.logAudit({ user: persona()?.name, role: 'Accounts Officer', action: isApprove ? 'Payment approved' : 'Payment placed on hold', entity: action.payment.id, details: reason });
    toast.success(isApprove ? 'Payment approved' : 'Payment placed on hold', `${action.payment.milestone} · ${fmtINR(action.payment.amount)}`);
    setAction(null);
    setReason('');
  };

  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left"><h1 className="h1">Payments</h1><p>Milestone-based payments · evidence-gated</p></div>
      </div>
      <div className="grid g-3" style={{ marginBottom: 20 }}>
        <KpiCard label="Released" value={fmtINR(totalPaid)} accent="green" iconName="checkCircle" />
        <KpiCard label="Pending" value={fmtINR(totalPending)} accent="amber" iconName="clock" />
        <KpiCard label="Locked" value={fmtINR(totalLocked)} accent="blue" iconName="lock" />
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Payment</th><th>Pilot</th><th>Milestone</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {state.payments.map(p => {
              const pilot = state.pilots.find(x => x.id === p.pilotId);
              const canAct = role === 'accounts' && ['AWAITING_PAYMENT', 'AWAITING_VALIDATION', 'PENDING_EVIDENCE'].includes(p.status);
              return (
                <tr key={p.id}>
                  <td><span className="mono" style={{ fontWeight: 700 }}>{p.id}</span></td>
                  <td><b className="small">{pilot?.title}</b></td>
                  <td><b>{p.milestone}</b></td>
                  <td><b>{fmtINR(p.amount)}</b></td>
                  <td><Badge status={p.status} /></td>
                  <td>
                    {canAct ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-success btn-sm" onClick={() => setAction({ type: 'approve', payment: p })}>
                          <Icon name="check" />Approve
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setAction({ type: 'hold', payment: p })}>
                          <Icon name="pause" />Hold
                        </button>
                      </div>
                    ) : <span className="muted small">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={!!action} title={action?.type === 'approve' ? 'Approve payment' : 'Hold payment'} onClose={() => setAction(null)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setAction(null)}>Cancel</button>
            <button className={action?.type === 'approve' ? 'btn btn-success' : 'btn btn-danger'} onClick={handleConfirm}>
              <Icon name="check" />Confirm
            </button>
          </>
        }>
        {action && (
          <>
            <p className="small muted" style={{ marginBottom: 14 }}>
              {action.type === 'approve' ? 'Approve' : 'Hold'} {fmtINR(action.payment.amount)} for milestone {action.payment.milestone}.
            </p>
            <div className="field">
              <label>Reason <span className="req">*</span></label>
              <textarea className="textarea" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain your decision…" />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}