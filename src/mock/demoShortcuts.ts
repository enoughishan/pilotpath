import { db } from '@/mock/db'
import { createAuditEvent } from '@/logic/auditChain'
import { useDemoStore } from '@/mock/demoClock'
import type { Challenge, Pilot, Milestone, Validation, ScaleDecision, AuditEvent } from '@/mock/schema'

const DEMO_APPLICANTS = [
  { startupId: 'st-aquavrit', approach: 'Acoustic leakage sensors with real-time pressure fluctuation mapping.', priceLakh: 48 },
  { startupId: 'st-nirvahan', approach: 'Automated pressure regulating valves at district metering points.', priceLakh: 52 },
  { startupId: 'st-tantu', approach: 'Ultrasonic flow meter telemetry and AI water balance algorithm.', priceLakh: 44 },
]

const writeAuditEvent = async (
  entityType: string,
  entityId: string,
  actorId: string,
  actorName: string,
  action: string,
  payload: Record<string, unknown>
) => {
  const events = await db.auditEvents.toArray()
  const ev = await createAuditEvent(events, {
    id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    entityType,
    entityId,
    actorId,
    actorName,
    action,
    payload,
    at: new Date().toISOString(),
  })
  await db.auditEvents.add(ev as AuditEvent)
}

/** Notify mounted screens that demo data changed underneath them. */
export const notifyDataChanged = () => {
  window.dispatchEvent(new CustomEvent('pilotbridge:data-changed'))
}

/** Lowest-stage active challenge — the one a presenter is most likely walking through. */
const lowestStageChallenge = async (): Promise<Challenge | null> => {
  const active = await db.challenges.filter((c) => c.status === 'active').toArray()
  if (active.length === 0) return null
  return active.sort((a, b) => a.stage - b.stage || a.createdAt.localeCompare(b.createdAt))[0]
}

/** Add the three demo applicants to the earliest active challenge that has fewer than 3 applications. */
export const simulateApplicationsArriving = async (): Promise<string> => {
  const active = await db.challenges.filter((c) => c.status === 'active').toArray()
  const candidates = active
    .filter((c) => c.stage === 2 || c.stage === 3)
    .sort((a, b) => a.stage - b.stage || a.createdAt.localeCompare(b.createdAt))

  let target: Challenge | null = null
  let existingCount = 0
  for (const c of candidates) {
    const existing = await db.applications.where('challengeId').equals(c.id).toArray()
    if (existing.length < 3) {
      target = c
      existingCount = existing.length
      break
    }
  }
  if (!target) return 'Every early-stage challenge already has applications.'

  const existing = await db.applications.where('challengeId').equals(target.id).toArray()
  const existingIds = new Set(existing.map((a) => a.startupId))
  const missing = DEMO_APPLICANTS.filter((s) => !existingIds.has(s.startupId))
  if (missing.length === 0) return `${target.id} already has all three demo applicants.`

  const now = new Date().toISOString()
  const newApps = missing.map((s, i) => ({
    id: `app-${target.id.slice(3)}-${existingCount + i + 1}`,
    challengeId: target.id,
    startupId: s.startupId,
    submittedAt: now.slice(0, 10),
    approach: s.approach,
    priceLakh: s.priceLakh,
    shortlisted: false,
  }))
  await db.applications.bulkAdd(newApps)
  await writeAuditEvent(
    'challenge',
    target.id,
    'system',
    'Demo Simulation',
    'APPLICATIONS_RECEIVED',
    { count: newApps.length, startupIds: newApps.map((a) => a.startupId) }
  )
  notifyDataChanged()
  return `${newApps.length} applications arrived for ${target.id}.`
}

