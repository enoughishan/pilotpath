import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { Pathway } from '@/components/Pathway'
import type { PathwayStage } from '@/components/Pathway'
import { GateChecklist } from '@/components/GateChecklist'
import { evaluateGate, canAdvance } from '@/logic/stateMachine'
import type { ChallengeSnapshot, StageNumber } from '@/logic/stateMachine'
import { db } from '@/mock/db'
import { createAuditEvent } from '@/logic/auditChain'
import type { Challenge, Application, Milestone, AuditEvent } from '@/mock/schema'
import { Plus, MoveRight } from 'lucide-react'
import { clsx } from 'clsx'

const STAGE_NAMES: Record<number, string> = {
  1: 'Challenge',
  2: 'Discovery',
  3: 'Screening',
  4: 'Evaluation',
  5: 'Pilot design',
  6: 'Contract',
  7: 'Monitoring',
  8: 'Payment',
  9: 'Validation',
  10: 'Scale-up',
}

interface DraggableChallengeCardProps {
  challenge: Challenge
  needsAction: boolean
  onOpen: (challenge: Challenge) => void
  onMove: (challenge: Challenge) => void
}

const DraggableChallengeCard: React.FC<DraggableChallengeCardProps> = ({
  challenge,
  needsAction,
  onOpen,
  onMove,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: challenge.id,
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => !isDragging && onOpen(challenge)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.target === e.currentTarget) onOpen(challenge)
      }}
      role="button"
      tabIndex={0}
      aria-label={`${challenge.id}: ${challenge.title}. Press Enter to open.`}
      className={clsx(
        'p-3 bg-[var(--surface)] border rounded-[var(--radius-sm)] space-y-2 cursor-grab transition-all hover:border-[var(--primary)] relative group touch-manipulation select-none',
        needsAction
          ? 'border-l-4 border-l-[var(--marker)] border-t-[var(--line)] border-r-[var(--line)] border-b-[var(--line)]'
          : 'border-[var(--line)]',
        isDragging && 'opacity-40 shadow-lg ring-2 ring-[var(--primary)] cursor-grabbing'
      )}
    >
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-mono font-bold text-[var(--ink-2)]">{challenge.id}</span>
        <span className="text-[var(--ink-3)] font-medium">Day 12</span>
      </div>

      <div className="font-heading font-semibold text-xs leading-snug text-[var(--ink)] line-clamp-2">
        {challenge.title}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-[var(--line)] text-[10px]">
        <span className="text-[var(--ink-2)]">{challenge.district}</span>
        <span className="flex items-center space-x-2">
          {needsAction && (
            <span className="px-1.5 py-0.5 rounded bg-[var(--marker-tint)] text-[var(--ink)] font-bold">
              Needs action
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMove(challenge)
            }}
            title={`Move ${challenge.id} to next stage`}
            aria-label={`Move ${challenge.id} to the next stage (keyboard alternative to drag)`}
            className="p-1 rounded bg-[var(--sunken)] border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--primary)] hover:border-[var(--primary)] cursor-pointer"
          >
            <MoveRight className="w-3 h-3" />
          </button>
        </span>
      </div>
    </div>
  )
}

interface DroppableStageColumnProps {
  num: number
  stageName: string
  count: number
  children: React.ReactNode
}

