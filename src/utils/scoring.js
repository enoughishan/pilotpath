import { useAppStore } from '../store/useAppStore.js';

export const weighted = (scores, rubric) => {
  let total = 0, wsum = 0;
  rubric.forEach(r => {
    const s = scores[r.key];
    if (typeof s === 'number') { total += s * r.weight; wsum += r.weight; }
  });
  return wsum ? +(total / wsum).toFixed(1) : 0;
};

export const consensus = (applicationId) => {
  const state = useAppStore.getState();
  const evs = state.evaluations.filter(e => e.applicationId === applicationId && e.status === 'Submitted');
  if (!evs.length) return null;
  const scores = evs.map(e => weighted(e.scores, state.rubric));
  return +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
};

export const breakdown = (applicationId) => {
  const state = useAppStore.getState();
  const evs = state.evaluations.filter(e => e.applicationId === applicationId && e.status === 'Submitted');
  if (!evs.length) return null;
  const out = {};
  state.rubric.forEach(r => {
    const vals = evs.map(e => e.scores[r.key]).filter(v => typeof v === 'number');
    out[r.key] = vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0;
  });
  return out;
};

export const matchScore = (startup, challenge) => {
  const techFit = startup.techFit || 80;
  const industryMatch = startup.industry && challenge.dept ? 78 + (startup.industry.length % 5) * 3 : 75;
  const readiness = startup.readiness || 80;
  const experience = Math.max(0, Math.min(100, 60 + (startup.deployments || 0) * 7));
  const costFit = Math.max(40, Math.min(100, 100 - Math.abs((startup.cost || 1000000) - (challenge.budget || 1000000)) / (challenge.budget || 1000000) * 100));
  const compliance = (startup.certs || []).includes('ISO 27001') ? 92 : 74;
  const overall = Math.round(techFit * .25 + industryMatch * .2 + readiness * .2 + experience * .15 + costFit * .1 + compliance * .1);
  return {
    overall,
    parts: [
      { label: 'Technical fit', value: Math.round(techFit), color: 'var(--primary)' },
      { label: 'Problem fit', value: Math.round(industryMatch), color: 'var(--info)' },
      { label: 'Deployment readiness', value: Math.round(readiness), color: 'var(--success)' },
      { label: 'Experience', value: Math.round(experience), color: 'var(--purple)' },
      { label: 'Cost fit', value: Math.round(costFit), color: 'var(--warning)' },
      { label: 'Compliance readiness', value: Math.round(compliance), color: '#0F766E' }
    ]
  };
};