/** Create a designed pilot for a challenge (idempotent) and return it. */
export const createDemoPilotFor = async (challenge: Challenge): Promise<Pilot | null> => {
  const existing = await db.pilots.where('challengeId').equals(challenge.id).first()
  if (existing) return existing

  const direction = challenge.target.value < challenge.baseline.value ? 'down' : 'up'
  const pilot: Pilot = {
    id: `pilot-${challenge.id.slice(3)}`,
    challengeId: challenge.id,
    startupId: 'st-aquavrit',
    scope: `Deploy the ${challenge.title.toLowerCase()} solution across three pilot sites for 90 days to move ${challenge.baseline.metric} from ${challenge.baseline.value}${challenge.baseline.unit} toward ${challenge.target.value}${challenge.target.unit}.`,
    durationDays: 90,
    startDate: useDemoStore.getState().currentDateStr,
    sites: ['Site Alpha', 'Site Beta', 'Site Gamma'],
    kpis: [
      {
        id: `kpi-${challenge.id.slice(3)}-a`,
        name: challenge.baseline.metric,
        unit: challenge.baseline.unit,
        baseline: challenge.baseline.value,
        target: challenge.target.value,
        direction,
        cadence: 'weekly',
        readings: [{ date: 'Week 1', value: challenge.baseline.value }],
      },
      {
        id: `kpi-${challenge.id.slice(3)}-b`,
        name: 'Cost per outcome',
        unit: '₹',
        baseline: 1000,
        target: 700,
        direction: 'down',
        cadence: 'weekly',
        readings: [{ date: 'Week 1', value: 980 }],
      },
    ],
    risks: [
      { id: 'risk-1', title: 'Site access delays', likelihood: 2, impact: 2, owner: 'u-meera', mitigation: 'Advance notice to site staff', status: 'open' },
      { id: 'risk-2', title: 'Device connectivity gaps', likelihood: 2, impact: 3, owner: 'st-aquavrit', mitigation: 'Offline sync buffers', status: 'open' },
    ],
    dataTerms: 'Department owned',
    ipTerms: 'Startup owned with non-exclusive department licence',
    cyber: [{ id: 'cy-1', label: 'Vulnerability scan', status: 'cleared' }],
    status: 'designed',
  }
  await db.pilots.add(pilot)
  await writeAuditEvent('pilot', pilot.id, 'u-meera', 'Meera Kulkarni', 'PILOT_CREATED', {
    challengeId: challenge.id,
  })
  notifyDataChanged()
  return pilot
}

export const ensureDemoMilestones = async (pilot: Pilot, maxLakh: number): Promise<Milestone[]> => {
  const existing = await db.milestones.where('pilotId').equals(pilot.id).toArray()
  if (existing.length > 0) return existing

  const total = maxLakh * 100000
  const defs = [
    { title: 'M1 Deployment and calibration', percent: 20, days: 14 },
    { title: 'M2 Baseline validated with department', percent: 20, days: 30 },
    { title: 'M3 Mid-pilot target checkpoint', percent: 30, days: 45 },
    { title: 'M4 Final target met and handover', percent: 30, days: 90 },
  ]
  const start = new Date(pilot.startDate)
  const milestones: Milestone[] = defs.map((d, i) => {
    const due = new Date(start)
    due.setDate(due.getDate() + d.days)
    return {
      id: `m-${pilot.id.slice(6)}-${i + 1}`,
      pilotId: pilot.id,
      title: d.title,
      percent: d.percent,
      amountInr: Math.round((total * d.percent) / 100),
      dueDate: due.toISOString().slice(0, 10),
      status: 'pending',
      evidenceRequired: ['Telemetry logs', 'Department sign-off'],
      evidence: [],
    }
  })
  await db.milestones.bulkAdd(milestones)
  return milestones
}

