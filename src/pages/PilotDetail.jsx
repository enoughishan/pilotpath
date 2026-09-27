import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Icon } from '../components/Icons.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { PublicValue } from '../components/widgets/PublicValue.jsx';
import { KpiChartCard } from '../components/widgets/KpiChartCard.jsx';
import { MilestoneCard } from '../components/widgets/MilestoneCard.jsx';
import { LineChart } from '../components/widgets/Chart.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { fmtINR, fmtDate } from '../utils/format.js';

export default function PilotDetail() {
  const { id } = useParams();
  const state = useAppStore();
  const [tab, setTab] = useState('monitoring');
  const p = state.pilots.find(x => x.id === id);
  if (!p) return <div className="content"><EmptyState icon="alert" title="Pilot not found" /></div>;

  const ch = state.challenges.find(c => c.id === p.challengeId);
  const s = state.startups.find(x => x.id === p.startupId);
  const validation = state.validations.find(v => v.pilotId === p.id);
  const evidenceCount = state.evidence.filter(e => e.pilotId === p.id).length;

  const tabs = [
    { key: 'monitoring', label: 'Monitoring' },
    { key: 'milestones', label: 'Milestones' },
    { key: 'payments', label: 'Payments' },
    { key: 'validation', label: 'Validation' },
    { key: 'risks', label: 'Risk Monitor' }
  ];

  const trend = p.trend || [];
  const labels = trend.map(t => t.week);
  const paid = p.milestones.filter(m => m.status === 'PAID').reduce((a, m) => a + m.amount, 0);
  const locked = p.budget - paid;

  return (
    <div className="content">
      <div className="breadcrumb">
        <Link to="/pilots">Active Pilots</Link>
        <Icon name="chevronRight" />
        <span>{p.id}</span>
      </div>

      {/* ================ DETAIL HERO ================ */}
      <div className="detail-hero">
        <div className="detail-hero-top">
          <span className="detail-hero-id">{p.id}</span>
          <Badge status={p.status} />
          <span className={`badge badge-${p.riskLevel === 'Low' ? 'success' : p.riskLevel === 'High' ? 'danger' : 'warning'}`}>
            {p.riskLevel} risk
          </span>
        </div>

        <h1 className="detail-hero-title">{p.title}</h1>

        <div className="detail-hero-meta">
          <span><Icon name="startup" /> <b>{s?.name}</b></span>
          <span><Icon name="challenge" /> <b>{ch?.id}</b></span>
          <span><Icon name="mapPin" /> {p.geography}</span>
          <span><Icon name="users" /> {p.users}</span>
          <span><Icon name="calendar" /> {fmtDate(p.startDate)} → {fmtDate(p.endDate)}</span>
        </div>

        <div className="detail-hero-actions">
          <Link className="btn btn-secondary" to="/evidence">
            <Icon name="evidence" />View evidence ({evidenceCount})
          </Link>
          <Link className="btn btn-secondary" to="/payments">
            <Icon name="payment" />View payments
          </Link>
        </div>
      </div>

      {/* ================ KPI STRIP ================ */}
      <div className="detail-kpi-strip">
        <div className="detail-kpi" style={{ '--kpi-accent': '#1B4D89' }}>
          <div className="detail-kpi-label"><Icon name="payment" />Total value</div>
          <div className="detail-kpi-value">{fmtINR(p.budget)}</div>
        </div>
        <div className="detail-kpi" style={{ '--kpi-accent': '#047857' }}>
          <div className="detail-kpi-label"><Icon name="checkCircle" />Released</div>
          <div className="detail-kpi-value">{fmtINR(paid)}</div>
        </div>
        <div className="detail-kpi" style={{ '--kpi-accent': '#B45309' }}>
          <div className="detail-kpi-label"><Icon name="lock" />Locked</div>
          <div className="detail-kpi-value">{fmtINR(locked)}</div>
        </div>
        <div className="detail-kpi" style={{ '--kpi-accent': '#6D28D9' }}>
          <div className="detail-kpi-label"><Icon name="target" />Progress</div>
          <div className="detail-kpi-value">{p.progress}%</div>
        </div>
      </div>

      {/* ================ PUBLIC VALUE ================ */}
      <div style={{ marginBottom: 20 }}>
        <PublicValue pilot={p} validation={validation} />
      </div>

      {/* ================ TABS ================ */}
      <div className="tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ================ TAB CONTENT ================ */}
      {tab === 'monitoring' && (
        <>
          <div className="grid g-3" style={{ marginBottom: 20 }}>
            {p.kpis.map((k, i) => <KpiChartCard key={i} kpi={k} />)}
          </div>

          <div className="grid g-2">
            <div className="card">
              <div className="card-head"><h3>KPI trend over time</h3></div>
              <div className="card-pad">
                <LineChart
                  series={[
                    { name: 'Primary', color: 'var(--primary)', data: trend.map(t => t.loss) },
                    { name: 'Secondary', color: 'var(--warning)', data: trend.map(t => t.response) },
                    { name: 'Coverage', color: 'var(--success)', data: trend.map(t => t.coverage) }
                  ]}
                  labels={labels}
                  height={220}
                />
              </div>
            </div>

            <div className="card">
              <div className="card-head"><h3>Milestone progress</h3></div>
              <div className="card-pad">
                {p.milestones.map(m => {
                  const pct = m.status === 'PAID' ? 100
                    : m.status.includes('AWAITING') ? 70
                    : m.status === 'IN_PROGRESS' ? 30 : 0;
                  return (
                    <div key={m.id} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div>
                          <div className="h4">{m.id} · {m.name}</div>
                          <div className="xsmall muted">{fmtINR(m.amount)} · due {fmtDate(m.due)}</div>
                        </div>
                        <Badge status={m.status} />
                      </div>
                      <div className="progress"><span style={{ width: `${pct}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'milestones' && (
        <div className="card">
          <div className="card-head"><h3>Milestones</h3><p>{p.milestones.length} milestones · {fmtINR(p.budget)} total</p></div>
          <div className="card-pad">
            {p.milestones.map(m => <MilestoneCard key={m.id} milestone={m} contractValue={p.budget} />)}
          </div>
        </div>
      )}

      {tab === 'payments' && <PaymentsList pilot={p} />}

      {tab === 'validation' && (
        validation ? (
          <div className="card card-pad">
            <div className="h3">{validation.startupClaim}</div>
            <div className="grid g-3" style={{ marginTop: 12 }}>
              <div><div className="xsmall muted">Claimed</div><div className="h4">{validation.claimedValue}</div></div>
              <div><div className="xsmall muted">Verified</div><div className="h4">{validation.verifiedValue}</div></div>
              <div><div className="xsmall muted">Variance</div><div className="h4">{validation.variance}</div></div>
            </div>
            <div style={{ marginTop: 12 }}><Badge status={validation.status} /></div>
            {validation.comments && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div className="xsmall muted" style={{ marginBottom: 4 }}>Validator comments</div>
                <p className="small">{validation.comments}</p>
              </div>
            )}
          </div>
        ) : (
          <EmptyState icon="validation" title="No validation initiated" />
        )
      )}

      {tab === 'risks' && (
        <div className="grid g-2">
          {p.risks.map((r, i) => (
            <div className={`risk-card ${r.level}`} key={i}>
              <div className="risk-header">
                <div className="risk-icon">
                  <Icon name={r.level === 'warn' ? 'alertTriangle' : r.level === 'danger' ? 'alert' : 'checkCircle'} />
                </div>
                <div className="risk-title">{r.name}</div>
              </div>
              <div className="risk-value">{r.value}</div>
              <div className="risk-detail">{r.detail}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PaymentsList({ pilot }) {
  const payments = useAppStore(s => s.payments);
  const pays = payments.filter(p => p.pilotId === pilot.id);

  return (
    <div>
      {pays.map(p => (
        <div className="payment-row" key={p.id}>
          <span className="payment-row-id">{p.id}</span>
          <div className="payment-row-body">
            <div className="payment-row-milestone">Milestone {p.milestone}</div>
            <div className="payment-row-detail">{p.approvedBy ? `Approved by ${p.approvedBy}` : p.reason}</div>
          </div>
          <Badge status={p.status} />
          <div className="payment-row-amount">{fmtINR(p.amount)}</div>
        </div>
      ))}
    </div>
  );
}