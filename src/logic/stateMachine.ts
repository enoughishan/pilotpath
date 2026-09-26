/**
 * 10-Stage Lifecycle State Machine & Gate Criteria Engine
 */

export type StageNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export const STAGES: Array<{ number: StageNumber; name: string }> = [
  { number: 1, name: 'Challenge' },
  { number: 2, name: 'Discovery' },
  { number: 3, name: 'Screening' },
  { number: 4, name: 'Evaluation' },
  { number: 5, name: 'Pilot design' },
  { number: 6, name: 'Contract' },
  { number: 7, name: 'Monitoring' },
  { number: 8, name: 'Payment' },
  { number: 9, name: 'Validation' },
  { number: 10, name: 'Scale-up' },
]

export interface GateRequirement {
  id: string
  label: string
  ok: boolean
  detail?: string
  fixHref?: string
}

export interface ChallengeSnapshot {
  id: string
  stage: StageNumber
  title: string
  context?: string
  baselineValue?: number
  targetValue?: number
  budgetMinLakh?: number
  budgetMaxLakh?: number
  isApprovedByDepartment?: boolean
  applicationsCount?: number
  shortlistedCount?: number
  evaluatorsScoredCount?: number
  evaluationsLocked?: boolean
  rankingApproved?: boolean
  scopeComplete?: boolean
  kpisDefinedCount?: number
  risksDefinedCount?: number
  contractAcceptedByDepartment?: boolean
  contractAcceptedByStartup?: boolean
  milestonesTotalPercent?: number
  milestonesAllReleased?: boolean
  validatorVerdictSigned?: boolean
  scaleupDossierApproved?: boolean
}