/** Completes the gate-blocking data for the current stage of the lowest-stage active challenge. */
export const fillStageWithSampleData = async (): Promise<string> => {
  const target = await lowestStageChallenge()
  if (!target) return 'No active challenge found.'
  const label = `${target.id} (Stage ${target.stage})`

  switch (target.stage) {
    case 2:
      return simulateApplicationsArriving()
    case 3: {
      let apps = await db.applications.where('challengeId').equals(target.id).toArray()
      if (apps.length === 0) {
        await simulateApplicationsArriving()
        apps = await db.applications.where('challengeId').equals(target.id).toArray()
      }
      const toShortlist = apps.slice(0, 3)
      await Promise.all(toShortlist.map((a) => db.applications.update(a.id, { shortlisted: true })))
      await writeAuditEvent('challenge', target.id, 'u-meera', 'Meera Kulkarni', 'STARTUPS_SHORTLISTED', {
        count: toShortlist.length,
      })
      notifyDataChanged()
      return `Shortlisted ${toShortlist.length} applicants for ${label}.`
    }
    case 4: {
      await writeAuditEvent('challenge', target.id, 'u-meera', 'Meera Kulkarni', 'RANKING_APPROVED', {
        challengeId: target.id,
      })
      notifyDataChanged()
      return `Ranking approved for ${label}.`
    }
    case 5: {
      await createDemoPilotFor(target)
      return `Pilot designed for ${label}.`
    }
    case 6: {
      const pilot = await createDemoPilotFor(target)
      if (!pilot) return `${label} has no pilot.`
      await ensureDemoMilestones(pilot, target.budgetBand.maxLakh)
      await writeAuditEvent('contract', pilot.id, 'u-meera', 'Meera Kulkarni', 'CONTRACT_ACCEPTED', {
        by: 'department',
      })
      notifyDataChanged()
      return `Contract and milestone schedule ready for ${label}.`
    }
    case 7: {
      await writeAuditEvent('challenge', target.id, 'u-meera', 'Meera Kulkarni', 'MONITORING_DATA_LOGGED', {
        kpis: 2,
      })
      notifyDataChanged()
      return `KPI readings logged for ${label}.`
    }
    case 8: {
      const pilot = await createDemoPilotFor(target)
      if (!pilot) return `${label} has no pilot.`
      const milestones = await db.milestones.where('pilotId').equals(pilot.id).toArray()
      const now = new Date().toISOString()
      await Promise.all(
        milestones.map((m) =>
          db.milestones.update(m.id, {
            status: 'released',
            verifiedBy: 'u-rakesh',
            approvedAt: now.slice(0, 10),
            releasedAt: now.slice(0, 10),
          })
        )
      )
      await writeAuditEvent('pilot', pilot.id, 'u-rakesh', 'Rakesh Menon', 'MILESTONES_RELEASED', {
        count: milestones.length,
      })
      notifyDataChanged()
      return `All milestones released for ${label}.`
    }
    case 9: {
      const pilot = await createDemoPilotFor(target)
      if (!pilot) return `${label} has no pilot.`
      const now = new Date().toISOString()
      const validation: Validation = {
        id: `val-${pilot.id}`,
        pilotId: pilot.id,
        validatorId: 'u-nandini',
        method: 'Evidence audit + site visit',
        kpiVerdicts: pilot.kpis.map((k) => ({ kpiId: k.id, achieved: k.target, verdict: 'pass' })),
        findings: 'Outcomes consistent with reported readings.',
        verdict: 'pass',
        signedAt: now,
      }
      await db.validations.put(validation)
      await writeAuditEvent('validation', validation.id, 'u-nandini', 'Prof. Nandini Bose', 'VALIDATION_SIGNED', {
        verdict: 'pass',
      })
      notifyDataChanged()
      return `Validation signed (pass) for ${label}.`
    }
    case 10: {
      const pilot = await db.pilots.where('challengeId').equals(target.id).first()
      const now = new Date().toISOString()
      const decision: ScaleDecision = {
        id: `scale-${target.id}`,
        pilotId: pilot?.id ?? `pilot-${target.id.slice(3)}`,
        evidenceGrade: 'A',
        pathwayChosen: 'GeM direct listing',
        rationale: 'Validated outcomes with a full audit chain.',
        approvedBy: 'u-meera',
        approvedAt: now,
      }
      await db.scaleDecisions.put(decision)
      await writeAuditEvent('challenge', target.id, 'u-meera', 'Meera Kulkarni', 'SCALE_DECISION_RECORDED', {
        grade: 'A',
      })
      notifyDataChanged()
      return `Scale-up decision recorded for ${label}.`
    }
    default:
      return `${label} has no fillable demo data.`
  }
}
