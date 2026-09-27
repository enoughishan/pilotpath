import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Icon } from '../components/Icons.jsx';
import { Badge, PriorityBadge } from '../components/ui/Badge.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { DecisionChain } from '../components/widgets/DecisionChain.jsx';
import { EvidenceFlow } from '../components/widgets/EvidenceFlow.jsx';
import { PublicValue } from '../components/widgets/PublicValue.jsx';
import { MilestoneCard } from '../components/widgets/MilestoneCard.jsx';
import { EvidenceCard } from '../components/widgets/EvidenceCard.jsx';
import { AuditTimeline } from '../components/widgets/AuditTimeline.jsx';
import { ScoreBar } from '../components/widgets/Chart.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { useSession } from '../store/useSession.js';
import { STAGES } from '../data/seed.js';
import { guard, nextStage } from '../utils/workflow.js';
import { matchScore, consensus, breakdown } from '../utils/scoring.js';
import { fmtINR, fmtLakh, fmtDate } from '../utils/format.js';
import { useToast } from '../components/ui/Toast.jsx';

export default function ChallengeDetail() {
  const { id } = useParams();
  const state = useAppStore();
  const { role, user } = useSession();
  const toast = useToast();
  const [tab, setTab] = useState('overview');

  const c = state.challenges.find(x => x.id === id);
  if (!c) return <div className="content"><EmptyState icon="alert" title="Challenge not found" /></div>;

  const applications = state.applications.filter(a => a.challengeId === c.id);
  const pilot = state.pilots.find(p => p.challengeId === c.id);
  const validation = pilot ? state.validations.find(v => v.pilotId === pilot.id) : null;
  const scaleup = state.scaleup.find(s => s.challengeId === c.id);
  const g = guard(c);
  const next = nextStage(c.stage);
  const evidenceCount = pilot ? state.evidence.filter(e => e.pilotId === pilot.id).length : 0;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'problem', label: 'Problem' },
    { key: 'solution', label: 'Solution', count: applications.length },
    { key: 'pilot', label: 'Pilot' },
    { key: 'validation', label: 'Validation' },
    { key: 'payments', label: 'Payments' },
    { key: 'scaleup', label: 'Scale-up' },
    { key: 'audit', label: 'Audit' }
  ];

  const handleAdvance = () => {
    if (!g.ok) { toast.warning('Cannot advance', g.reason); return; }
    state.update('challenges', c.id, { stage: next, status: next === 'SCALE_UP' ? 'Decision pending' : 'In progress' });
    state.logAudit({ user: user?.name, role: 'Innovation Officer', action: `Stage advanced to ${STAGES.find(s => s.key === next)?.name}`, entity: c.id, details: g.reason });
    toast.success('Workflow advanced', `${c.id} → ${STAGES.find(s => s.key === next)?.name}`);
  };

  const handleSelectStartup = (appId) => {
    const app = state.applications.find(a => a.id === appId);
    if (!app) return;
    state.update('applications', app.id, { status: 'Pilot' });
    const startup = state.startups.find(s => s.id === app.startupId);
    state.logAudit({ user: user?.name, role: 'Innovation Officer', action: 'Startup selected for pilot', entity: c.id, details: `${startup?.name} selected for pilot.` });
    toast.success('Startup selected', `${startup?.name} is now the pilot vendor.`);
  };

  return (
    <div className="content">
      <div className="breadcrumb">
        <Link to="/pathway">Pathway Board</Link>
        <Icon name="chevronRight" />
        <Link to="/challenges">Challenges</Link>
        <Icon name="chevronRight" />
        <span>{c.id}</span>
      </div>

      {/* ================ DETAIL HERO ================ */}
      <div className="detail-hero">
        <div className="detail-hero-top">
          <span className="detail-hero-id">{c.id}</span>
          <Badge status={c.stage} />
          <PriorityBadge priority={c.priority} />
          <Badge status={c.status} />
        </div>

        <h1 className="detail-hero-title">{c.title}</h1>

        <div className="detail-hero-meta">
          <span><Icon name="building" /> <b>{c.dept}</b></span>
          <span><Icon name="mapPin" /> <b>{c.district}</b>, Maharashtra</span>
          <span><Icon name="calendar" /> Day {c.day}</span>
          <span><Icon name="clock" /> {c.duration} days</span>
          <span><Icon name="payment" /> <b>{fmtLakh(c.budget)}</b></span>
        </div>

        <div className="detail-hero-actions">
          {role === 'officer' && c.stage !== 'SCALE_UP' && (
            <button
              className="btn btn-primary"
              disabled={!g.ok}
              title={!g.ok ? g.reason : ''}
              onClick={handleAdvance}
            >
              <Icon name="chevronRight" />
              Advance to {STAGES.find(s => s.key === next)?.name || '—'}
            </button>
          )}
          <button className="btn btn-secondary">
            <Icon name="download" />
            Export summary
          </button>
          {pilot && (
            <Link className="btn btn-secondary" to="/evidence">
              <Icon name="evidence" />
              View evidence ({evidenceCount})
            </Link>
          )}
        </div>
      </div>

      {/* Warning if blocked */}
      {!g.ok && c.stage !== 'SCALE_UP' && (
        <div className="card card-pad" style={{ marginBottom: 16, borderLeft: '3px solid var(--warning)', background: 'var(--warning-50)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--warning)' }}><Icon name="alertTriangle" /></span>
            <div>
              <div className="h4">Workflow blocked</div>
              <div className="small" style={{ color: 'var(--text-2)', marginTop: 2 }}>{g.reason}</div>
            </div>
          </div>
        </div>
      )}

      {/* ================ KPI STRIP ================ */}
      <div className="detail-kpi-strip">
        <div className="detail-kpi" style={{ '--kpi-accent': '#1B4D89' }}>
          <div className="detail-kpi-label"><Icon name="startup" />Applications</div>
          <div className="detail-kpi-value">{applications.length}</div>
          <div className="detail-kpi-sub">Received so far</div>
        </div>
        <div className="detail-kpi" style={{ '--kpi-accent': '#6D28D9' }}>
          <div className="detail-kpi-label"><Icon name="evaluation" />Evaluations</div>
          <div className="detail-kpi-value">
            {state.evaluations.filter(e => e.status === 'Submitted' && applications.some(a => a.id === e.applicationId)).length}
          </div>
          <div className="detail-kpi-sub">Submitted</div>
        </div>
        <div className="detail-kpi" style={{ '--kpi-accent': '#047857' }}>
          <div className="detail-kpi-label"><Icon name="pilot" />Pilot</div>
          <div className="detail-kpi-value">{pilot ? pilot.progress + '%' : '—'}</div>
          <div className="detail-kpi-sub">{pilot ? pilot.status : 'Not started'}</div>
        </div>
        <div className="detail-kpi" style={{ '--kpi-accent': '#B45309' }}>
          <div className="detail-kpi-label"><Icon name="evidence" />Evidence</div>
          <div className="detail-kpi-value">{evidenceCount}</div>
          <div className="detail-kpi-sub">Items collected</div>
        </div>
        <div className="detail-kpi" style={{ '--kpi-accent': '#6D28D9' }}>
          <div className="detail-kpi-label"><Icon name="payment" />Budget</div>
          <div className="detail-kpi-value">{fmtLakh(c.budget)}</div>
          <div className="detail-kpi-sub">{c.risk} risk</div>
        </div>
      </div>

      {/* ================ DECISION CHAIN ================ */}
      <div style={{ marginBottom: 20 }}>
        <DecisionChain challenge={c} applications={applications} pilot={pilot} validation={validation} />
      </div>

      {/* ================ EVIDENCE FLOW ================ */}
      {pilot && (
        <div style={{ marginBottom: 20 }}>
          <EvidenceFlow pilot={pilot} validation={validation} />
        </div>
      )}

      {/* ================ TABS ================ */}
      <div className="tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            {t.count != null && t.count > 0 && (
              <span style={{ opacity: 0.55 }}> ({t.count})</span>
            )}
          </button>
        ))}
      </div>

      <div>
        {tab === 'overview' && <OverviewTab challenge={c} applications={applications} pilot={pilot} />}
        {tab === 'problem' && <ProblemTab challenge={c} />}
        {tab === 'solution' && <SolutionTab challenge={c} applications={applications} onSelect={handleSelectStartup} />}
        {tab === 'pilot' && <PilotTab pilot={pilot} />}
        {tab === 'validation' && <ValidationTab validation={validation} />}
        {tab === 'payments' && <PaymentsTab pilot={pilot} />}
        {tab === 'scaleup' && <ScaleUpTab pilot={pilot} validation={validation} scaleup={scaleup} />}
        {tab === 'audit' && <AuditTab challenge={c} />}
      </div>
    </div>
  );
}