export function evaluateGate(snapshot: ChallengeSnapshot): GateRequirement[] {
  const { stage } = snapshot

  switch (stage) {
    case 1: // Challenge
      return [
        {
          id: 'gate-1-1',
          label: 'Problem statement complete (context, baseline, target, budget band)',
          ok: Boolean(
            snapshot.title &&
              snapshot.context &&
              snapshot.baselineValue !== undefined &&
              snapshot.targetValue !== undefined &&
              snapshot.budgetMinLakh !== undefined
          ),
          detail: 'Context, baseline, target, and budget band required.',
          fixHref: `/app/challenges/${snapshot.id}?tab=overview`,
        },
        {
          id: 'gate-1-2',
          label: 'Approver sign-off on challenge file',
          ok: Boolean(snapshot.isApprovedByDepartment),
          detail: 'Joint Director sign-off required.',
          fixHref: `/app/challenges/${snapshot.id}?tab=overview`,
        },
      ]

    case 2: // Discovery
      return [
        {
          id: 'gate-2-1',
          label: 'Call has closed and at least 3 startups matched or applied',
          ok: Boolean(snapshot.applicationsCount && snapshot.applicationsCount >= 3),
          detail: `Minimum 3 applications required (currently ${snapshot.applicationsCount || 0}).`,
          fixHref: `/app/challenges/${snapshot.id}?tab=startups`,
        },
      ]

    case 3: // Screening
      return [
        {
          id: 'gate-3-1',
          label: 'Eligibility run for every applicant and exceptions reviewed',
          ok: Boolean(snapshot.shortlistedCount && snapshot.shortlistedCount >= 1),
          detail: 'Shortlist at least 1 eligible startup.',
          fixHref: `/app/challenges/${snapshot.id}?tab=screening`,
        },
      ]

    case 4: // Evaluation
      return [
        {
          id: 'gate-4-1',
          label: 'At least 2 evaluators scored every shortlisted startup & locked scores',
          ok: Boolean(
            snapshot.evaluatorsScoredCount &&
              snapshot.evaluatorsScoredCount >= 2 &&
              snapshot.evaluationsLocked
          ),
          detail: '2 evaluator score sheets locked required.',
          fixHref: `/app/challenges/${snapshot.id}?tab=evaluation`,
        },
        {
          id: 'gate-4-2',
          label: 'Ranking approved by department officer',
          ok: Boolean(snapshot.rankingApproved),
          detail: 'Department officer must approve final ranking.',
          fixHref: `/app/challenges/${snapshot.id}?tab=evaluation`,
        },
      ]

    case 5: // Pilot design
      return [
        {
          id: 'gate-5-1',
          label: 'Scope, KPIs, data/IP terms, and risk register complete',
          ok: Boolean(
            snapshot.scopeComplete &&
              snapshot.kpisDefinedCount &&
              snapshot.kpisDefinedCount >= 1 &&
              snapshot.risksDefinedCount &&
              snapshot.risksDefinedCount >= 1
          ),
          detail: 'Scope, at least 1 KPI, and 1 risk mitigation required.',
          fixHref: `/app/challenges/${snapshot.id}?tab=pilot`,
        },
      ]

    case 6: // Contract
      return [
        {
          id: 'gate-6-1',
          label: 'Milestones total 100% of contract value',
          ok: Math.abs((snapshot.milestonesTotalPercent ?? 0) - 100) < 0.01,
          detail: `Current milestone total is ${snapshot.milestonesTotalPercent || 0}%. Must equal 100%.`,
          fixHref: `/app/challenges/${snapshot.id}?tab=contract`,
        },
        {
          id: 'gate-6-2',
          label: 'Accepted by both department and startup',
          ok: Boolean(
            snapshot.contractAcceptedByDepartment && snapshot.contractAcceptedByStartup
          ),
          detail: 'Dual sign-off required.',
          fixHref: `/app/challenges/${snapshot.id}?tab=contract`,
        },
      ]

    case 7: // Monitoring
      return [
        {
          id: 'gate-7-1',
          label: 'Pilot running and KPI readings logged',
          ok: Boolean(snapshot.kpisDefinedCount && snapshot.kpisDefinedCount >= 1),
          detail: 'Readings logged during pilot.',
          fixHref: `/app/challenges/${snapshot.id}?tab=pilot`,
        },
      ]

    case 8: // Payment
      return [
        {
          id: 'gate-8-1',
          label: 'Every milestone paid and released by finance',
          ok: Boolean(snapshot.milestonesAllReleased),
          detail: 'All milestone payments must be released by finance.',
          fixHref: `/app/challenges/${snapshot.id}?tab=payments`,
        },
      ]

    case 9: // Validation
      return [
        {
          id: 'gate-9-1',
          label: 'Independent validator report signed with verdict',
          ok: Boolean(snapshot.validatorVerdictSigned),
          detail: 'Validator signature required.',
          fixHref: `/app/challenges/${snapshot.id}?tab=validation`,
        },
      ]

    case 10: // Scale-up
      return [
        {
          id: 'gate-10-1',
          label: 'Scale-up dossier approved and procurement pathway chosen',
          ok: Boolean(snapshot.scaleupDossierApproved),
          detail: 'Approver sign-off on scale-up dossier.',
          fixHref: `/app/challenges/${snapshot.id}?tab=scaleup`,
        },
      ]
  }

  return []
}

export function canAdvance(snapshot: ChallengeSnapshot): boolean {
  const gates = evaluateGate(snapshot)
  return gates.length > 0 && gates.every((g) => g.ok)
}

export function advance(snapshot: ChallengeSnapshot): ChallengeSnapshot {
  if (!canAdvance(snapshot)) {
    throw new Error(`Cannot advance stage ${snapshot.stage}: gate requirements not satisfied.`)
  }
  if (snapshot.stage >= 10) {
    throw new Error('Challenge is already at final stage 10 (Scale-up).')
  }
  return {
    ...snapshot,
    stage: (snapshot.stage + 1) as StageNumber,
  }
}

export function retreat(snapshot: ChallengeSnapshot, reason: string): ChallengeSnapshot {
  if (!reason || reason.trim().length === 0) {
    throw new Error('Moving backward requires a non-empty written reason.')
  }
  if (snapshot.stage <= 1) {
    throw new Error('Challenge is already at stage 1 (Challenge).')
  }
  return {
    ...snapshot,
    stage: (snapshot.stage - 1) as StageNumber,
  }
}
