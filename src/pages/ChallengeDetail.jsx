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
import { fmtDate, fmtINR, fmtLakh } from '../utils/format.js';
import { useToast } from '../components/ui/Toast.jsx';

export default function ChallengeDetail() {
  const { id } = useParams();
  const state = useAppStore();
  const { role, persona } = useSession();
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

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'problem', label: 'Problem' },
    { key: 'solution', label: 'Solution', count: applications.length },
    { key: 'pilot', label: 'Pilot' },
    { key: 'evidence', label: 'Evidence', count: pilot ? state.evidence.filter(e => e.pilotId === pilot.id).length : 0 },
    { key: 'validation', label: 'Validation' },
    { key: 'payments', label: 'Payments' },
    { key: 'scaleup', label: 'Scale-up' },
    { key: 'audit', label: 'Audit' }
  ];

  const handleAdvance = () => {
    if (!g.ok) { toast.warning('Cannot advance', g.reason); return; }
    state.update('challenges', c.id, { stage: next, status: next === 'SCALE_UP' ? 'Decision pending' : 'In progress' });
    state.logAudit({ user: persona()?.name, role: 'Government Officer', action: `Stage advanced to ${STAGES.find(s => s.key === next)?.name}`, entity: c.id, details: g.reason });
    toast.success('Workflow advanced', `${c.id} → ${STAGES.find(s => s.key === next)?.name}`);
  };

  const handleSelectStartup = (appId) => {
    const app = state.applications.find(a => a.id === appId);
    if (!app) return;
    state.update('applications', app.id, { status: 'Pilot' });
    const startup = state.startups.find(s => s.id === app.startupId);
    state.logAudit({ user: persona()?.name, role: 'Government Officer', action: 'Startup selected for pilot', entity: c.id, details: `${startup?.name} selected for pilot.` });
    toast.success('Startup selected', `${startup?.name} is now the pilot vendor.`);
  };

  return (
    <div className="content">
      <div className="breadcrumb">
        <Link to="/pathway">Pathway Board</Link><Icon name="chevronRight" />
        <Link to="/challenges">Challenges</Link><Icon name="chevronRight" />
        <span>{c.id}</span>
      </div>

      <div className="page-head">
        <div className="ph-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
            <span className="mono" style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 13 }}>{c.id}</span>
            <Badge status={c.stage} />
            <PriorityBadge priority={c.priority} />
          </div>
          <h1 className="h1">{c.title}</h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 6 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="building" />{c.dept}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="mapPin" />{c.district}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="calendar" />Day {c.day}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="payment" />{fmtLakh(c.budget)}</span>
          </p>
        </div>
        <div className="ph-actions">
          {role === 'gov' && c.stage !== 'SCALE_UP' && (
            <button className="btn btn-primary" disabled={!g.ok} title={!g.ok ? g.reason : ''} onClick={handleAdvance}>
              <Icon name="chevronRight" />Advance to {STAGES.find(s => s.key === next)?.name || '—'}
            </button>
          )}
        </div>
      </div>

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

      <div style={{ marginBottom: 20 }}>
        <DecisionChain challenge={c} applications={applications} pilot={pilot} validation={validation} />
      </div>

      {pilot && (
        <div style={{ marginBottom: 20 }}>
          <EvidenceFlow pilot={pilot} validation={validation} />
        </div>
      )}

      <div className="tabs">
        {tabs.map(t => (
          <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
            {t.count != null && t.count > 0 && <span style={{ opacity: .55 }}> ({t.count})</span>}
          </button>
        ))}
      </div>

      <div>
        {tab === 'overview' && <OverviewTab challenge={c} applications={applications} pilot={pilot} />}
        {tab === 'problem' && <ProblemTab challenge={c} />}
        {tab === 'solution' && <SolutionTab challenge={c} applications={applications} onSelect={handleSelectStartup} />}
        {tab === 'pilot' && <PilotTab challenge={c} pilot={pilot} />}
        {tab === 'evidence' && <EvidenceTab pilot={pilot} />}
        {tab === 'validation' && <ValidationTab validation={validation} />}
        {tab === 'payments' && <PaymentsTab pilot={pilot} />}
        {tab === 'scaleup' && <ScaleUpTab pilot={pilot} validation={validation} scaleup={scaleup} />}
        {tab === 'audit' && <AuditTab challenge={c} />}
      </div>
    </div>
  );
}

