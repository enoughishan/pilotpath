import { Icon } from '../components/Icons.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { useToast } from '../components/ui/Toast.jsx';

export default function Settings() {
  const state = useAppStore();
  const toast = useToast();

  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left"><h1 className="h1">Settings</h1><p>Workflow rules, evaluation rubrics and demo controls</p></div>
      </div>
      <div className="grid g-2">
        <div className="card">
          <div className="card-head"><h3>Evaluation rubric</h3><p>Weights must total 100%</p></div>
          <div className="card-pad">
            {state.rubric.map(r => (
              <div className="metric-row" key={r.key}>
                <span className="mr-label">{r.name}</span>
                <span className="mr-val">{r.weight}%</span>
              </div>
            ))}
            <div className="metric-row" style={{ fontWeight: 700 }}>
              <span className="mr-label" style={{ fontWeight: 700, color: 'var(--navy)' }}>Total</span>
              <span className="mr-val" style={{ color: 'var(--success)' }}>
                {state.rubric.reduce((a, r) => a + r.weight, 0)}%
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Demo controls</h3></div>
          <div className="card-pad">
            <p className="small muted" style={{ marginBottom: 12 }}>Reset restores initial mock data.</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => { state.reset(); toast.success('Demo data reset'); }}>
                <Icon name="refresh" />Reset demo data
              </button>
              <button className="btn btn-primary" onClick={() => toast.info('Advance workflow', 'CH-018 moved to next stage.')}>
                <Icon name="play" />Advance CH-018
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Departments</h3></div>
          <div className="card-pad">
            {state.departments.map(d => (
              <div className="metric-row" key={d.id}>
                <span className="mr-label">{d.name}</span>
                <span className="badge badge-neutral">{d.short}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Automation vs government decision</h3></div>
          <div className="card-pad">
            <div style={{ padding: 12, background: 'var(--primary-50)', borderRadius: 10, marginBottom: 12 }}>
              <div className="h4" style={{ color: 'var(--primary)', marginBottom: 6 }}><Icon name="sparkles" /> The platform may:</div>
              <ul style={{ paddingLeft: 18, color: 'var(--text-2)', fontSize: 13, lineHeight: 1.8 }}>
                <li>Suggest KPIs and structured problem statements</li>
                <li>Compute weighted evaluation scores</li>
                <li>Flag risks and summarise evidence</li>
              </ul>
            </div>
            <div style={{ padding: 12, background: 'var(--success-50)', borderRadius: 10 }}>
              <div className="h4" style={{ color: 'var(--success)', marginBottom: 6 }}><Icon name="shield" /> Authorised humans decide:</div>
              <ul style={{ paddingLeft: 18, color: 'var(--text-2)', fontSize: 13, lineHeight: 1.8 }}>
                <li>Eligibility override</li>
                <li>Pilot approval</li>
                <li>Payment approval</li>
                <li>Independent validation</li>
                <li>Scale-up decision</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}