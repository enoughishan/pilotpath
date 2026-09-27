import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { fmtLakh } from '../utils/format.js';

export default function Pilots() {
  const state = useAppStore();
  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left">
          <h1 className="h1">Pilots</h1>
          <p>{state.pilots.length} pilots · {state.pilots.filter(p => p.status === 'Active').length} active</p>
        </div>
      </div>
      <div className="grid g-3">
        {state.pilots.map(p => {
          const ch = state.challenges.find(c => c.id === p.challengeId);
          const s = state.startups.find(x => x.id === p.startupId);
          return (
            <Link key={p.id} to={`/pilots/${p.id}`} className="card card-pad" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                <span className="mono" style={{ fontWeight: 700, fontSize: 11, color: 'var(--text-4)' }}>{p.id}</span>
                <Badge status={p.status} />
              </div>
              <div className="h3" style={{ marginBottom: 6 }}>{p.title}</div>
              <div className="small muted" style={{ marginBottom: 12 }}>{s?.name} · {ch?.district}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '12px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
                <div><div className="xsmall muted">Budget</div><div className="h4">{fmtLakh(p.budget)}</div></div>
                <div><div className="xsmall muted">Duration</div><div className="h4">{p.duration}d</div></div>
              </div>
              <div className="progress"><span style={{ width: `${p.progress}%` }} /></div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}