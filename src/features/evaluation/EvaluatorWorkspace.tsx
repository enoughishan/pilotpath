import React, { useState } from 'react'
import { DocumentView } from '@/components/DocumentView'
import { computeWeightedTotal } from '@/logic/scoring'
import type { RubricCriterion } from '@/logic/scoring'
import { Lock, AlertTriangle } from 'lucide-react'
import { clsx } from 'clsx'

export const EvaluatorWorkspace: React.FC = () => {

  const [hasConflict, setHasConflict] = useState<boolean | null>(null)
  const [conflictDeclared, setConflictDeclared] = useState<boolean>(false)
  const [isLocked, setIsLocked] = useState<boolean>(false)
  const [blindMode, setBlindMode] = useState<boolean>(true)

  const sampleCriteria: RubricCriterion[] = [
    { id: 'c1', label: 'Technical fit', weight: 30, guidance: 'Score 0-10 on alignment with technical specs' },
    { id: 'c2', label: 'Innovation', weight: 15, guidance: 'Novelty of approach and IP strength' },
    { id: 'c3', label: 'Feasibility and scalability', weight: 20, guidance: 'Execution feasibility in municipal conditions' },
    { id: 'c4', label: 'Data security and compliance', weight: 15, guidance: 'Compliance with data privacy guidelines' },
    { id: 'c5', label: 'Team and delivery capability', weight: 10, guidance: 'Past track record and key personnel' },
    { id: 'c6', label: 'Cost effectiveness', weight: 10, guidance: 'Value for money and pilot pricing' },
  ]

  const [scores, setScores] = useState<Record<string, number>>({
    c1: 9.0,
    c2: 8.5,
    c3: 9.0,
    c4: 8.0,
    c5: 8.5,
    c6: 8.0,
  })

  const weightedTotal = computeWeightedTotal(scores, sampleCriteria)

  const handleScoreChange = (id: string, val: number) => {
    if (isLocked || conflictDeclared) return
    setScores((prev) => ({ ...prev, [id]: val }))
  }

  const handleLockScores = async () => {
    if (confirm('Lock scores? Once locked, evaluations cannot be edited.')) {
      setIsLocked(true)
      setBlindMode(false)
      alert('Scores locked successfully.')
    }
  }

  return (
    <div className="space-y-6" data-tour="evaluator-workspace">
      {/* Conflict Check Modal */}
      {hasConflict === null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] max-w-md w-full rounded-[var(--radius-lg)] p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading font-bold text-base text-[var(--ink)]">
              Conflict of Interest Declaration
            </h3>
            <p className="text-xs text-[var(--ink-2)]">
              Do you have a financial, personal, or employment conflict of interest with this applicant?
            </p>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  setHasConflict(false)
                }}
                className="flex-1 py-2.5 bg-[var(--primary)] text-white text-xs font-semibold rounded-[var(--radius-sm)] hover:bg-[var(--primary-strong)] cursor-pointer"
              >
                No Conflict (Proceed)
              </button>
              <button
                onClick={() => {
                  setHasConflict(true)
                  setConflictDeclared(true)
                  alert('Conflict declared. Evaluation blocked for this application.')
                }}
                className="flex-1 py-2.5 bg-[var(--stop-tint)] text-[var(--stop)] text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--stop)] cursor-pointer"
              >
                Declare Conflict
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
        <div>
          <div className="text-xs text-[var(--ink-3)] font-mono">EVALUATION WORKSPACE</div>
          <h1 className="text-2xl font-bold font-heading text-[var(--ink)] mt-0.5">
            Applicant: {blindMode ? 'Startup S-01 (Blind Mode)' : 'Aquavrit Systems'}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-[10px] text-[var(--ink-3)]">WEIGHTED TOTAL</div>
            <div className="font-heading font-bold text-2xl text-[var(--primary)] tabular-nums">
              {weightedTotal.toFixed(1)} / 100
            </div>
          </div>
          <button
            disabled={isLocked || conflictDeclared}
            onClick={handleLockScores}
            className={clsx(
              'px-4 py-2 text-xs font-semibold rounded-[var(--radius-sm)] flex items-center space-x-1.5 cursor-pointer',
              isLocked
                ? 'bg-[var(--sunken)] text-[var(--ink-3)] border border-[var(--line)] cursor-not-allowed'
                : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)]'
            )}
          >
            <Lock className="w-4 h-4" />
            <span>{isLocked ? 'Scores Locked' : 'Lock scores'}</span>
          </button>
        </div>
      </div>

      {conflictDeclared && (
        <div className="p-4 bg-[var(--stop-tint)] border border-[var(--stop)] rounded-[var(--radius-md)] text-xs text-[var(--stop)] font-semibold flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Conflict of interest declared. You are blocked from scoring this application.</span>
        </div>
      )}

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Proposal View */}
        <DocumentView title="Technical Proposal: Smart Acoustic Leakage Sensors">
          <p>
            Aquavrit Systems proposes deploying 120 smart acoustic sensors across Wards 7, 12, and 19.
          </p>
          <p>
            Sensors continuously log pressure harmonics and transmit telemetry to central municipal dashboard via 4G gateways.
          </p>
        </DocumentView>

        {/* Right Rubric Scoring Sliders */}
        <div className="space-y-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] p-6">
          <h3 className="font-heading font-semibold text-base text-[var(--ink)]">
            Scoring Rubric (0 - 10 per criterion)
          </h3>

          <div className="space-y-6">
            {sampleCriteria.map((c) => {
              const val = scores[c.id] ?? 0
              return (
                <div key={c.id} className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[var(--ink)]">{c.label}</span>
                      <span className="text-[var(--ink-3)] ml-2 font-mono">({c.weight}% weight)</span>
                    </div>
                    <span className="font-mono font-bold text-sm text-[var(--primary)]">{val.toFixed(1)} / 10</span>
                  </div>

                  <p className="text-[11px] text-[var(--ink-2)] italic">{c.guidance}</p>

                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    disabled={isLocked || conflictDeclared}
                    value={val}
                    onChange={(e) => handleScoreChange(c.id, Number(e.target.value))}
                    className="w-full accent-[var(--primary)] cursor-pointer"
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
