import { STAGES } from '../data/seed.js';
import { useAppStore } from '../store/useAppStore.js';

export const nextStage = (stage) => {
  const idx = STAGES.findIndex(s => s.key === stage);
  return idx >= 0 && idx < STAGES.length - 1 ? STAGES[idx + 1].key : null;
};

export const guard = (challenge) => {
  const state = useAppStore.getState();
  const eligible = state.applications.filter(a =>
    a.challengeId === challenge.id && ['Shortlisted', 'Pilot', 'Evaluation'].includes(a.status));

  switch (challenge.stage) {
    case 'CHALLENGE':
      return challenge.problem && challenge.outcome
        ? { ok: true, reason: 'Challenge is complete and can be published to discovery.' }
        : { ok: false, reason: 'Problem statement and desired outcome are required before publishing.' };
    case 'DISCOVERY':
      return { ok: true, reason: 'Discovery is open. Move to screening when applications are received.' };
    case 'SCREENING':
      return eligible.length > 0
        ? { ok: true, reason: 'Eligible startups found. Move to evaluation.' }
        : { ok: false, reason: 'No eligible startup yet. Screening must pass at least one applicant.' };
    case 'EVALUATION':
      return state.evaluations.some(e => e.status === 'Submitted')
        ? { ok: true, reason: 'Evaluations submitted. Move to pilot design.' }
        : { ok: false, reason: 'No submitted evaluation. Evaluation must complete first.' };
    case 'PILOT_DESIGN':
      return state.applications.some(a => a.challengeId === challenge.id && a.status === 'Pilot')
        ? { ok: true, reason: 'Pilot startup selected. Move to contract.' }
        : { ok: false, reason: 'No approved startup selected for pilot.' };
    case 'CONTRACT':
      return state.contracts.some(c => c.challengeId === challenge.id && ['Active', 'Completed'].includes(c.status))
        ? { ok: true, reason: 'Contract approved. Move to monitoring.' }
        : { ok: false, reason: 'Contract not approved. Approval required before monitoring.' };
    case 'MONITORING':
      return { ok: true, reason: 'Pilot running. Move to payment when a milestone is ready.' };
    case 'PAYMENT':
      return { ok: true, reason: 'Payments in progress. Move to validation when milestones are complete.' };
    case 'VALIDATION':
      return state.validations.some(v => v.status === 'Validated' && state.pilots.some(p => p.id === v.pilotId && p.challengeId === challenge.id))
        ? { ok: true, reason: 'Validation complete. Move to scale-up decision.' }
        : { ok: false, reason: 'Validation incomplete. Independent validation must be issued first.' };
    case 'SCALE_UP':
      return { ok: false, reason: 'Already at final stage.' };
    default:
      return { ok: false, reason: 'Unknown stage.' };
  }
};