function OverviewTab({ challenge: c, applications, pilot }) {
  return (
    <div className="grid g-2-1">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card card-pad">
          <h3 className="h3" style={{ marginBottom: 10 }}>Problem</h3>
          <p style={{ color: 'var(--text-2)', lineHeight: 1.65 }}>{c.problem}</p>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <div className="xsmall muted" style={{ marginBottom: 4 }}>Current baseline</div>
            <p className="small" style={{ color: 'var(--text-2)' }}>{c.baseline}</p>
          </div>
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
            <div className="metric-row"><span className="mr-label">Applications</span><span className="mr-val">{applications.length}</span></div>
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
        <div className="card">
          <div className="card-head"><h3>KPI targets</h3></div>
          <div className="card-pad">
            {c.kpis.map((k, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="h4" style={{ marginBottom: 4 }}>{k.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <span className="muted">{k.baseline}</span>
                  <Icon name="chevronRight" />
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{k.target}</span>
                </div>
              </div>
            ))}
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
        <p className="small muted" style={{ marginTop: 2 }}>{applications.length} application(s) · scored against the active weighted rubric</p>
      </div>
      {applications.map(a => {
        const s = state.startups.find(x => x.id === a.startupId);
        const ms = s ? matchScore(s, c) : null;
        const cons = consensus(a.id);
        const bd = breakdown(a.id);
        const evs = state.evaluations.filter(e => e.applicationId === a.id);
        return (
          <div className="card" key={a.id} style={{ marginBottom: 16 }}>
            <div className="card-head">
              <div>
                <h3>{s?.name || a.startupId}</h3>
                <p>{s?.tech} · {a.id}</p>
              </div>
              {cons != null && <div style={{ textAlign: 'right' }}><div className="xsmall muted">Consensus</div><div className="h2" style={{ color: 'var(--primary)' }}>{cons}</div></div>}
            </div>
            <div className="card-pad">
              <div className="grid g-2" style={{ gap: 20 }}>
                <div>
                  <div className="xsmall" style={{ fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Eligibility & Fit Signals</div>
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
                <Link className="btn btn-secondary btn-sm" to={`/startups/${a.startupId}`}><Icon name="eye" />View startup</Link>
                {role === 'gov' && ['Shortlisted','Evaluation'].includes(a.status) && (
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
  if (!pilot) return <EmptyState icon="pilot" title="No pilot designed yet" body="Once a startup is selected, the pilot design wizard will create milestones and KPIs." />;
  return (
    <div className="card">
      <div className="card-head"><h3>Milestones</h3><p>{pilot.milestones.length} milestones · {fmtINR(pilot.budget)} total</p></div>
      <div className="card-pad">
        {pilot.milestones.map(m => <MilestoneCard key={m.id} milestone={m} contractValue={pilot.budget} />)}
      </div>
    </div>
  );
}

function EvidenceTab({ pilot }) {
  const evidence = useAppStore(s => s.evidence);
  if (!pilot) return <EmptyState icon="evidence" title="No pilot yet" />;
  const evs = evidence.filter(e => e.pilotId === pilot.id);
  if (!evs.length) return <EmptyState icon="evidence" title="No evidence uploaded" />;
  return <div className="grid g-3">{evs.map(e => <EvidenceCard key={e.id} evidence={e} />)}</div>;
}

function ValidationTab({ validation }) {
  if (!validation) return <EmptyState icon="validation" title="No validation initiated" />;
  return <div className="small muted">Validation ID: {validation.id} · Status: {validation.status}</div>;
}

function PaymentsTab({ pilot }) {
  const payments = useAppStore(s => s.payments);
  if (!pilot) return <EmptyState icon="payment" title="No pilot yet" />;
  const pays = payments.filter(p => p.pilotId === pilot.id);
  return (
    <div className="tbl-wrap">
      <table>
        <thead><tr><th>Milestone</th><th>Amount</th><th>Status</th><th>Approved</th></tr></thead>
        <tbody>
          {pays.map(p => (
            <tr key={p.id}>
              <td><b>{p.milestone}</b></td>
              <td><b>{fmtINR(p.amount)}</b></td>
              <td><Badge status={p.status} /></td>
              <td className="muted small">{p.approvedBy || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
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