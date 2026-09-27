import { useState, useMemo } from 'react';
import { Badge } from '../components/ui/Badge.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { Icon } from '../components/Icons.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { useSession } from '../store/useSession.js';
import { fmtINR, fmtDate } from '../utils/format.js';
import { useToast } from '../components/ui/Toast.jsx';

export default function Payments() {
  const state = useAppStore();
  const { role, user } = useSession();
  const toast = useToast();
  const [action, setAction] = useState(null);
  const [reason, setReason] = useState('');
  const [filters, setFilters] = useState({ q: '', status: '' });

  /* ---------- Summary ---------- */
  const totalReleased = state.payments
    .filter(p => p.status === 'PAID')
    .reduce((a, p) => a + p.amount, 0);

  const totalPending = state.payments
    .filter(p => ['AWAITING_VALIDATION', 'AWAITING_PAYMENT', 'PENDING_EVIDENCE'].includes(p.status))
    .reduce((a, p) => a + p.amount, 0);

  const totalLocked = state.payments
    .filter(p => p.status === 'LOCKED')
    .reduce((a, p) => a + p.amount, 0);

  const pendingCount = state.payments.filter(
    p => ['AWAITING_PAYMENT', 'AWAITING_VALIDATION', 'PENDING_EVIDENCE'].includes(p.status)
  ).length;

  /* ---------- Filtering ---------- */
  const filtered = useMemo(() => {
    return state.payments.filter(p => {
      const pilot = state.pilots.find(x => x.id === p.pilotId);
      const matchQ =
        !filters.q ||
        (p.id + p.milestone + (pilot?.title || '')).toLowerCase().includes(filters.q.toLowerCase());
      const matchStatus = !filters.status || p.status === filters.status;
      return matchQ && matchStatus;
    });
  }, [state.payments, state.pilots, filters]);

  /* ---------- Confirm handlers ---------- */
  const handleConfirm = () => {
    if (!reason.trim()) {
      toast.error('Reason required', 'Please explain your decision.');
      return;
    }
    const isApprove = action.type === 'approve';
    state.update('payments', action.payment.id, {
      status: isApprove ? 'PAID' : 'PENDING_EVIDENCE',
      approvedBy: user?.name,
      approvedAt: new Date().toISOString(),
      paidAt: isApprove ? new Date().toISOString() : null,
      reason
    });
    state.logAudit({
      user: user?.name,
      role: 'Accounts Officer',
      action: isApprove ? 'Payment approved' : 'Payment placed on hold',
      entity: action.payment.id,
      details: reason
    });
    toast.success(
      isApprove ? 'Payment approved' : 'Payment placed on hold',
      `${action.payment.milestone} · ${fmtINR(action.payment.amount)}`
    );
    setAction(null);
    setReason('');
  };

  const canAct = (p) =>
    role === 'accounts' &&
    ['AWAITING_PAYMENT', 'AWAITING_VALIDATION', 'PENDING_EVIDENCE'].includes(p.status);

  return (
    <div className="content">
      {/* ================ PAGE HERO ================ */}
      <div className="page-hero">
        <div className="page-hero-eyebrow">
          <span className="dot" />
          Milestone payments
        </div>
        <h1 className="page-hero-title">Payments</h1>
        <p className="page-hero-sub">
          Every payment is tied to verified milestone evidence. No payment is
          released without required evidence and independent validation.
        </p>
        <div className="page-hero-meta">
          <span><Icon name="payment" /> <b>{state.payments.length}</b> total</span>
          <span><Icon name="clock" /> <b>{pendingCount}</b> pending action</span>
          <span><Icon name="checkCircle" /> <b>{state.payments.filter(p => p.status === 'PAID').length}</b> released</span>
        </div>
      </div>

      {/* ================ SUMMARY CARDS ================ */}
      <div className="payment-summary">
        <div className="payment-summary-card" style={{ '--summary-accent': '#047857' }}>
          <div className="payment-summary-label">
            <Icon name="checkCircle" />
            Released
          </div>
          <div className="payment-summary-value">{fmtINR(totalReleased)}</div>
          <div className="payment-summary-sub">
            {state.payments.filter(p => p.status === 'PAID').length} payments
          </div>
        </div>
        <div className="payment-summary-card" style={{ '--summary-accent': '#B45309' }}>
          <div className="payment-summary-label">
            <Icon name="clock" />
            Pending
          </div>
          <div className="payment-summary-value">{fmtINR(totalPending)}</div>
          <div className="payment-summary-sub">Awaiting approval or validation</div>
        </div>
        <div className="payment-summary-card" style={{ '--summary-accent': '#1B4D89' }}>
          <div className="payment-summary-label">
            <Icon name="lock" />
            Locked
          </div>
          <div className="payment-summary-value">{fmtINR(totalLocked)}</div>
          <div className="payment-summary-sub">Not yet reached</div>
        </div>
        <div className="payment-summary-card" style={{ '--summary-accent': '#6D28D9' }}>
          <div className="payment-summary-label">
            <Icon name="target" />
            Avg turnaround
          </div>
          <div className="payment-summary-value">3.2 days</div>
          <div className="payment-summary-sub">Within 30-day SLA</div>
        </div>
      </div>

      {/* ================ FILTER BAR ================ */}
      <div className="filter-bar-premium">
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Icon
            name="search"
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 15,
              height: 15,
              color: 'var(--text-4)'
            }}
          />
          <input
            className="input"
            style={{ paddingLeft: 36 }}
            placeholder="Search by payment ID, milestone, or pilot…"
            value={filters.q}
            onChange={e => setFilters({ ...filters, q: e.target.value })}
          />
        </div>
        <select
          className="select"
          value={filters.status}
          onChange={e => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All statuses</option>
          <option value="PAID">Paid</option>
          <option value="AWAITING_PAYMENT">Awaiting payment</option>
          <option value="AWAITING_VALIDATION">Awaiting validation</option>
          <option value="PENDING_EVIDENCE">Pending evidence</option>
          <option value="LOCKED">Locked</option>
        </select>
      </div>

      {/* ================ TABLE ================ */}
      {filtered.length ? (
        <div style={{ overflowX: 'auto' }}>
          <table className="payment-table">
            <thead>
              <tr>
                <th style={{ width: 130 }}>Payment ID</th>
                <th>Pilot &amp; Milestone</th>
                <th style={{ width: 140 }}>Amount</th>
                <th style={{ width: 160 }}>Status</th>
                <th style={{ width: 160 }}>Approved by</th>
                <th style={{ width: 180, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const pilot = state.pilots.find(x => x.id === p.pilotId);
                const showActions = canAct(p);
                return (
                  <tr key={p.id}>
                    <td>
                      <span className="payment-id-cell">{p.id}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 650, color: 'var(--navy)', marginBottom: 2 }}>
                        Milestone {p.milestone}
                      </div>
                      <div className="small muted">
                        {pilot?.title || p.pilotId} · {p.contractId}
                      </div>
                    </td>
                    <td>
                      <span className="payment-amount-cell">{fmtINR(p.amount)}</span>
                    </td>
                    <td>
                      <Badge status={p.status} />
                    </td>
                    <td>
                      {p.approvedBy ? (
                        <div>
                          <div className="small" style={{ fontWeight: 600, color: 'var(--navy)' }}>
                            {p.approvedBy}
                          </div>
                          <div className="xsmall muted">
                            {p.approvedAt ? fmtDate(p.approvedAt) : '—'}
                          </div>
                        </div>
                      ) : (
                        <span className="muted small">—</span>
                      )}
                    </td>
                    <td>
                      <div className="payment-actions">
                        {showActions ? (
                          <>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => setAction({ type: 'approve', payment: p })}
                            >
                              <Icon name="check" />
                              Approve
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setAction({ type: 'hold', payment: p })}
                            >
                              <Icon name="pause" />
                              Hold
                            </button>
                          </>
                        ) : (
                          <button className="btn btn-ghost btn-sm">
                            <Icon name="eye" />
                            View
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-premium">
          <Icon name="payment" />
          <b>No payments match your filters</b>
          <p>Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}

      {/* ================ CONFIRM MODAL ================ */}
      <Modal
        open={!!action}
        title={action?.type === 'approve' ? 'Approve payment' : 'Place payment on hold'}
        onClose={() => {
          setAction(null);
          setReason('');
        }}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setAction(null);
                setReason('');
              }}
            >
              Cancel
            </button>
            <button
              className={action?.type === 'approve' ? 'btn btn-success' : 'btn btn-danger'}
              onClick={handleConfirm}
            >
              <Icon name="check" />
              Confirm {action?.type === 'approve' ? 'approval' : 'hold'}
            </button>
          </>
        }
      >
        {action && (
          <>
            <div
              style={{
                padding: 14,
                background: action.type === 'approve' ? 'var(--success-50)' : 'var(--warning-50)',
                borderRadius: 10,
                marginBottom: 16
              }}
            >
              <div
                className="h4"
                style={{
                  color: action.type === 'approve' ? 'var(--success)' : 'var(--warning)',
                  marginBottom: 4
                }}
              >
                <Icon name={action.type === 'approve' ? 'checkCircle' : 'alertTriangle'} />{' '}
                {action.type === 'approve' ? 'Approving payment' : 'Placing on hold'}
              </div>
              <p className="small" style={{ color: 'var(--text-2)' }}>
                You are about to {action.type === 'approve' ? 'approve' : 'hold'}{' '}
                <b>{fmtINR(action.payment.amount)}</b> for milestone{' '}
                <b>{action.payment.milestone}</b>. This action will be recorded in the
                audit log.
              </p>
            </div>

            <div className="field">
              <label>
                Reason <span className="req">*</span>
              </label>
              <textarea
                className="textarea"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder={
                  action.type === 'approve'
                    ? 'e.g. Milestone evidence verified and validation certificate on file.'
                    : 'e.g. Evidence incomplete; awaiting validator confirmation.'
                }
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}