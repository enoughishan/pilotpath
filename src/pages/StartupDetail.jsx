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
        <Link to="/startups">Startup Discovery</Link>
        <Icon name="chevronRight" />
        <span>{s.name}</span>
      </div>

      {/* ================ PROFILE HERO ================ */}
      <div className="startup-profile-hero">
        <div className="startup-profile-logo">{initials(s.name)}</div>
        <div className="startup-profile-body">
          <h1 className="startup-profile-name">{s.name}</h1>
          <p className="startup-profile-tagline">{s.tech} · {s.industry} · Founded {s.founded}</p>
          <div className="startup-profile-tags">
            <span className="startup-tag"><Icon name="mapPin" />{s.district}, Maharashtra</span>
            <span className="startup-tag"><Icon name="award" />{s.stage}</span>
            <span className="startup-tag"><Icon name="users" />{s.team} team</span>
            {(s.certs || []).map(cert => (
              <span key={cert} className="startup-tag" style={{ background: 'var(--success-50)', color: 'var(--success)', borderColor: 'var(--success-100)' }}>
                <Icon name="shield" />{cert}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================ KPI STRIP ================ */}
      <div className="detail-kpi-strip">
        <div className="detail-kpi" style={{ '--kpi-accent': '#1B4D89' }}>
          <div className="detail-kpi-label"><Icon name="target" />Match score</div>
          <div className="detail-kpi-value">{ms.overall}%</div>
          <div className="detail-kpi-sub">Against current challenge</div>
        </div>
        <div className="detail-kpi" style={{ '--kpi-accent': '#047857' }}>
          <div className="detail-kpi-label"><Icon name="checkCircle" />Readiness</div>
          <div className="detail-kpi-value">{s.readiness}%</div>
          <div className="detail-kpi-sub">Pilot deployment</div>
        </div>
        <div className="detail-kpi" style={{ '--kpi-accent': '#6D28D9' }}>
          <div className="detail-kpi-label"><Icon name="building" />Govt deployments</div>
          <div className="detail-kpi-value">{s.deployments}</div>
          <div className="detail-kpi-sub">Prior projects</div>
        </div>
        <div className="detail-kpi" style={{ '--kpi-accent': '#B45309' }}>
          <div className="detail-kpi-label"><Icon name="payment" />Est. cost</div>
          <div className="detail-kpi-value">{fmtINR(s.cost)}</div>
          <div className="detail-kpi-sub">Per pilot</div>
        </div>
      </div>

      {/* ================ BODY ================ */}
      <div className="grid g-2-1">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card card-pad">
            <h3 className="h3" style={{ marginBottom: 10 }}>About</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.65 }}>{s.desc}</p>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Match score breakdown</h3>
              <p>Six explainable signals · not a single opaque score</p>
            </div>
            <div className="card-pad">
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 8 }}>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {ms.overall}
                    <span style={{ fontSize: 22 }}>%</span>
                  </div>
                  <div className="xsmall muted" style={{ marginTop: 4 }}>Overall match</div>
                </div>
                <div style={{ flex: 1 }}>
                  {ms.parts.map((p, i) => (
                    <ScoreBar key={i} label={p.label} value={p.value} color={p.color} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Previous government deployments</h3></div>
            <div className="card-pad">
              {(s.prevGov || []).length ? (s.prevGov || []).map((g, i) => (
                <div className="metric-row" key={i}>
                  <span className="mr-label"><Icon name="building" /> {g}</span>
                  <span className="badge badge-success"><Icon name="check" />Deployed</span>
                </div>
              )) : <p className="muted small">No prior government deployments.</p>}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Applications</h3><p>{apps.length} total</p></div>
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
              <div className="metric-row"><span className="mr-label">Technical fit</span><span className="mr-val">{s.techFit}%</span></div>
              <div className="metric-row"><span className="mr-label">Founded</span><span className="mr-val">{s.founded}</span></div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Certifications</h3></div>
            <div className="card-pad" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(s.certs || []).map(cert => (
                <span key={cert} className="badge badge-success">
                  <Icon name="shield" />{cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}