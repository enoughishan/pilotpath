import { Icon } from '../Icons.jsx';
import { useAppStore } from '../../store/useAppStore.js';
import { fmtINR } from '../../utils/format.js';

export function DecisionChain({ challenge, applications, pilot, validation }) {
  const state = useAppStore();
  const submittedEvals = state.evaluations.filter(e =>
    e.status === 'Submitted' && applications.some(a => a.id === e.applicationId));
  const pilotEvidence = pilot ? state.evidence.filter(e => e.pilotId === pilot.id) : [];
  const paidAmount = pilot
    ? state.payments.filter(p => p.pilotId === pilot.id && p.status === 'PAID').reduce((a, p) => a + p.amount, 0)
    : 0;
  const scaleup = state.scaleup.find(s => s.challengeId === challenge.id);

  const chain = [
    { label: 'Problem', status: challenge.problem && challenge.baseline ? 'done' : 'pending', detail: challenge.baseline ? 'Baseline established' : 'Not defined' },
    { label: 'Challenge published', status: challenge.stage !== 'CHALLENGE' ? 'done' : 'pending', detail: challenge.stage !== 'CHALLENGE' ? 'Live for discovery' : 'Draft' },
    { label: 'Startup discovered', status: applications.length > 0 ? 'done' : 'pending', detail: `${applications.length} applicant${applications.length === 1 ? '' : 's'}` },
    { label: 'Eligibility screened', status: applications.some(a => ['Shortlisted','Pilot','Evaluation'].includes(a.status)) ? 'done' : 'pending',
      detail: `${applications.filter(a => ['Shortlisted','Pilot','Evaluation'].includes(a.status)).length} eligible` },
    { label: 'Expert evaluation', status: submittedEvals.length > 0 ? 'done' : 'pending', detail: `${submittedEvals.length} submitted` },
    { label: 'Pilot approved', status: pilot ? 'done' : 'pending', detail: pilot ? pilot.id : 'Not yet' },
    { label: 'Evidence collected', status: pilotEvidence.length > 0 ? 'done' : 'pending', detail: `${pilotEvidence.length} item${pilotEvidence.length === 1 ? '' : 's'}` },
    { label: 'Independent validation', status: validation?.status === 'Validated' ? 'done' : validation ? 'warn' : 'pending', detail: validation?.status || 'Not started' },
    { label: 'Milestone payment', status: paidAmount > 0 ? 'done' : (pilot ? 'warn' : 'pending'), detail: paidAmount > 0 ? `${fmtINR(paidAmount)} released` : 'Pending' },
    { label: 'Scale-up decision', status: scaleup?.status === 'Decided' ? 'done' : scaleup ? 'warn' : 'pending', detail: scaleup?.decision || 'Awaiting validation' }
  ];

  const dotColor = (s) => s === 'done' ? 'var(--success)' : s === 'warn' ? 'var(--warning)' : 'var(--border-2)';
  const textColor = (s) => s === 'done' ? 'var(--success)' : s === 'warn' ? 'var(--warning)' : 'var(--text-3)';

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-head" style={{ borderBottom: 'none', paddingBottom: 6 }}>
        <div>
          <h3>Decision Chain</h3>
          <p>Every stage is traceable from problem to scale-up</p>
        </div>
        <span className="badge badge-neutral">
          {chain.filter(x => x.status === 'done').length}/{chain.length} complete
        </span>
      </div>
      <div style={{ padding: '0 16px 16px' }}>
        <div className="chain-wrap">
          {chain.map((step, i) => (
            <div className="chain-step" key={i}>
              <div className="chain-dot" style={{ background: dotColor(step.status), color: '#fff' }}>
                {step.status === 'done' ? <Icon name="check" /> :
                 step.status === 'warn' ? <Icon name="alertTriangle" /> :
                 <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-4)' }}>{i + 1}</span>}
              </div>
              <div className="chain-body">
                <div className="chain-label" style={{ color: textColor(step.status) }}>{step.label}</div>
                <div className="chain-detail">{step.detail}</div>
              </div>
              {i < chain.length - 1 && (
                <div className="chain-connector" style={{ background: step.status === 'done' ? 'var(--success-100)' : 'var(--border)' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}