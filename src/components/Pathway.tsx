import React from 'react'
import { Stone } from './Stone'
import type { StoneStatus } from './Stone'
import { clsx } from 'clsx'

export interface PathwayStage {
  id: number
  name: string
  sublabel?: string
  count?: number
  status: StoneStatus
}

interface PathwayProps {
  stages: PathwayStage[]
  currentStageId?: number
  onSelectStage?: (stageId: number) => void
}

export const Pathway: React.FC<PathwayProps> = ({
  stages,
  currentStageId,
  onSelectStage,
}) => {
  return (
    <div className="w-full py-4 overflow-x-auto select-none">
      {/* Desktop Horizontal View (>= 900px) */}
      <div className="hidden min-[900px]:flex flex-col relative min-w-[840px] px-6">
        {/* The 6px Road Line with Dashed Center */}
        <div className="absolute top-[32px] left-12 right-12 h-[6px] bg-[var(--line-strong)] rounded-full z-0 overflow-hidden">
          <div className="w-full h-full border-t-2 border-dashed border-[var(--surface)] opacity-80 mt-[2px]" />
        </div>

        {/* 10 Stones evenly spaced */}
        <div className="relative z-10 flex justify-between items-start">
          {stages.map((st) => {
            const isCurrent = currentStageId === st.id || st.status === 'current'
            return (
              <div key={st.id} className="flex flex-col items-center group">
                <Stone
                  stageNumber={st.id}
                  label={st.name}
                  sublabel={st.sublabel}
                  status={isCurrent ? 'current' : st.status}
                  size={56}
                  onClick={() => onSelectStage?.(st.id)}
                />
                {typeof st.count === 'number' && (
                  <span
                    className={clsx(
                      'mt-2 px-2 py-0.5 text-xs font-semibold rounded-full border',
                      isCurrent
                        ? 'bg-[var(--marker)] text-[var(--ink)] border-[var(--marker)]'
                        : 'bg-[var(--sunken)] text-[var(--ink-2)] border-[var(--line)]'
                    )}
                  >
                    {st.count}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile Vertical View (< 900px) */}
      <div className="flex min-[900px]:hidden flex-col space-y-4 px-4">
        {stages.map((st) => {
          const isCurrent = currentStageId === st.id || st.status === 'current'
          return (
            <div
              key={st.id}
              onClick={() => onSelectStage?.(st.id)}
              className={clsx(
                'flex items-center space-x-4 p-3 rounded-[var(--radius-md)] border cursor-pointer transition-colors',
                isCurrent
                  ? 'bg-[var(--primary-tint)] border-[var(--primary)]'
                  : 'bg-[var(--surface)] border-[var(--line)] hover:bg-[var(--sunken)]'
              )}
            >
              <Stone
                stageNumber={st.id}
                status={isCurrent ? 'current' : st.status}
                size={36}
              />
              <div className="flex-1">
                <div className="font-heading font-semibold text-base text-[var(--ink)]">
                  {st.id}. {st.name}
                </div>
                {st.sublabel && (
                  <div className="text-xs text-[var(--ink-2)] mt-0.5">{st.sublabel}</div>
                )}
              </div>
              {typeof st.count === 'number' && (
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[var(--sunken)] text-[var(--ink)] border border-[var(--line)]">
                  {st.count}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
