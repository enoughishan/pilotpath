import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { LineChart } from '../components/widgets/Chart.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { fmtINR, fmtDate } from '../utils/format.js';

export default function Monitoring() {
  const state = useAppStore();
  const pilots = state.pilots.filter(p => p.status === 'Active' || p.status === 'Completed' || p.status === 'Validated');

  const totalPilots = pilots.length;
  const totalValue = pilots.reduce((a, p) => a + p.budget, 0);
  const avgProgress = pilots.length
    ? Math.round(pilots.reduce((a, p) => a + p.progress, 0) / pilots.length)
    : 0;
  const atRisk = pilots.filter(p =>
    (p.risks || []).some(r => r.level === 'warn' || r.level === 'danger')
  ).length;

  return (
    <div className="content">
      {/* ================ PAGE HERO ================ */}
      <div className="page-hero">
        <div className="page-hero-eyebrow">
          <span className="dot" />
          Live monitoring
        </div>
        <h1 className="page-hero-title">Monitoring</h1>
        <p className="page-hero-sub">
          Real-time KPI tracking, milestone progress, and risk signals for every
          active pilot. Charts update as evidence is verified.
        </p>
        <div className="page-hero-meta">
          <span><Icon name="pilot" /> <b>{totalPilots}</b> active pilots</span>
          <span><Icon name="payment" /> <b>{fmtINR(totalValue)}</b> monitored value</span>
          <span><Icon name="target" /> <b>{avgProgress}%</b> avg progress</span>
          <span><Icon name="alertTriangle" /> <b>{atRisk}</b> at risk</span>
        </div>
      </div>

      {/* ================ MONITOR CARDS ================ */}
      {pilots.length ? (
        <div className="monitor-grid">
          {pilots.map(p => (
            <MonitorCard key={p.id} pilot={p} challenge={state.challenges.find(c => c.id === p.challengeId)} startup={state.startups.find(s => s.id === p.startupId)} />
          ))}
        </div>
      ) : (
        <div className="empty-premium">
          <Icon name="monitoring" />
          <b>No active pilots</b>
          <p>Once pilots begin, live KPI telemetry and progress will appear here.</p>
        </div>
      )}
    </div>
  );
}

/* ---------- Monitor Card ---------- */
function MonitorCard({ pilot, challenge, startup }) {
  const trend = pilot.trend || [];
  const labels = trend.map(t => t.week);

  const primaryKpi = pilot.kpis[0] || {};
  const progress = pilot.progress || 0;

  // Progress ring
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const isAtRisk = (pilot.risks || []).some(r => r.level === 'warn' || r.level === 'danger');

  return (
    <div className="monitor-card">
      {/* ---------- Header ---------- */}
      <div className="monitor-header">
        <div className="monitor-header-left">
          <div className="monitor-header-id">{pilot.id}</div>
          <div className="monitor-header-title">{pilot.title}</div>
          <div className="monitor-header-meta">
            <span>
              <Icon name="startup" />
              <b>{startup?.name}</b>
            </span>
            <span>
              <Icon name="mapPin" />
              {pilot.geography}
            </span>
            <span>
              <Icon name="calendar" />
              {fmtDate(pilot.startDate)} → {fmtDate(pilot.endDate)}
            </span>
            <span>
              <Icon name="payment" />
              {fmtINR(pilot.budget)}
            </span>
          </div>
        </div>

        <div className="monitor-header-right">
          <Badge status={pilot.status} />
          {isAtRisk && (
            <span className="badge badge-warning">
              <Icon name="alertTriangle" />
              At risk
            </span>
          )}
          <div className="monitor-ring">
            <svg width="72" height="72">
              <circle
                cx="36"
                cy="36"
                r={radius}
                fill="none"
                stroke="var(--surface-3)"
                strokeWidth="6"
              />
              <circle
                cx="36"
                cy="36"
                r={radius}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div className="monitor-ring-label">{progress}%</div>
          </div>
        </div>
      </div>

      {/* ---------- KPI Cards ---------- */}
      <div className="monitor-kpis">
        {pilot.kpis.map((k, i) => {
          const tone = k.status === 'ACHIEVED' ? 'good'
            : k.status === 'NEAR' ? 'warn'
            : k.status === 'BELOW' ? 'bad' : '';
          const statusLabel =
            k.status === 'ACHIEVED' ? 'Achieved'
              : k.status === 'NEAR' ? 'Near target'
              : k.status === 'BELOW' ? 'Below target'
              : 'In progress';
          const statusTone =
            k.status === 'ACHIEVED' ? 'success'
              : k.status === 'NEAR' ? 'warning'
              : k.status === 'BELOW' ? 'danger' : 'neutral';
          return (
            <div className={`monitor-kpi ${tone}`} key={i}>
              <div className="monitor-kpi-head">
                <div className="monitor-kpi-name">{k.name}</div>
                <span className={`badge badge-${statusTone}`}>{statusLabel}</span>
              </div>
              <div className="monitor-kpi-grid">
                <div>
                  <div className="monitor-kpi-item-label">Baseline</div>
                  <div className="monitor-kpi-item-value">
                    {k.baseline}
                    {k.unit}
                  </div>
                </div>
                <div>
                  <div className="monitor-kpi-item-label">Current</div>
                  <div className={`monitor-kpi-item-value highlight`}>
                    {k.current}
                    {k.unit}
                  </div>
                </div>
                <div>
                  <div className="monitor-kpi-item-label">Target</div>
                  <div className="monitor-kpi-item-value">
                    {k.target}
                    {k.unit}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- Charts ---------- */}
      <div className="monitor-charts">
        <div>
          <div className="monitor-chart-title">
            <Icon name="analytics" />
            KPI trend over time
          </div>
          <LineChart
            series={[
              { name: 'Primary', color: 'var(--primary)', data: trend.map(t => t.loss) },
              { name: 'Secondary', color: 'var(--warning)', data: trend.map(t => t.response) },
              { name: 'Coverage', color: 'var(--success)', data: trend.map(t => t.coverage) }
            ]}
            labels={labels}
            height={200}
          />
        </div>

        <div>
          <div className="monitor-chart-title">
            <Icon name="target" />
            Milestone progress
          </div>
          {pilot.milestones.map(m => {
            const pct =
              m.status === 'PAID' ? 100
                : m.status.includes('AWAITING') ? 70
                : m.status === 'IN_PROGRESS' ? 30 : 0;
            const color =
              m.status === 'PAID' ? 'var(--success)'
                : m.status.includes('AWAITING') ? 'var(--warning)'
                : 'var(--border-2)';
            return (
              <div key={m.id} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span className="small" style={{ fontWeight: 650, color: 'var(--navy)' }}>
                    {m.id} · {m.name}
                  </span>
                  <span className="xsmall muted">{fmtINR(m.amount)}</span>
                </div>
                <div className="progress">
                  <span style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- Footer ---------- */}
      <div
        style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--surface-2)'
        }}
      >
        <div className="small muted">
          <Icon name="clock" style={{ width: 13, height: 13, verticalAlign: 'middle', marginRight: 4 }} />
          Last telemetry: 2 hours ago
        </div>
        <Link to={`/pilots/${pilot.id}`} className="btn btn-secondary btn-sm">
          <Icon name="eye" />
          Open full pilot view
        </Link>
      </div>
    </div>
  );
}