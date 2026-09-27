import { Icon } from '../Icons.jsx';
import { useAppStore } from '../../store/useAppStore.js';
import { fmtLakh, clamp } from '../../utils/format.js';

export function PublicValue({ pilot, validation }) {
  const state = useAppStore();
  if (!pilot) return null;
  const c = state.challenges.find(x => x.id === pilot.challengeId);
  if (!c) return null;

  const kpi = pilot.kpis[0] || {};
  const baseline = parseFloat(kpi.baseline) || 0;
  const current = parseFloat(kpi.current) || 0;
  const target = parseFloat(kpi.target) || 1;
  const improvement = kpi.dir === 'up'
    ? ((current - baseline) / Math.max(target - baseline, 1)) * 100
    : ((baseline - current) / Math.max(baseline - target, 1)) * 100;
  const achievement = clamp(Math.round(improvement), 0, 100);

  const wardsMatch = pilot.geography.match(/(\d+)/);
  const wards = wardsMatch ? parseInt(wardsMatch[1]) : 8;
  const scaleWards = wards * 5;

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="card-head">
        <div><h3>Public Value</h3><p>Impact created by this pilot, beyond procurement activity</p></div>
        <span className="badge badge-purple"><Icon name="trendingUp" />Evidence-backed</span>
      </div>
      <div className="card-pad">
        <div className="grid g-3" style={{ gap: 12, marginBottom: 16 }}>
          {[
            { icon:'target', color:'var(--primary)', bg:'var(--primary-50)', label:kpi.name || 'Primary KPI',
              value:`${baseline}${kpi.unit||''} → ${current}${kpi.unit||''}`, sub:`Target ${target}${kpi.unit||''}` },
            { icon:'checkCircle', color:'var(--success)', bg:'var(--success-50)', label:'Target achievement', value:`${achievement}%`, sub:'Against declared outcome' },
            { icon:'users', color:'var(--purple)', bg:'var(--purple-50)', label:'Population served', value:pilot.users, sub:pilot.geography },
            { icon:'payment', color:'var(--warning)', bg:'var(--warning-50)', label:'Pilot investment', value:fmtLakh(pilot.budget), sub:'Milestone-linked' },
            { icon:'mapPin', color:'var(--info)', bg:'var(--info-50)', label:'Coverage', value:`${wards} / ${wards}`, sub:'Wards in pilot scope' },
            { icon:'shield', color:validation?.status === 'Validated' ? 'var(--success)' : 'var(--warning)',
              bg:validation?.status === 'Validated' ? 'var(--success-50)' : 'var(--warning-50)',
              label:'Evidence confidence', value:validation?.status === 'Validated' ? 'Validated' : 'Pending',
              sub:validation?.validator || 'Awaiting validator' }
          ].map((tile, i) => (
            <div className="value-tile" key={i}>
              <div className="value-icon" style={{ background: tile.bg, color: tile.color }}>
                <Icon name={tile.icon} />
              </div>
              <div className="value-body">
                <div className="value-label">{tile.label}</div>
                <div className="value-value">{tile.value}</div>
                <div className="value-sub">{tile.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 10 }}>
          <div className="xsmall" style={{ fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Scale-up scenario</div>
          <div className="grid g-4" style={{ gap: 14 }}>
            <div><div className="xsmall muted">Current pilot</div><div className="h3">{wards} wards</div></div>
            <div><div className="xsmall muted">Potential deployment</div><div className="h3">{scaleWards} wards</div></div>
            <div><div className="xsmall muted">Required investment</div><div className="h3">{fmtLakh(pilot.budget * 4)}</div></div>
            <div><div className="xsmall muted">Evidence status</div>
              <div className="h3" style={{ color: validation?.status === 'Validated' ? 'var(--success)' : 'var(--warning)' }}>
                {validation?.status === 'Validated' ? 'Ready' : 'Awaiting validation'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}