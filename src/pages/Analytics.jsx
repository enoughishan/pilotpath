import { Icon } from '../components/Icons.jsx';
import { Bars, HBars, StagePipeline, Donut } from '../components/widgets/Chart.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { STAGES } from '../data/seed.js';
import { fmtINR } from '../utils/format.js';

/* Short codes for departments */
const DEPT_SHORT = {
  'Urban Development Department': 'UDD',
  'Public Works Department': 'PWD',
  'Water Resources Department': 'WRD',
  'Public Health Department': 'PHD',
  'Medical Education & Drugs': 'MED',
  'School Education Department': 'SED',
  'Higher & Technical Education': 'HED',
  'Transport Department': 'TRP',
  'Agriculture Department': 'AGR',
  'Energy Department': 'ENE',
  'Environment Department': 'ENV',
  'Information Technology Directorate': 'ITD'
};

export default function Analytics() {
  const state = useAppStore();

  /* ---------- Derived data ---------- */
  const byDept = {};
  state.challenges.forEach(c => {
    const short = DEPT_SHORT[c.dept] || c.dept.slice(0, 4);
    byDept[short] = (byDept[short] || 0) + 1;
  });

  const byDistrict = {};
  state.challenges.forEach(c => {
    byDistrict[c.district] = (byDistrict[c.district] || 0) + 1;
  });

  const validationRate = state.pilots.length
    ? Math.round(
        (state.validations.filter(v => v.status === 'Validated').length /
          state.pilots.length) *
          100
      )
    : 0;

  const paidTotal = state.payments
    .filter(p => p.status === 'PAID')
    .reduce((a, p) => a + p.amount, 0);

  const pilotOutcomes = [
    { label: 'Validated', value: state.pilots.filter(p => p.status === 'Validated').length, color: 'var(--success)' },
    { label: 'Completed', value: state.pilots.filter(p => p.status === 'Completed').length, color: 'var(--primary)' },
    { label: 'Active', value: state.pilots.filter(p => p.status === 'Active').length, color: 'var(--warning)' }
  ].filter(x => x.value > 0);

  /* Stage values for StagePipeline */
  const stageValues = {};
  STAGES.forEach(s => {
    stageValues[s.key] = state.challenges.filter(c => c.stage === s.key).length;
  });

  /* District data — sorted desc */
  const districtData = Object.entries(byDistrict)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));

  /* Department data — sorted desc */
  const deptData = Object.entries(byDept)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));

  /* Top tiles */
  const tiles = [
    { label: 'Total Challenges', value: state.challenges.length, sub: 'Across all departments', icon: 'challenge', accent: 'var(--primary)', accentBg: 'var(--primary-50)' },
    { label: 'Applications', value: state.applications.length, sub: 'Startups applied', icon: 'startup', accent: 'var(--purple)', accentBg: 'var(--purple-50)' },
    { label: 'Active Pilots', value: state.pilots.filter(p => p.status === 'Active').length, sub: 'Running now', icon: 'pilot', accent: 'var(--warning)', accentBg: 'var(--warning-50)' },
    { label: 'Validation Rate', value: `${validationRate}%`, sub: 'Independently verified', icon: 'validation', accent: 'var(--success)', accentBg: 'var(--success-50)' },
    { label: 'Total Released', value: fmtINR(paidTotal), sub: 'Milestone-linked payments', icon: 'payment', accent: 'var(--success)', accentBg: 'var(--success-50)' },
    { label: 'Avg Evaluation Time', value: '8.4 days', sub: 'From submission to lock', icon: 'clock', accent: 'var(--primary)', accentBg: 'var(--primary-50)' },
    { label: 'Avg Pilot Duration', value: '98 days', sub: 'Deployment to validation', icon: 'calendar', accent: 'var(--purple)', accentBg: 'var(--purple-50)' },
    { label: 'Payment Turnaround', value: '3.2 days', sub: 'Within 30-day SLA', icon: 'checkCircle', accent: 'var(--success)', accentBg: 'var(--success-50)' }
  ];

  return (
    <div className="content">
      {/* ================ PAGE HERO ================ */}
      <div className="page-hero">
        <div className="page-hero-eyebrow">
          <span className="dot" />
          Programme analytics
        </div>
        <h1 className="page-hero-title">Analytics</h1>
        <p className="page-hero-sub">
          Programme-wide metrics across all departments, districts, and pilot
          stages in Maharashtra.
        </p>
        <div className="page-hero-meta">
          <span><Icon name="building" /> <b>{state.departments.length}</b> departments</span>
          <span><Icon name="mapPin" /> <b>{new Set(state.challenges.map(c => c.district)).size}</b> districts</span>
          <span><Icon name="calendar" /> FY 2026–27</span>
        </div>
      </div>

      {/* ================ FILTER ================ */}
      <div className="filter-bar-premium">
        <select className="select" style={{ minWidth: 200 }}>
          <option>All departments</option>
          {state.departments.map(d => <option key={d.id}>{d.name}</option>)}
        </select>
        <select className="select" style={{ minWidth: 160 }}>
          <option>FY 2026–27</option>
          <option>FY 2025–26</option>
        </select>
        <select className="select" style={{ minWidth: 160 }}>
          <option>All districts</option>
          <option>Pune</option>
          <option>Mumbai City</option>
          <option>Nagpur</option>
          <option>Nashik</option>
        </select>
        <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
          <Icon name="download" />
          Export report
        </button>
      </div>

      {/* ================ TILE GRID ================ */}
      <div className="analytics-grid">
        {tiles.map((t, i) => (
          <div className="analytics-tile" key={i} style={{ '--analytics-accent': t.accent }}>
            <div className="analytics-tile-icon" style={{ background: t.accentBg, color: t.accent }}>
              <Icon name={t.icon} />
            </div>
            <div className="analytics-tile-value">{t.value}</div>
            <div className="analytics-tile-label">{t.label}</div>
            <div className="analytics-tile-sub">{t.sub}</div>
          </div>
        ))}
      </div>

      {/* ================ ROW 1: DEPT + DISTRICT ================ */}
      <div className="analytics-charts">
        {/* Department — horizontal bars */}
        <div className="analytics-chart-card">
          <div className="analytics-chart-head">
            <div>
              <div className="analytics-chart-title">Challenges by department</div>
              <div className="analytics-chart-sub">Ranked by number of challenges</div>
            </div>
            <span className="analytics-chart-badge">{deptData.length} depts</span>
          </div>
          <HBars
            data={deptData.map(d => ({
              label: d.label,
              value: d.value,
              color: 'var(--primary)'
            }))}
          />
        </div>

        {/* District — horizontal bars (clean full names) */}
        <div className="analytics-chart-card">
          <div className="analytics-chart-head">
            <div>
              <div className="analytics-chart-title">District participation</div>
              <div className="analytics-chart-sub">Number of challenges per district</div>
            </div>
            <span className="analytics-chart-badge">{districtData.length} districts</span>
          </div>
          <HBars
            data={districtData.map(d => ({
              label: d.label,
              value: d.value,
              color: 'var(--info)'
            }))}
            labelWidth={150}
          />
        </div>
      </div>

      {/* ================ ROW 2: PIPELINE + DONUT ================ */}
      <div className="analytics-charts">
        {/* Pipeline — new StagePipeline component */}
        <div className="analytics-chart-card">
          <div className="analytics-chart-head">
            <div>
              <div className="analytics-chart-title">Pipeline distribution</div>
              <div className="analytics-chart-sub">Challenges by current stage</div>
            </div>
            <span className="analytics-chart-badge">
              {Object.values(stageValues).reduce((a, b) => a + b, 0)} total
            </span>
          </div>
          <StagePipeline stages={STAGES} values={stageValues} />
        </div>

        {/* Pilot outcomes donut */}
        <div className="analytics-chart-card">
          <div className="analytics-chart-head">
            <div>
              <div className="analytics-chart-title">Pilot outcomes</div>
              <div className="analytics-chart-sub">Distribution across pilot states</div>
            </div>
            <span className="analytics-chart-badge">
              {pilotOutcomes.reduce((a, x) => a + x.value, 0)} total
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', paddingTop: 8 }}>
            {pilotOutcomes.length > 0 ? (
              <>
                <Donut segments={pilotOutcomes} size={180} thickness={22} />
                <div style={{ flex: 1, minWidth: 140 }}>
                  {pilotOutcomes.map((o, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: o.color }} />
                      <span className="small" style={{ flex: 1 }}>{o.label}</span>
                      <b className="h4">{o.value}</b>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="muted small" style={{ padding: 20 }}>No pilot data yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* ================ ROW 3: PAYMENT + TOP DISTRICTS ================ */}
      <div className="analytics-charts">
        <div className="analytics-chart-card">
          <div className="analytics-chart-head">
            <div>
              <div className="analytics-chart-title">Payment status distribution</div>
              <div className="analytics-chart-sub">Across all milestone payments</div>
            </div>
          </div>
          <HBars
            data={[
              { label: 'Released', value: state.payments.filter(p => p.status === 'PAID').length, color: 'var(--success)' },
              { label: 'Awaiting payment', value: state.payments.filter(p => p.status === 'AWAITING_PAYMENT').length, color: 'var(--warning)' },
              { label: 'Awaiting validation', value: state.payments.filter(p => p.status === 'AWAITING_VALIDATION').length, color: 'var(--warning)' },
              { label: 'Pending evidence', value: state.payments.filter(p => p.status === 'PENDING_EVIDENCE').length, color: 'var(--danger)' },
              { label: 'Locked', value: state.payments.filter(p => p.status === 'LOCKED').length, color: 'var(--text-4)' }
            ]}
          />
        </div>

        <div className="analytics-chart-card">
          <div className="analytics-chart-head">
            <div>
              <div className="analytics-chart-title">Top districts by challenge count</div>
              <div className="analytics-chart-sub">Ranked by active challenges</div>
            </div>
          </div>
          <HBars
            data={districtData.slice(0, 6).map(d => ({
              label: d.label,
              value: d.value,
              color: 'var(--primary)'
            }))}
            labelWidth={150}
          />
        </div>
      </div>
    </div>
  );
}