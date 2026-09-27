import { Badge } from '../ui/Badge.jsx';
import { clamp } from '../../utils/format.js';

export function KpiChartCard({ kpi }) {
  const tone = kpi.status === 'ACHIEVED' ? 'success' : kpi.status === 'NEAR' ? 'warning' : kpi.status === 'BELOW' ? 'danger' : 'neutral';
  const pct = (() => {
    const b = parseFloat(kpi.baseline) || 0;
    const c = kpi.current === '—' ? b : parseFloat(kpi.current);
    const t = parseFloat(kpi.target) || 1;
    if (kpi.dir === 'up') return clamp(((c - b) / Math.max(t - b, 1)) * 100, 0, 120);
    return clamp(((b - c) / Math.max(b - t, 1)) * 100, 0, 120);
  })();

  const statusLabel = kpi.status === 'ACHIEVED' ? 'Achieved' : kpi.status === 'NEAR' ? 'Near target' : kpi.status === 'BELOW' ? 'Below target' : 'In progress';

  return (
    <div className="card card-pad">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
        <div className="h3">{kpi.name}</div>
        <Badge status={statusLabel} />
      </div>
      <div className="grid g-3" style={{ gap: 10, marginBottom: 12 }}>
        <div><div className="xsmall muted">Baseline</div><div className="h3">{kpi.baseline}{kpi.unit}</div></div>
        <div><div className="xsmall muted">Current</div>
          <div className="h3" style={{ color: tone === 'neutral' ? 'var(--navy)' : `var(--${tone})` }}>{kpi.current}{kpi.unit}</div>
        </div>
        <div><div className="xsmall muted">Target</div><div className="h3">{kpi.target}{kpi.unit}</div></div>
      </div>
      <div className={`progress ${tone === 'success' ? 'green' : tone === 'warning' ? 'amber' : ''}`}>
        <span style={{ width: `${Math.min(pct, 100)}%`, background: tone === 'neutral' ? 'var(--primary)' : `var(--${tone})` }} />
      </div>
      <div className="xsmall muted" style={{ marginTop: 6 }}>{Math.round(pct)}% of target progress</div>
    </div>
  );
}