/* ---------- TAB CONTENTS ---------- */

function OverviewTab({ challenge: c, applications, pilot }) {
  return (
    <div className="grid g-2-1">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card card-pad">
          <h3 className="h3" style={{ marginBottom: 10 }}>Problem</h3>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.65 }}>{c.problem}</p>
        </div>
        <div className="card card-pad">
          <h3 className="h3" style={{ marginBottom: 10 }}>Desired outcome</h3>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.65 }}>{c.outcome}</p>
        </div>
        <div className="card">
          <div className="card-head"><h3>Outcome metrics</h3></div>
          <div className="card-pad">
            {c.kpis.map((k, i) => (
              <div className="metric-row" key={i}>
                <div>
                  <div className="mr-label" style={{ fontWeight: 600, color: 'var(--navy)' }}>{k.name}</div>
                  <div className="xsmall muted" style={{ marginTop: 2 }}>Baseline {k.baseline} → Target {k.target}</div>
                </div>
                <div className="mr-val" style={{ color: k.current !== '—' && pilot ? 'var(--primary)' : 'var(--text-3)' }}>
                  {k.current !== '—' && pilot ? k.current : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card">
          <div className="card-head"><h3>At a glance</h3></div>
          <div className="card-pad">
            <div className="metric-row"><span className="mr-label">Department</span><span className="mr-val">{c.dept}</span></div>
            <div className="metric-row"><span className="mr-label">District</span><span className="mr-val">{c.district}</span></div>
            <div className="metric-row"><span className="mr-label">Duration</span><span className="mr-val">{c.duration} days</span></div>
            <div className="metric-row"><span className="mr-label">Budget</span><span className="mr-val">{fmtINR(c.budget)}</span></div>
            <div className="metric-row"><span className="mr-label">Risk</span><span className="mr-val">{c.risk}</span></div>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Compliance</h3></div>
          <div className="card-pad">
            {[
              ['Data protection', c.compliance.dataProtection],
              ['Cybersecurity', c.compliance.cyber],
              ['IP clause', c.compliance.ip],
              ['Procurement pathway', c.compliance.procurement],
              ['Risk assessment', c.compliance.risk]
            ].map(([label, ok], i) => (
              <div className="metric-row" key={i}>
                <span className="mr-label">{label}</span>
                <span style={{ color: ok ? 'var(--success)' : 'var(--warning)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon name={ok ? 'checkCircle' : 'alertTriangle'} />
                  <span className="small" style={{ fontWeight: 650 }}>{ok ? 'Cleared' : 'Pending'}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemTab({ challenge: c }) {
  return (
    <div className="grid g-2-1">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card card-pad">
          <div className="xsmall" style={{ fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Problem statement</div>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>{c.problem}</p>
        </div>
        <div className="card card-pad">
          <div className="xsmall" style={{ fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Current baseline</div>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>{c.baseline}</p>
        </div>
        <div className="card card-pad">
          <div className="xsmall" style={{ fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Desired outcome</div>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>{c.outcome}</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card">
          <div className="card-head"><h3>Target population</h3></div>
          <div className="card-pad">
            <p className="small" style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>{c.users}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SolutionTab({ challenge: c, applications, onSelect }) {
  const state = useAppStore();
  const { role } = useSession();
  const rubric = state.rubric;

  if (!applications.length) return <EmptyState icon="startup" title="No applications yet" body="Applications will appear once startups apply." />;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h3 className="h3">Startup solutions</h3>
        <p className="small muted" style={{ marginTop: 2 }}>{applications.length} application(s) · scored against the weighted rubric</p>
      </div>
      {applications.map(a => {
        const s = state.startups.find(x => x.id === a.startupId);
        const ms = s ? matchScore(s, c) : null;
        const cons = consensus(a.id);
        const bd = breakdown(a.id);

        return (
          <div className="card" key={a.id} style={{ marginBottom: 16 }}>
            <div className="card-head">
              <div>
                <h3>{s?.name || a.startupId}</h3>
                <p>{s?.tech} · {a.id}</p>
              </div>
              {cons != null && (
                <div style={{ textAlign: 'right' }}>
                  <div className="xsmall muted">Consensus score</div>
                  <div className="h2" style={{ color: 'var(--primary)' }}>{cons}</div>
                </div>
              )}
            </div>
            <div className="card-pad">
              <div className="grid g-2" style={{ gap: 20 }}>
                <div>
                  <div className="xsmall" style={{ fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Eligibility &amp; Fit Signals</div>
                  {ms?.parts.map((p, i) => <ScoreBar key={i} label={p.label} value={p.value} color={p.color} />)}
                </div>
                <div>
                  {bd && (
                    <>
                      <div className="xsmall" style={{ fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Evaluation breakdown</div>
                      {rubric.map(r => <ScoreBar key={r.key} label={`${r.name} (${r.weight}%)`} value={bd[r.key]} />)}
                    </>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
                <Link className="btn btn-secondary btn-sm" to={`/startups/${a.startupId}`}>
                  <Icon name="eye" />View startup
                </Link>
                {role === 'officer' && ['Shortlisted', 'Evaluation'].includes(a.status) && (
                  <button className="btn btn-primary btn-sm" onClick={() => onSelect(a.id)}>
                    <Icon name="check" />Select for pilot
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PilotTab({ pilot }) {
  if (!pilot) return <EmptyState icon="pilot" title="No pilot designed yet" body="Once a startup is selected, milestones and KPIs appear here." />;
  return (
    <div className="card">
      <div className="card-head"><h3>Milestones</h3><p>{pilot.milestones.length} milestones · {fmtINR(pilot.budget)} total</p></div>
      <div className="card-pad">
        {pilot.milestones.map(m => <MilestoneCard key={m.id} milestone={m} contractValue={pilot.budget} />)}
      </div>
    </div>
  );
}

function ValidationTab({ validation }) {
  if (!validation) return <EmptyState icon="validation" title="No validation initiated" />;
  return (
    <div className="card card-pad">
      <div className="h3">{validation.startupClaim}</div>
      <div className="grid g-3" style={{ marginTop: 12 }}>
        <div><div className="xsmall muted">Claimed</div><div className="h4">{validation.claimedValue}</div></div>
        <div><div className="xsmall muted">Verified</div><div className="h4">{validation.verifiedValue}</div></div>
        <div><div className="xsmall muted">Variance</div><div className="h4">{validation.variance}</div></div>
      </div>
      <div style={{ marginTop: 12 }}><Badge status={validation.status} /></div>
    </div>
  );
}

function PaymentsTab({ pilot }) {
  const payments = useAppStore(s => s.payments);
  if (!pilot) return <EmptyState icon="payment" title="No pilot yet" />;
  const pays = payments.filter(p => p.pilotId === pilot.id);
  return (
    <div>
      {pays.map(p => (
        <div className="payment-row" key={p.id}>
          <span className="payment-row-id">{p.id}</span>
          <div className="payment-row-body">
            <div className="payment-row-milestone">Milestone {p.milestone}</div>
            <div className="payment-row-detail">{p.approvedBy ? `Approved by ${p.approvedBy}` : p.reason}</div>
          </div>
          <Badge status={p.status} />
          <div className="payment-row-amount">{fmtINR(p.amount)}</div>
        </div>
      ))}
    </div>
  );
}

function ScaleUpTab({ pilot, validation, scaleup }) {
  if (!pilot) return <EmptyState icon="scaleup" title="No pilot yet" />;
  return (
    <div>
      <PublicValue pilot={pilot} validation={validation} />
      {scaleup && (
        <div className="card">
          <div className="card-head"><h3>Scale-up decision</h3><Badge status={scaleup.status} /></div>
          <div className="card-pad">
            <div className="matrix" style={{ marginBottom: 16 }}>
              {Object.entries(scaleup.matrix || {}).map(([k, v]) => {
                const tone = v === 'High' ? 'success' : v === 'Medium' ? 'warning' : 'danger';
                return (
                  <div className="matrix-cell" key={k}>
                    <div className="mc-label">{k.charAt(0).toUpperCase() + k.slice(1)}</div>
                    <div className="mc-val" style={{ color: `var(--${tone})` }}>{v}</div>
                  </div>
                );
              })}
            </div>
            <p className="small">{scaleup.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function AuditTab({ challenge }) {
  const audit = useAppStore(s => s.audit);
  const events = audit.filter(a => a.entity === challenge.id || (a.details || '').includes(challenge.id));
  return <AuditTimeline events={events} />;
}