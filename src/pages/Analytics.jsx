import { KpiCard } from '../components/widgets/KpiCard.jsx';
import { Bars, Donut, ScoreBar } from '../components/widgets/Chart.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { STAGES } from '../data/seed.js';
import { fmtINR } from '../utils/format.js';

export default function Analytics() {
  const state = useAppStore();
  const byDept = {};
  state.challenges.forEach(c => byDept[c.dept] = (byDept[c.dept] || 0) + 1);
  const byDistrict = {};
  state.challenges.forEach(c => byDistrict[c.district] = (byDistrict[c.district] || 0) + 1);

  const validationRate = state.pilots.length
    ? Math.round(state.validations.filter(v => v.status === 'Validated').length / state.pilots.length * 100) : 0;
  const paidTotal = state.payments.filter(p => p.status === 'PAID').reduce((a, p) => a + p.amount, 0);

  const pilotOutcomes = [
    { label: 'Validated', value: state.pilots.filter(p => p.status === 'Validated').length, color: 'var(--success)' },
    { label: 'Completed', value: state.pilots.filter(p => p.status === 'Completed').length, color: 'var(--primary)' },
    { label: 'Active', value: state.pilots.filter(p => p.status === 'Active').length, color: 'var(--warning)' }
  ];

  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left"><h1 className="h1">Analytics</h1><p>Programme-wide metrics</p></div>
      </div>

      <div className="grid g-4" style={{ marginBottom: 20 }}>
        <KpiCard label="Total Challenges" value={state.challenges.length} accent="blue" iconName="challenge" />
        <KpiCard label="Applications" value={state.applications.length} accent="purple" iconName="startup" />
        <KpiCard label="Pilots" value={state.pilots.length} accent="amber" iconName="pilot" />
        <KpiCard label="Validation Rate" value={validationRate + '%'} accent="green" iconName="validation" />
        <KpiCard label="Released" value={fmtINR(paidTotal)} accent="green" iconName="payment" />
        <KpiCard label="Avg Evaluation" value="8.4 days" accent="blue" iconName="clock" />
        <KpiCard label="Avg Pilot Duration" value="98 days" accent="purple" iconName="calendar" />
        <KpiCard label="Payment Turnaround" value="3.2 days" accent="green" iconName="checkCircle" />
      </div>

      <div className="grid g-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-head"><h3>Challenges by department</h3></div>
          <div className="card-pad">
            <Bars data={Object.entries(byDept).map(([label, value]) => ({ label, value }))} height={200} />
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>District participation</h3></div>
          <div className="card-pad">
            <Bars data={Object.entries(byDistrict).map(([label, value]) => ({ label, value, color: 'var(--info)' }))} height={200} />
          </div>
        </div>
      </div>

      <div className="grid g-2">
        <div className="card">
          <div className="card-head"><h3>Pipeline distribution</h3></div>
          <div className="card-pad">
            <Bars data={STAGES.map(s => ({ label: s.name, value: state.challenges.filter(c => c.stage === s.key).length }))} height={200} />
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Pilot outcomes</h3></div>
          <div className="card-pad" style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <Donut segments={pilotOutcomes} size={160} />
            <div>
              {pilotOutcomes.map((o, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: o.color }} />
                  <span className="small">{o.label}</span>
                  <b className="small" style={{ marginLeft: 'auto' }}>{o.value}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}