import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { DiscoveryMatchingTab } from '@/features/challenges/DiscoveryMatchingTab'
import { EligibilityScreeningTab } from '@/features/challenges/EligibilityScreeningTab'
import { PilotMonitoringTab } from '@/features/pilots/PilotMonitoringTab'
import { ContractMilestonesTab } from '@/features/contracts/ContractMilestonesTab'
import { ScaleupDecisionTab } from '@/features/scaleup/ScaleupDecisionTab'
import { FinancePaymentsWorkspace } from '@/features/payments/FinancePaymentsWorkspace'
import { Stone } from '@/components/Stone'
import { GateChecklist } from '@/components/GateChecklist'
import { AuditTrail } from '@/components/AuditTrail'
import type { AuditLogItem } from '@/components/AuditTrail'
import { ScoreMatrix } from '@/components/ScoreMatrix'
import type { ApplicationScoreRow } from '@/components/ScoreMatrix'
import { evaluateGate, canAdvance } from '@/logic/stateMachine'
import type { ChallengeSnapshot, StageNumber } from '@/logic/stateMachine'
import { createAuditEvent, verifyChain } from '@/logic/auditChain'
import { db } from '@/mock/db'
import type { Challenge, AuditEvent } from '@/mock/schema'
import { ArrowRight, Check, ShieldCheck, Award, UserCheck, FileText } from 'lucide-react'
import { clsx } from 'clsx'

const RUBRIC_CRITERIA = [
  { id: 'c1', label: 'Technical fit', weight: 30, maxScore: 10 },
  { id: 'c2', label: 'Innovation', weight: 15, maxScore: 10 },
  { id: 'c3', label: 'Feasibility', weight: 20, maxScore: 10 },
  { id: 'c4', label: 'Data security', weight: 15, maxScore: 10 },
  { id: 'c5', label: 'Team capability', weight: 10, maxScore: 10 },
  { id: 'c6', label: 'Cost effectiveness', weight: 10, maxScore: 10 },
]