const DroppableStageColumn: React.FC<DroppableStageColumnProps> = ({ num, stageName, count, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `col-${num}` })

  return (
    <div
      ref={setNodeRef}
      id={`col-${num}`}
      className={clsx(
        'w-72 shrink-0 bg-[var(--sunken)] border rounded-[var(--radius-md)] p-3 space-y-3 flex flex-col transition-colors',
        isOver ? 'border-[var(--primary)] bg-[var(--primary-tint)]' : 'border-[var(--line)]'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
        <div className="font-heading font-semibold text-xs text-[var(--ink)] flex items-center space-x-1.5">
          <span className="w-5 h-5 rounded-full bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center text-[10px] font-bold">
            {num}
          </span>
          <span>{stageName}</span>
        </div>
        <span className="text-[11px] font-bold text-[var(--ink-2)] px-2 py-0.5 rounded-full bg-[var(--surface)]">
          {count}
        </span>
      </div>

      {children}
    </div>
  )
}

export const PathwayBoard: React.FC = () => {
  const navigate = useNavigate()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [failedGateInfo, setFailedGateInfo] = useState<{
    challengeId: string
    stageName: string
    stageNumber: number
    gates: ReturnType<typeof evaluateGate>
  } | null>(null)

  const [confirmMoveInfo, setConfirmMoveInfo] = useState<{
    challenge: Challenge
    nextStage: StageNumber
  } | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const loadChallenges = useCallback((attempt = 0) => {
    const fetchChallenges = (curAttempt: number) => {
      Promise.all([
        db.challenges.toArray(),
        db.applications.toArray(),
        db.milestones.toArray(),
      ]).then(([list, apps, mstones]) => {
        if (list.length === 0 && curAttempt < 10) {
          setTimeout(() => fetchChallenges(curAttempt + 1), 500)
          return
        }
        setChallenges(list)
        setApplications(apps)
        setMilestones(mstones)
      })
    }
    fetchChallenges(attempt)
  }, [])

  useEffect(() => {
    loadChallenges()
  }, [loadChallenges])

  // Refresh when demo controls mutate data underneath us (Simulate applications, Fill stage...)
  useEffect(() => {
    const onChange = () => loadChallenges()
    window.addEventListener('pilotbridge:data-changed', onChange)
    return () => window.removeEventListener('pilotbridge:data-changed', onChange)
  }, [loadChallenges])

  // Build a gate-evaluation snapshot from live database state
  const buildSnapshot = (challenge: Challenge): ChallengeSnapshot => {
    const challengeApplications = applications.filter((a) => a.challengeId === challenge.id)
    // pilot ids follow challenge ids in the seed (pilot-014, pilot-004, ...)
    const pilotMilestones = milestones.filter((m) => m.pilotId === `pilot-${challenge.id.slice(3)}`)

    return {
      id: challenge.id,
      stage: challenge.stage as StageNumber,
      title: challenge.title,
      context: challenge.context,
      baselineValue: challenge.baseline.value,
      targetValue: challenge.target.value,
      budgetMinLakh: challenge.budgetBand.minLakh,
      budgetMaxLakh: challenge.budgetBand.maxLakh,
      isApprovedByDepartment: true,
      applicationsCount: challengeApplications.length,
      shortlistedCount: challengeApplications.filter((a) => a.shortlisted).length,
      evaluatorsScoredCount: 2,
      evaluationsLocked: true,
      rankingApproved: true,
      scopeComplete: true,
      kpisDefinedCount: 2,
      risksDefinedCount: 2,
      contractAcceptedByDepartment: true,
      contractAcceptedByStartup: true,
      milestonesTotalPercent: 100,
      milestonesAllReleased:
        pilotMilestones.length > 0
          ? pilotMilestones.every((m) => m.status === 'released')
          : challenge.stage >= 9,
      validatorVerdictSigned: challenge.stage >= 9,
      scaleupDossierApproved: challenge.stage >= 10,
    }
  }

  // Attempt to move a challenge one stage forward through its gate
  const attemptMove = (challenge: Challenge) => {
    const targetStageNum = (challenge.stage + 1) as StageNumber
    if (targetStageNum > 10) return

    const snapshot = buildSnapshot(challenge)
    const gates = evaluateGate(snapshot)
    const allOk = canAdvance(snapshot)

    if (!allOk) {
      setFailedGateInfo({
        challengeId: challenge.id,
        stageName: STAGE_NAMES[challenge.stage] || `Stage ${challenge.stage}`,
        stageNumber: challenge.stage,
        gates,
      })
    } else {
      setConfirmMoveInfo({ challenge, nextStage: targetStageNum })
    }
  }

  // Handle Drag End event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const challengeId = active.id as string
    const targetStageNum = parseInt((over.id as string).replace('col-', ''), 10) as StageNumber
    const challenge = challenges.find((c) => c.id === challengeId)
    if (!challenge) return

    // One stage forward at a time; no skipping or moving backwards
    if (targetStageNum !== challenge.stage + 1) return

    attemptMove(challenge)
  }

  // Generate 10-stage pathway stage counters
  const pathwayStages: PathwayStage[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
    const count = challenges.filter((c) => c.stage === num).length
    return {
      id: num,
      name: STAGE_NAMES[num],
      count,
      status: num === 7 ? 'current' : count > 0 ? 'done' : 'upcoming',
    }
  })

  const handleConfirmMove = async () => {
    if (!confirmMoveInfo) return
    const { challenge } = confirmMoveInfo

    // Advance stage
    const nextStage = (challenge.stage + 1) as StageNumber
    await db.challenges.update(challenge.id, { stage: nextStage })

    // Create audit event
    const events = await db.auditEvents.toArray()
    const newEvent = await createAuditEvent(events, {
      id: `aud-${Date.now()}`,
      entityType: 'challenge',
      entityId: challenge.id,
      actorId: 'u-meera',
      actorName: 'Meera Kulkarni',
      action: 'STAGE_ADVANCED',
      payload: { fromStage: challenge.stage, toStage: nextStage },
      at: new Date().toISOString(),
    })
    await db.auditEvents.add(newEvent as AuditEvent)

    setConfirmMoveInfo(null)
    loadChallenges()
  }

  return (
    <div className="space-y-6" data-tour="pathway-board">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[var(--ink)]">
            Pathway Board
          </h1>
          <p className="text-xs text-[var(--ink-2)] mt-0.5">
            {challenges.length} challenges, 4 need your action
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] cursor-pointer"
          >
            <option value="all">All Departments</option>
            <option value="ud">Urban Development</option>
            <option value="ph">Public Health</option>
            <option value="action">Needs My Action</option>
          </select>

          <button
            onClick={() => navigate('/app/challenges/new')}
            className="px-4 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)] flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New challenge</span>
          </button>
        </div>
      </div>

      {/* Top Overview Road */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] p-4">
        <Pathway
          stages={pathwayStages}
          currentStageId={7}
          onSelectStage={(id) => {
            const el = document.getElementById(`col-${id}`)
            el?.scrollIntoView({ behavior: 'smooth', inline: 'center' })
          }}
        />
      </div>

      {/* 10 Column Drag and Drop Board */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const stageChallenges = challenges.filter((c) => c.stage === num)
            const stageName = pathwayStages[num - 1].name

            return (
              <DroppableStageColumn
                key={num}
                num={num}
                stageName={stageName}
                count={stageChallenges.length}
              >
                {/* Challenge Cards List */}
                <div className="space-y-2 flex-1 min-h-[160px]">
                  {stageChallenges.map((c) => {
                    const needsAction = c.id === 'CH-014' || c.id === 'CH-018'
                    return (
                      <DraggableChallengeCard
                        key={c.id}
                        challenge={c}
                        needsAction={needsAction}
                        onOpen={(challenge) =>
                          navigate(`/app/challenges/${challenge.id}?tab=overview`)
                        }
                        onMove={attemptMove}
                      />
                    )
                  })}

                  {stageChallenges.length === 0 && (
                    <div className="h-full flex items-center justify-center text-xs text-[var(--ink-3)] py-8 border border-dashed border-[var(--line)] rounded">
                      No challenges
                    </div>
                  )}
                </div>
              </DroppableStageColumn>
            )
          })}
        </div>
      </DndContext>

      {/* Gate Failed Check Popover / Modal */}
      {failedGateInfo && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] max-w-md w-full rounded-[var(--radius-lg)] p-6 space-y-4 shadow-2xl">
            <GateChecklist
              stageNumber={failedGateInfo.stageNumber}
              stageName={failedGateInfo.stageName}
              gates={failedGateInfo.gates}
              onFix={(href) => {
                setFailedGateInfo(null)
                navigate(href)
              }}
            />
            <button
              onClick={() => setFailedGateInfo(null)}
              className="w-full py-2 bg-[var(--sunken)] text-xs font-semibold text-[var(--ink)] rounded-[var(--radius-sm)] border border-[var(--line)] hover:bg-[var(--surface)] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirm Move Modal */}
      {confirmMoveInfo && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] max-w-sm w-full rounded-[var(--radius-lg)] p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading font-bold text-base text-[var(--ink)]">
              Advance Stage Gate?
            </h3>
            <p className="text-xs text-[var(--ink-2)]">
              Move <strong>{confirmMoveInfo.challenge.id}</strong> to stage{' '}
              <strong>{confirmMoveInfo.nextStage}</strong>? An entry will be appended to the audit chain.
            </p>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setConfirmMoveInfo(null)}
                className="flex-1 py-2 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--sunken)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMove}
                className="flex-1 py-2 text-xs font-semibold rounded-[var(--radius-sm)] bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)] cursor-pointer"
              >
                Move to next stage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
