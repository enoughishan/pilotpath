import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { KpiCard } from '../components/widgets/KpiCard.jsx';
import { Pipeline } from '../components/widgets/Pipeline.jsx';
import { ChallengeCard } from '../components/widgets/ChallengeCard.jsx';
import { Bars } from '../components/widgets/Chart.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { useAppStore } from '../store/useAppStore.js';
import { useSession } from '../store/useSession.js';
import { STAGES } from '../data/seed.js';
import { fmtLakh, fmtINR } from '../utils/format.js';
import { useToast } from '../components/ui/Toast.jsx';
import { useState } from 'react';

export default function Dashboard() {
  const state = useAppStore();
  const { persona, role } = useSession();
  const toast = useToast();
  const [selectedStage, setSelectedStage] = useState(null);

  const pilotValue = state.pilots.reduce((a, p) => a + (p.budget || 0), 0);
  const activeChallenges = state.challenges.filter(c => c.stage !== 'SCALE_UP').length;
  const runningPilots = state.pilots.filter(p => p.status === 'Active').length;
  const readyForScaleup = state.pilots.filter(p => p.status === 'Validated' || p.status === 'Completed').length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Attention items
  const attention = [];

  state.challenges.filter(c => c.stage === 'EVALUATION').forEach(c => {
    const apps = state.applications.filter(a => a.challengeId === c.id);
    const submitted = state.evaluations.filter(e => e.status === 'Submitted' && apps.some(a => a.id === e.applicationId));
    const totalPossible = apps.length * 2;
    if (submitted.length < totalPossible) {
      attention.push({
        tone: 'warning', icon: 'evaluation',
        title: `${c.id} — Evaluation incomplete`,
        body: `${submitted.length}/${totalPossible} evaluations submitted · deadline 28 Sep`,
        link: `/challenges/${c.id}`,
        action: 'Open evaluation'
      });
    }
  });

  state.evidence.filter(e => e.status === 'Under review' || e.status === 'Submitted').forEach(e => {
    const pilot = state.pilots.find(p => p.id === e.pilotId);
    if (pilot && !attention.some(a => a.title.includes(pilot.id))) {
      attention.push({
        tone: 'warning', icon: 'validation',
        title: `${pilot.id} — Validation pending`,
        body: `${state.evidence.filter(x => x.pilotId === pilot.id).length} evidence files · validator action required`,
        link: '/validation',
        action: 'Open validation'
      });
    }
  });

  state.payments.filter(p => p.status === 'AWAITING_PAYMENT').forEach(p => {
    const pilot = state.pilots.find(x => x.id === p.pilotId);
    attention.push({
      tone: 'danger', icon: 'payment',
      title: `${fmtINR(p.amount)} — Payment awaiting approval`,
      body: `${p.milestone} · ${pilot?.title || p.pilotId}`,
      link: '/payments',
      action: 'Review payment'
    });
  });

  const toneColor = (t) => t === 'danger' ? 'var(--danger)' : t === 'warning' ? 'var(--warning)' : 'var(--primary)';
  const toneBg = (t) => t === 'danger' ? 'var(--danger-50)' : t === 'warning' ? 'var(--warning-50)' : 'var(--primary-50)';

  const filteredChallenges = selectedStage
    ? state.challenges.filter(c => c.stage === selectedStage)
    : state.challenges.slice(0, 6);

  return (
    <div className="content">
      <div className="page-head">
        <div className="ph-left">
          <div className="xsmall" style={{ fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>
            Government Innovation Control Center
          </div>
          <h1 className="h1">{greeting}, {persona()?.name.split(' ')[0] || 'there'}</h1>
          <p>Track public-sector problems from challenge → evidence → scale-up.</p>
        </div>
        <div className="ph-actions">
          <Link className="btn btn-primary" to="/challenges/new"><Icon name="plus" />New Challenge</Link>
          <button className="btn btn-secondary" onClick={() => toast.info('Run Demo', 'Starting cross-role journey…')}>
            <Icon name="play" />Run Demo
          </button>
        </div>
      </div>

      <div className="grid g-4" style={{ marginBottom: 20 }}>
        <KpiCard label="Pilot Value" value={fmtLakh(pilotValue)} sub={`Across ${state.pilots.length} pilots`} accent="blue" iconName="payment" />
        <KpiCard label="Active Challenges" value={activeChallenges} sub="Across 7 departments" accent="purple" iconName="challenge" onClick="/challenges" />
        <KpiCard label="Running Pilots" value={runningPilots} sub="Monitored weekly" accent="green" iconName="pilot" onClick="/pilots" />
        <KpiCard label="Ready for Scale-up" value={readyForScaleup} sub="Validation complete" accent="amber" iconName="scaleup" onClick="/scaleup" />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <div>
            <h3>Where attention is needed</h3>
            <p>Decisions and verifications awaiting your role</p>
          </div>
          <span className={`badge badge-${attention.length ? 'warning' : 'success'}`}>
            {attention.length} item{attention.length === 1 ? '' : 's'}
          </span>
        </div>
        <div className="card-pad">
          {attention.length ? attention.slice(0, 6).map((a, i) => (
            <Link key={i} className="attention-item" to={a.link}>
              <div className="ai-icon" style={{ background: toneBg(a.tone), color: toneColor(a.tone) }}>
                <Icon name={a.icon} />
              </div>
              <div className="ai-body">
                <b>{a.title}</b>
                <span>{a.body}</span>
              </div>
              <span className={`badge badge-${a.tone === 'danger' ? 'danger' : a.tone === 'warning' ? 'warning' : 'info'}`}>{a.action}</span>
            </Link>
          )) : <EmptyState icon="checkCircle" title="All clear" body="No items currently require your attention." />}
        </div>
      </div>

      <div className="grid g-2-1" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-head">
            <div><h3>10-stage innovation pipeline</h3><p>Click a stage to filter challenges below</p></div>
          </div>
          <div className="card-pad">
            <Pipeline challenges={state.challenges} activeStage={selectedStage} onSelect={setSelectedStage} />
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Pipeline distribution</h3></div>
          <div className="card-pad">
            <Bars
              data={STAGES.map(s => ({
                label: s.name.split(' ')[0],
                value: state.challenges.filter(c => c.stage === s.key).length,
                color: 'var(--primary)'
              }))}
              height={190}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div><h3>{selectedStage ? 'Filtered challenges' : 'Recent challenges'}</h3>
            <p>{selectedStage ? `Stage: ${STAGES.find(s => s.key === selectedStage)?.name}` : 'Across all departments and districts'}</p>
          </div>
          {selectedStage ? (
            <button className="btn btn-secondary btn-sm" onClick={() => setSelectedStage(null)}><Icon name="x" />Clear filter</button>
          ) : (
            <Link className="btn btn-secondary btn-sm" to="/pathway">View Pathway Board <Icon name="chevronRight" /></Link>
          )}
        </div>
        <div className="card-pad">
          {filteredChallenges.length ? (
            <div className="grid g-3">
              {filteredChallenges.map(c => <ChallengeCard key={c.id} challenge={c} />)}
            </div>
          ) : <EmptyState icon="challenge" title="No challenges in this stage" body="Select another stage to view challenges." />}
        </div>
      </div>
    </div>
  );
}