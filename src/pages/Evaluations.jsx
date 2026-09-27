import { useAppStore } from '../store/useAppStore.js';
import { useSession } from '../store/useSession.js';
import { Badge } from '../components/ui/Badge.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { weighted } from '../utils/scoring.js';
import { Icon } from '../components/Icons.jsx';

export default function Evaluations() {
  const state = useAppStore();
  const { role, persona } = useSession();
  const rubric = state.rubric;

  const rows = state.evaluations.map(e => {
    const app = state.applications.find(a => a.id === e.applicationId);
    const startup = app ? state.startups.find(s => s.id === app.startupId) : null;
    const challenge = app ? state.challenges.find(c => c.id === app.challengeId) : null;
    const score = weighted(e.scores, rubric);
    return { e, startup, challenge, score };
  });

  const myRows = role === 'evaluator' ? rows.filter(r => r.e.evaluator === persona()?.name) : rows;

  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left">
          <h1 className="h1">{role === 'evaluator' ? 'My Evaluations' : 'Evaluations'}</h1>
          <p>Weighted rubric scoring with explainable criteria and COI declarations</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-head"><h3>Active rubric</h3><p>v3.0</p></div>
        <div className="card-pad">
          <div className="grid g-5" style={{ gap: 12 }}>
            {rubric.map(r => (
              <div key={r.key} style={{ padding: 12, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface-2)' }}>
                <div className="xsmall muted">Criterion</div>
                <div className="h4" style={{ margin: '4px 0 8px' }}>{r.name}</div>
                <div className="h2" style={{ color: 'var(--primary)' }}>{r.weight}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Evaluation</th><th>Startup</th><th>Challenge</th><th>Evaluator</th><th>Score</th><th>Status</th></tr></thead>
          <tbody>
            {myRows.length ? myRows.map(r => (
              <tr key={r.e.id}>
                <td><span className="mono" style={{ fontWeight: 700 }}>{r.e.id}</span></td>
                <td><b>{r.startup?.name || '—'}</b></td>
                <td className="muted" style={{ maxWidth: 280 }}>{r.challenge?.title || '—'}</td>
                <td className="muted">{r.e.evaluator}</td>
                <td><b style={{ color: 'var(--primary)' }}>{r.score}</b><span className="xsmall muted">/100</span></td>
                <td><Badge status={r.e.status} /></td>
              </tr>
            )) : <tr><td colSpan="6"><EmptyState icon="evaluation" title="No evaluations assigned" /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}