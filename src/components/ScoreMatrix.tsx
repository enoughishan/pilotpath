import React from 'react'
import { AlertTriangle, Lock } from 'lucide-react'
import { clsx } from 'clsx'

export interface Criterion {
  id: string
  label: string
  weight: number
  maxScore?: number
}

export interface ApplicationScoreRow {
  startupId: string
  startupName: string
  blindCode: string
  scores: Record<string, number> // criterionId -> average score
  evaluatorSpreadFlags?: Record<string, boolean> // criterionId -> true if spread > 3
  isLocked?: boolean
}

interface ScoreMatrixProps {
  criteria: Criterion[]
  rows: ApplicationScoreRow[]
  blindMode?: boolean
  onSelectRow?: (startupId: string) => void
}

export const ScoreMatrix: React.FC<ScoreMatrixProps> = ({
  criteria,
  rows,
  blindMode = false,
  onSelectRow,
}) => {
  // Compute weighted score total
  const computeTotal = (scores: Record<string, number>) => {
    return criteria.reduce((sum, c) => {
      const val = scores[c.id] ?? 0
      const max = c.maxScore ?? 10
      return sum + (val / max) * c.weight
    }, 0)
  }

  return (
    <div className="w-full overflow-x-auto border border-[var(--line)] rounded-[var(--radius-md)] bg-[var(--surface)]">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-[var(--sunken)] border-b border-[var(--line)] text-[var(--ink-2)] font-heading">
            <th className="p-3 font-semibold min-w-[180px]">Startup</th>
            {criteria.map((c) => (
              <th key={c.id} className="p-3 font-semibold text-center min-w-[120px]">
                <div>{c.label}</div>
                <div className="text-[11px] text-[var(--ink-3)] font-normal font-sans">
                  weight {c.weight}%
                </div>
              </th>
            ))}
            <th className="p-3 font-semibold text-right min-w-[100px]">Total (100)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line)]">
          {rows.map((row) => {
            const total = computeTotal(row.scores)
            const displayName = blindMode ? row.blindCode : row.startupName

            return (
              <tr
                key={row.startupId}
                onClick={() => onSelectRow?.(row.startupId)}
                className={clsx(
                  'hover:bg-[var(--sunken)] transition-colors',
                  onSelectRow && 'cursor-pointer'
                )}
              >
                <td className="p-3 font-medium text-[var(--ink)]">
                  <div className="flex items-center space-x-2">
                    {row.isLocked && (
                      <span title="Scores locked">
                        <Lock className="w-3.5 h-3.5 text-[var(--ink-3)]" />
                      </span>
                    )}
                    <span>{displayName}</span>
                    {blindMode && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--sunken)] text-[var(--ink-3)] font-mono">
                        BLIND
                      </span>
                    )}
                  </div>
                </td>
                {criteria.map((c) => {
                  const score = row.scores[c.id] ?? 0
                  const hasSpread = row.evaluatorSpreadFlags?.[c.id]
                  // Calculate tint step (0-10 -> 0-1 opacity of primary tint)
                  const tintOpacity = Math.min(1, Math.max(0.08, score / 10))

                  return (
                    <td key={c.id} className="p-2 text-center">
                      <div
                        className="relative py-1.5 px-2 rounded-[var(--radius-sm)] font-mono font-semibold text-[var(--ink)]"
                        style={{
                          backgroundColor: `rgb(23 83 155 / ${tintOpacity * 0.25})`,
                        }}
                      >
                        <span>{score.toFixed(1)}</span>
                        {hasSpread && (
                          <span title="Evaluators differ widely on this criterion (spread > 3 points)">
                            <AlertTriangle className="w-3.5 h-3.5 text-[var(--stop)] absolute top-1 right-1" />
                          </span>
                        )}
                      </div>
                    </td>
                  )
                })}
                <td className="p-3 text-right font-bold font-heading text-base text-[var(--ink)] tabular-nums">
                  {total.toFixed(1)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
