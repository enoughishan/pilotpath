import React from 'react'
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'

export interface GateRule {
  id: string
  label: string
  ok: boolean
  detail?: string
  fixHref?: string
}

interface GateChecklistProps {
  stageName: string
  stageNumber: number
  gates: GateRule[]
  onFix?: (href: string) => void
}

export const GateChecklist: React.FC<GateChecklistProps> = ({
  stageName,
  stageNumber,
  gates,
  onFix,
}) => {
  const allPassed = gates.every((g) => g.ok)

  return (
    <div className="p-4 border border-[var(--line)] rounded-[var(--radius-md)] bg-[var(--surface)] space-y-3">
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
        <div className="flex items-center space-x-2">
          <span className="font-heading font-bold text-sm text-[var(--ink)]">
            Stage {stageNumber} Gate: {stageName}
          </span>
        </div>
        <span
          className={clsx(
            'px-2 py-0.5 text-xs font-semibold rounded-full',
            allPassed
              ? 'bg-[var(--go-tint)] text-[var(--go)]'
              : 'bg-[var(--stop-tint)] text-[var(--stop)]'
          )}
        >
          {allPassed ? 'Gate Ready' : 'Gate Blocked'}
        </span>
      </div>

      <div className="space-y-2">
        {gates.map((g) => (
          <div
            key={g.id}
            className="flex items-start justify-between text-xs p-2 rounded-[var(--radius-sm)] bg-[var(--sunken)]"
          >
            <div className="flex items-start space-x-2">
              {g.ok ? (
                <CheckCircle2 className="w-4 h-4 text-[var(--go)] shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-[var(--stop)] shrink-0 mt-0.5" />
              )}
              <div>
                <div className={clsx('font-medium', g.ok ? 'text-[var(--ink)]' : 'text-[var(--stop)]')}>
                  {g.label}
                </div>
                {g.detail && <div className="text-[11px] text-[var(--ink-2)] mt-0.5">{g.detail}</div>}
              </div>
            </div>

            {!g.ok && g.fixHref && (
              <button
                onClick={() => onFix?.(g.fixHref!)}
                className="flex items-center space-x-1 text-[var(--primary)] hover:text-[var(--primary-strong)] font-semibold shrink-0 cursor-pointer ml-2"
              >
                <span>Fix</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
