import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Icon } from '../components/Icons.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { PublicValue } from '../components/widgets/PublicValue.jsx';
import { KpiChartCard } from '../components/widgets/KpiChartCard.jsx';
import { MilestoneCard } from '../components/widgets/MilestoneCard.jsx';
import { EvidenceCard } from '../components/widgets/EvidenceCard.jsx';
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

  const tabs = [
    { key: 'monitoring', label: 'Monitoring' },
    { key: 'milestones', label: 'Milestones' },
    { key: 'evidence', label: 'Evidence' },
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
        <a href="#/pilots">Pilots</a><Icon name="chevronRight" /><span>{p.id}</span>
      </div>
      <div className="page-head">
        <div className="ph-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span className="mono" style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 13 }}>{p.id}</span>
            <Badge status={p.status} />
          </div>
          <h1 className="h1">{p.title}</h1>
          <p>{s?.name} · {ch?.id} · {p.geography}</p>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}><PublicValue pilot={p} validation={validation} /></div>

      <div className="tabs">
        {tabs.map(t => (
          <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {tab === 'monitoring' && (
        <>
          <div className="card card-pad" style={{ marginBottom: 20, background: 'linear-gradient(180deg,var(--surface) 0%,var(--primary-50) 140%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div className="h3">{p.title}</div>
                <div className="small muted">{p.geography} · {p.users}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="xsmall muted">Pilot day</div>
                <div className="h2" style={{ color: 'var(--primary)' }}>Day 64 <span style={{ color: 'var(--text-3)', fontSize: 16 }}>/ {p.duration}</span></div>
              </div>
            </div>
            <div className="grid g-3" style={{ marginTop: 16, gap: 12 }}>
              <div className="value-tile"><div className="value-icon" style={{ background: 'var(--primary-50)', color: 'var(--primary)' }}><Icon name="payment" /></div><div className="value-body"><div className="value-label">Total value</div><div className="value-value">{fmtINR(p.budget)}</div></div></div>
              <div className="value-tile"><div className="value-icon" style={{ background: 'var(--success-50)', color: 'var(--success)' }}><Icon name="checkCircle" /></div><div className="value-body"><div className="value-label">Released</div><div className="value-value" style={{ color: 'var(--success)' }}>{fmtINR(paid)}</div></div></div>
              <div className="value-tile"><div className="value-icon" style={{ background: 'var(--warning-50)', color: 'var(--warning)' }}><Icon name="lock" /></div><div className="value-body"><div className="value-label">Locked</div><div className="value-value" style={{ color: 'var(--warning)' }}>{fmtINR(locked)}</div></div></div>
            </div>
          </div>

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
                  const pct = m.status === 'PAID' ? 100 : m.status.includes('AWAITING') ? 70 : m.status === 'IN_PROGRESS' ? 30 : 0;
                  return (
                    <div key={m.id} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div><div className="h4">{m.id} · {m.name}</div><div className="xsmall muted">{fmtINR(m.amount)} · due {fmtDate(m.due)}</div></div>
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
          <div className="card-head"><h3>Milestones</h3></div>
          <div className="card-pad">
            {p.milestones.map(m => <MilestoneCard key={m.id} milestone={m} contractValue={p.budget} />)}
          </div>
        </div>
      )}

      {tab === 'evidence' && (
        <div className="grid g-3">
          {state.evidence.filter(e => e.pilotId === p.id).map(e => <EvidenceCard key={e.id} evidence={e} />)}
        </div>
      )}

      {tab === 'risks' && (
        <div className="card">
          <div className="card-head"><h3>Pilot Risk Monitor</h3></div>
          <div className="card-pad">
            <div className="grid g-2">
              {p.risks.map((r, i) => {
                const toneColor = r.level === 'warn' ? 'var(--warning)' : r.level === 'danger' ? 'var(--danger)' : 'var(--success)';
                const toneBg = r.level === 'warn' ? 'var(--warning-50)' : r.level === 'danger' ? 'var(--danger-50)' : 'var(--success-50)';
                return (
                  <div key={i} style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 10, background: toneBg }}>
                    <div className="h4">{r.name}</div>
                    <div className="h3" style={{ color: toneColor, marginTop: 2 }}>{r.value}</div>
                    <p className="small muted" style={{ marginTop: 6 }}>{r.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}