export const ChallengeWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [auditEvents, setAuditEvents] = useState<AuditLogItem[]>([])
  const [applicationsCount, setApplicationsCount] = useState<number>(0)
  const [shortlistedApps, setShortlistedApps] = useState<
    { startupId: string; startupName: string }[]
  >([])
  const [rankingApproved, setRankingApproved] = useState<boolean>(false)
  const [failedGateInfo, setFailedGateInfo] = useState<{
    stageName: string
    stageNumber: number
    gates: ReturnType<typeof evaluateGate>
  } | null>(null)
  const [confirmAdvanceOpen, setConfirmAdvanceOpen] = useState<boolean>(false)
  const activeTab = searchParams.get('tab') || 'overview'

  const mapEvents = (events: AuditEvent[]): AuditLogItem[] =>
    events.map((e) => ({
      id: e.id,
      action: e.action,
      actorName: e.actorName,
      actorRole: 'Department Officer',
      timestamp: new Date(e.at).toLocaleString(),
      hash: e.hash,
      prevHash: e.prevHash,
      payloadSummary: e.payload ? JSON.stringify(e.payload) : undefined,
    }))

  const loadChallengeData = useCallback(async () => {
    if (!id) return
    const [c, events, apps] = await Promise.all([
      db.challenges.get(id),
      db.auditEvents.where('entityId').equals(id).toArray(),
      db.applications.where('challengeId').equals(id).toArray(),
    ])
    if (c) {
      setChallenge(c)
      const rankingApprovedInChain = events.some((e) => e.action === 'RANKING_APPROVED')
      setRankingApproved(c.stage >= 5 || rankingApprovedInChain)
    }
    setAuditEvents(mapEvents(events))
    setApplicationsCount(apps.length)
    const shortlisted = apps.filter((a) => a.shortlisted)
    const startups = await db.startups.bulkGet(shortlisted.map((a) => a.startupId))
    setShortlistedApps(
      shortlisted.map((a, i) => ({
        startupId: a.startupId,
        startupName: startups[i]?.name ?? a.startupId,
      }))
    )
  }, [id])

  useEffect(() => {
    let active = true
    if (id) {
      Promise.all([
        db.challenges.get(id),
        db.auditEvents.where('entityId').equals(id).toArray(),
        db.applications.where('challengeId').equals(id).toArray(),
      ]).then(async ([c, events, apps]) => {
        if (!active) return
        if (c) {
          setChallenge(c)
          const rankingApprovedInChain = events.some((e) => e.action === 'RANKING_APPROVED')
          setRankingApproved(c.stage >= 5 || rankingApprovedInChain)
        }
        setAuditEvents(mapEvents(events))
        setApplicationsCount(apps.length)
        const shortlisted = apps.filter((a) => a.shortlisted)
        const startups = await db.startups.bulkGet(shortlisted.map((a) => a.startupId))
        if (!active) return
        setShortlistedApps(
          shortlisted.map((a, i) => ({
            startupId: a.startupId,
            startupName: startups[i]?.name ?? a.startupId,
          }))
        )
      })
    }
    return () => {
      active = false
    }
  }, [id])

  // Refresh when demo controls mutate data underneath us (Simulate applications, Fill stage...)
  useEffect(() => {
    const onChange = () => { void loadChallengeData() }
    window.addEventListener('pilotbridge:data-changed', onChange)
    return () => window.removeEventListener('pilotbridge:data-changed', onChange)
  }, [loadChallengeData])

  if (!challenge) {
    return <div className="p-8 text-[var(--ink-3)] text-sm">Loading challenge workspace...</div>
  }

  const snapshot: ChallengeSnapshot = {
    id: challenge.id,
    stage: challenge.stage as StageNumber,
    title: challenge.title,
    context: challenge.context,
    baselineValue: challenge.baseline.value,
    targetValue: challenge.target.value,
    budgetMinLakh: challenge.budgetBand.minLakh,
    budgetMaxLakh: challenge.budgetBand.maxLakh,
    isApprovedByDepartment: true,
    applicationsCount,
    shortlistedCount: shortlistedApps.length,
    evaluatorsScoredCount: 2,
    evaluationsLocked: true,
    rankingApproved: challenge.stage >= 5 || rankingApproved,
    scopeComplete: true,
    kpisDefinedCount: 2,
    risksDefinedCount: 2,
    contractAcceptedByDepartment: true,
    contractAcceptedByStartup: true,
    milestonesTotalPercent: 100,
    milestonesAllReleased: challenge.stage >= 8,
    validatorVerdictSigned: challenge.stage >= 9,
    scaleupDossierApproved: challenge.stage >= 10,
  }

  const gates = evaluateGate(snapshot)
  const isGatePassed = canAdvance(snapshot)

  const evaluationRows: ApplicationScoreRow[] = shortlistedApps.map((app, i) => ({
    startupId: app.startupId,
    startupName: app.startupName,
    blindCode: `S-0${i + 1}`,
    scores: {
      c1: 8 + ((i * 2) % 3),
      c2: 7 + ((i * 3) % 3),
      c3: 8 + ((i * 5) % 3),
      c4: 9 - ((i * 1) % 2),
      c5: 8 + ((i * 4) % 3),
      c6: 7 + ((i * 7) % 4),
    },
    isLocked: true,
  }))

  const handleAdvanceRequest = () => {
    if (!isGatePassed) {
      setFailedGateInfo({
        stageName: `Stage ${challenge.stage}`,
        stageNumber: challenge.stage,
        gates,
      })
    } else {
      setConfirmAdvanceOpen(true)
    }
  }

  const handleConfirmAdvance = async () => {
    const nextStage = (challenge.stage + 1) as StageNumber
    await db.challenges.update(challenge.id, { stage: nextStage })

    const events = await db.auditEvents.toArray()
    const ev = await createAuditEvent(events, {
      id: `aud-${Date.now()}`,
      entityType: 'challenge',
      entityId: challenge.id,
      actorId: 'u-meera',
      actorName: 'Meera Kulkarni',
      action: 'STAGE_ADVANCED',
      payload: { fromStage: challenge.stage, toStage: nextStage },
      at: new Date().toISOString(),
    })
    await db.auditEvents.add(ev as AuditEvent)

    setConfirmAdvanceOpen(false)
    loadChallengeData()
  }

  const handleApproveRanking = async () => {
    setRankingApproved(true)
    const events = await db.auditEvents.toArray()
    const ev = await createAuditEvent(events, {
      id: `aud-${Date.now()}`,
      entityType: 'challenge',
      entityId: challenge.id,
      actorId: 'u-meera',
      actorName: 'Meera Kulkarni',
      action: 'RANKING_APPROVED',
      payload: { challengeId: challenge.id },
      at: new Date().toISOString(),
    })
    await db.auditEvents.add(ev as AuditEvent)
    loadChallengeData()
  }

  const handleVerifyChain = async () => {
    const events = await db.auditEvents.toArray()
    const res = await verifyChain(events)
    return res.ok
      ? { ok: true as const, count: res.count }
      : { ok: false as const, count: res.count, brokenAt: res.brokenAt }
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'startups', label: `Startups ${applicationsCount}` },
    { id: 'screening', label: 'Screening' },
    { id: 'evaluation', label: 'Evaluation' },
    { id: 'pilot', label: 'Pilot' },
    { id: 'contract', label: 'Contract' },
    { id: 'payments', label: 'Payments 1' },
    { id: 'validation', label: 'Validation' },
    { id: 'scaleup', label: 'Scale-up' },
    { id: 'audit', label: 'Audit' },
  ]

  return (
    <div className="space-y-6" data-tour="score-matrix-review">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[var(--ink-2)]">
            <span className="font-mono font-bold">{challenge.id}</span>
            <span>•</span>
            <span>{challenge.sector}</span>
            <span>•</span>
            <span>{challenge.district}</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-[var(--ink)] mt-1">
            {challenge.title}
          </h1>
          <p className="text-xs text-[var(--ink-2)] mt-0.5">
            Urban Development Department • Owner: Meera Kulkarni
          </p>
        </div>

        <button
          onClick={handleAdvanceRequest}
          className={clsx(
            'px-5 py-2 text-xs font-semibold rounded-[var(--radius-sm)] flex items-center space-x-1.5 transition-colors cursor-pointer',
            isGatePassed
              ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)]'
              : 'bg-[var(--sunken)] text-[var(--ink-3)] border border-[var(--line)] hover:text-[var(--ink-2)]'
          )}
          title={!isGatePassed ? 'View gate requirements' : 'Advance challenge stage'}
        >
          <span>Advance to Stage {challenge.stage + 1}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 10 Stones Navigation Bar (36px) */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] p-4 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[720px] px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const isCurrent = challenge.stage === num
            const isDone = challenge.stage > num
            const status = isCurrent ? 'current' : isDone ? 'done' : 'upcoming'

            const tabMap: Record<number, string> = {
              1: 'overview',
              2: 'startups',
              3: 'screening',
              4: 'evaluation',
              5: 'pilot',
              6: 'contract',
              7: 'pilot',
              8: 'payments',
              9: 'validation',
              10: 'scaleup',
            }

            return (
              <Stone
                key={num}
                stageNumber={num}
                status={status}
                size={36}
                onClick={() => setSearchParams({ tab: tabMap[num] })}
              />
            )
          })}
        </div>
      </div>

      {/* Workspace Tabs */}
      <div className="flex space-x-1 border-b border-[var(--line)] overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setSearchParams({ tab: t.id })}
            className={clsx(
              'px-4 py-2.5 text-xs font-semibold font-heading border-b-2 transition-colors cursor-pointer whitespace-nowrap',
              activeTab === t.id
                ? 'border-[var(--primary)] text-[var(--primary-strong)] bg-[var(--primary-tint)]'
                : 'border-transparent text-[var(--ink-2)] hover:text-[var(--ink)]'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Problem Statement Card */}
            <div className="p-6 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] space-y-4">
              <h3 className="font-heading font-semibold text-lg text-[var(--ink)]">
                Problem Statement Details
              </h3>
              <p className="text-sm text-[var(--ink-2)] leading-relaxed">{challenge.context}</p>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[var(--line)] text-xs">
                <div>
                  <span className="text-[var(--ink-3)] block">Baseline Metric</span>
                  <span className="font-bold text-sm text-[var(--ink)]">
                    {challenge.baseline.value} {challenge.baseline.unit}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--ink-3)] block">Target Metric</span>
                  <span className="font-bold text-sm text-[var(--go)]">
                    {challenge.target.value} {challenge.target.unit} (within {challenge.target.byDays} days)
                  </span>
                </div>
                <div>
                  <span className="text-[var(--ink-3)] block">Budget Band</span>
                  <span className="font-semibold text-[var(--ink)]">
                    ₹{challenge.budgetBand.minLakh} to ₹{challenge.budgetBand.maxLakh} lakh
                  </span>
                </div>
                <div>
                  <span className="text-[var(--ink-3)] block">Call Window</span>
                  <span className="font-semibold text-[var(--ink)]">
                    {challenge.callOpensOn} to {challenge.callClosesOn}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--line)] text-xs">
                <span className="font-semibold text-[var(--ink)] block">Data Available:</span>
                <div className="flex flex-wrap gap-2">
                  {challenge.dataAvailable.map((d, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-[var(--sunken)] text-[var(--ink-2)]">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Audit Log Preview */}
            <AuditTrail events={auditEvents} />
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-6">
            {/* Gate Checklist Card */}
            <GateChecklist
              stageNumber={challenge.stage}
              stageName={`Stage ${challenge.stage}`}
              gates={gates}
              onFix={(href) => navigate(href)}
            />

            {/* People & Roles Card */}
            <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] space-y-3">
              <h4 className="font-heading font-semibold text-sm text-[var(--ink)]">
                Assigned Team & Roles
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-[var(--primary)]" />
                  <div>
                    <div className="font-semibold text-[var(--ink)]">Meera Kulkarni</div>
                    <div className="text-[11px] text-[var(--ink-3)]">Department Officer (Owner)</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-[var(--marker)]" />
                  <div>
                    <div className="font-semibold text-[var(--ink)]">Dr. Arvind Rao</div>
                    <div className="text-[11px] text-[var(--ink-3)]">External Evaluator</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Documents Card */}
            <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] space-y-3">
              <h4 className="font-heading font-semibold text-sm text-[var(--ink)]">
                Generated Documents
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-[var(--sunken)]">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[var(--primary)]" />
                    <span>Problem Statement v1.pdf</span>
                  </div>
                  <span className="text-[10px] text-[var(--primary)] font-bold">PDF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Startups Tab */}
      {activeTab === 'startups' && <DiscoveryMatchingTab challenge={challenge} />}

      {/* Screening Tab */}
      {activeTab === 'screening' && <EligibilityScreeningTab challenge={challenge} />}

      {/* Evaluation Tab */}
      {activeTab === 'evaluation' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-semibold text-lg text-[var(--ink)]">
                Score Matrix & Ranking Review
              </h3>
              <p className="text-xs text-[var(--ink-2)]">
                Two evaluators have locked their blinded scores for the shortlisted startups.
              </p>
            </div>
            <button
              onClick={handleApproveRanking}
              disabled={rankingApproved}
              className={clsx(
                'px-4 py-2 text-xs font-semibold rounded-[var(--radius-sm)] flex items-center space-x-1.5 transition-colors',
                rankingApproved
                  ? 'bg-[var(--go-tint)] text-[var(--go)] cursor-not-allowed'
                  : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)] cursor-pointer'
              )}
            >
              {rankingApproved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Ranking approved</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Approve ranking & unlock next stage</span>
                </>
              )}
            </button>
          </div>
          {evaluationRows.length > 0 ? (
            <ScoreMatrix criteria={RUBRIC_CRITERIA} rows={evaluationRows} />
          ) : (
            <div className="p-6 text-center text-sm text-[var(--ink-2)] bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)]">
              No shortlisted startups yet. Shortlist applicants on the Screening tab first.
            </div>
          )}
          <p className="text-xs text-[var(--ink-3)]">
            Approving the ranking records a RANKING_APPROVED event on the audit chain and satisfies the Stage 4 gate.
          </p>
        </div>
      )}

      {/* Pilot Tab */}
      {activeTab === 'pilot' && <PilotMonitoringTab challenge={challenge} />}

      {/* Contract Tab */}
      {activeTab === 'contract' && <ContractMilestonesTab challenge={challenge} />}

      {/* Payments Tab */}
      {activeTab === 'payments' && <FinancePaymentsWorkspace />}

      {/* Validation Tab */}
      {activeTab === 'validation' && (
        <div className="p-6 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-semibold text-lg text-[var(--ink)]">
                Independent Validation
              </h3>
              <p className="text-xs text-[var(--ink-2)]">
                Prof. Nandini Bose signs the outcome validation report after the pilot monitoring period.
              </p>
            </div>
            <button
              onClick={() => navigate('/app/validator/assignments')}
              className="flex items-center justify-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-[var(--radius-sm)] bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)] transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Open Validator Workspace</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--sunken)]">
              <div className="text-[var(--ink-3)]">Assignment</div>
              <div className="font-semibold text-[var(--ink)] mt-1">Validate pilot outcomes</div>
            </div>
            <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--sunken)]">
              <div className="text-[var(--ink-3)]">Validator</div>
              <div className="font-semibold text-[var(--ink)] mt-1">Prof. Nandini Bose</div>
            </div>
            <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--sunken)]">
              <div className="text-[var(--ink-3)]">Status</div>
              <div className="font-semibold text-[var(--ink)] mt-1">
                {challenge.stage >= 9 ? 'Report signed' : 'Awaiting sign-off'}
              </div>
            </div>
          </div>
          <p className="text-xs text-[var(--ink-2)]">
            The Stage 9 gate unlocks once the validator signs the report with a full pass or partial pass verdict.
          </p>
        </div>
      )}

      {/* Scaleup Tab */}
      {activeTab === 'scaleup' && <ScaleupDecisionTab challenge={challenge} />}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <p className="text-xs text-[var(--ink-2)]">
            Every action on this challenge is written to a SHA-256 hash chain. Verify below to confirm no event has been tampered with.
          </p>
          <AuditTrail events={auditEvents} onVerifyChain={handleVerifyChain} />
        </div>
      )}

      {/* Failed Gate Modal */}
      {failedGateInfo && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setFailedGateInfo(null)}
        >
          <div
            className="w-full max-w-lg bg-[var(--surface)] rounded-[var(--radius-md)] shadow-xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-lg text-[var(--ink)]">
                Cannot advance yet
              </h3>
              <button
                onClick={() => setFailedGateInfo(null)}
                className="text-xs text-[var(--ink-3)] hover:text-[var(--ink)] cursor-pointer"
              >
                Close
              </button>
            </div>
            <GateChecklist
              stageNumber={failedGateInfo.stageNumber}
              stageName={failedGateInfo.stageName}
              gates={failedGateInfo.gates}
              onFix={(href) => {
                setFailedGateInfo(null)
                navigate(href)
              }}
            />
            <p className="text-xs text-[var(--ink-2)]">
              Complete the blocking items (shown in red) above, then return here and try advancing again.
            </p>
          </div>
        </div>
      )}

      {/* Confirm Advance Modal */}
      {confirmAdvanceOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setConfirmAdvanceOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[var(--surface)] rounded-[var(--radius-md)] shadow-xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading font-semibold text-lg text-[var(--ink)]">
              Advance to Stage {challenge.stage + 1}?
            </h3>
            <p className="text-xs text-[var(--ink-2)]">
              The gate for Stage {challenge.stage} has passed. Advancing records a STAGE_ADVANCED event on the audit chain.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setConfirmAdvanceOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--line)] text-[var(--ink-2)] hover:bg-[var(--sunken)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdvance}
                className="px-4 py-2 text-xs font-semibold rounded-[var(--radius-sm)] bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)] cursor-pointer"
              >
                Move to Stage {challenge.stage + 1}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
