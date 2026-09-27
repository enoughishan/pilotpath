import { useParams, Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { ScoreBar } from '../components/widgets/Chart.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { matchScore } from '../utils/scoring.js';
import { fmtDate, fmtINR, initials } from '../utils/format.js';

export default function StartupDetail() {
  const { id } = useParams();
  const state = useAppStore();
  const s = state.startups.find(x => x.id === id);
  if (!s) return <div className="content"><EmptyState icon="alert" title="Startup not found" /></div>;

  const apps = state.applications.filter(a => a.startupId === s.id);
  const challenge = state.challenges.find(c => c.industry === s.industry) || state.challenges[0];
  const ms = matchScore(s, challenge);

  return (
    <div className="content">
      <div className="breadcrumb">
        <Link to="/startups">Startups</Link><Icon name="chevronRight" /><span>{s.name}</span>
      </div>

      <div className="page-head">
        <div className="ph-left" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div className="avatar" style={{ width: 56, height: 56, borderRadius: 14, fontSize: 18 }}>
            {initials(s.name)}
          </div>
          <div>
            <h1 className="h1">{s.name}</h1>
            <p>{s.tech} · {s.industry} · Founded {s.founded}</p>
          </div>
        </div>
      </div>

      <div className="grid g-2-1">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card card-pad">
            <h3 className="h3" style={{ marginBottom: 10 }}>About</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.65 }}>{s.desc}</p>
          </div>

          <div className="card">
            <div className="card-head"><h3>Explainable match score</h3><p>Breakdown across six dimensions</p></div>
            <div className="card-pad">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--primary)', letterSpacing: '-.04em', lineHeight: 1 }}>
                    {ms.overall}<span style={{ fontSize: 20 }}>%</span>
                  </div>
                  <div className="xsmall muted">Overall match</div>
                </div>
                <div style={{ flex: 1 }}>
                  {ms.parts.map((p, i) => <ScoreBar key={i} label={p.label} value={p.value} color={p.color} />)}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Previous government deployments</h3></div>
            <div className="card-pad">
              {(s.prevGov || []).map((g, i) => (
                <div className="metric-row" key={i}>
                  <span className="mr-label"><Icon name="building" /> {g}</span>
                  <span className="badge badge-success"><Icon name="check" />Deployed</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Applications</h3><p>{apps.length} application(s)</p></div>
            <div className="card-pad">
              {apps.length ? apps.map(a => {
                const ch = state.challenges.find(x => x.id === a.challengeId);
                return (
                  <div className="metric-row" key={a.id}>
                    <div>
                      <div className="mr-label" style={{ fontWeight: 600, color: 'var(--navy)' }}>{ch?.title}</div>
                      <div className="xsmall muted">{a.challengeId} · Submitted {fmtDate(a.submittedAt)}</div>
                    </div>
                    <Badge status={a.status} />
                  </div>
                );
              }) : <p className="muted small">No applications yet.</p>}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-head"><h3>Profile</h3></div>
            <div className="card-pad">
              <div className="metric-row"><span className="mr-label">Stage</span><span className="mr-val">{s.stage}</span></div>
              <div className="metric-row"><span className="mr-label">District</span><span className="mr-val">{s.district}</span></div>
              <div className="metric-row"><span className="mr-label">Team size</span><span className="mr-val">{s.team}</span></div>
              <div className="metric-row"><span className="mr-label">Readiness</span><span className="mr-val">{s.readiness}%</span></div>
              <div className="metric-row"><span className="mr-label">Cost</span><span className="mr-val">{fmtINR(s.cost)}</span></div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Certifications</h3></div>
            <div className="card-pad" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(s.certs || []).map(cert => <span key={cert} className="badge badge-success"><Icon name="shield" />{cert}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}