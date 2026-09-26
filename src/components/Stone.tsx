import React from 'react'
import { Check, Lock } from 'lucide-react'
import { clsx } from 'clsx'

export type StoneStatus = 'done' | 'current' | 'upcoming' | 'blocked'
export type StoneSize = 56 | 36 | 24 | 20

interface StoneProps {
  stageNumber: number
  label?: string
  sublabel?: string
  status?: StoneStatus
  size?: StoneSize
  onClick?: () => void
  activePulse?: boolean
}

export const Stone: React.FC<StoneProps> = ({
  stageNumber,
  label,
  sublabel,
  status = 'upcoming',
  size = 56,
  onClick,
  activePulse = false,
}) => {
  // Cap color selection based on status
  const capFill = {
    done: 'var(--go)',
    current: 'var(--marker)',
    upcoming: 'var(--line-strong)',
    blocked: 'var(--stop)',
  }[status]

  // Dimension scaling
  const scale = size / 56
  const width = size
  const height = Math.round(size * 1.3)
  const capHeight = Math.round(height * 0.32)

  return (
    <div
      onClick={onClick}
      className={clsx(
        'inline-flex flex-col items-center select-none group',
        onClick && 'cursor-pointer focus:outline-none'
      )}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? 'button' : undefined}
      aria-label={`Stage ${stageNumber}: ${label ?? ''} (${status})`}
    >
      <div
        className={clsx(
          'relative flex items-center justify-center transition-transform duration-200',
          status === 'current' && 'scale-[1.08]',
          activePulse && status === 'current' && 'animate-pulse'
        )}
        style={{ width, height }}
      >
        <svg
          width={width}
          height={height}
          viewBox="0 0 56 73"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-xs overflow-visible"
        >
          {/* Base stone body */}
          <path
            d="M4 24 C4 10, 16 0, 28 0 C40 0, 52 10, 52 24 L52 67 C52 70, 49 73, 46 73 L10 73 C7 73, 4 70, 4 67 Z"
            fill="var(--surface)"
            stroke="var(--line-strong)"
            strokeWidth="2.5"
          />
          {/* Top cap (30%) */}
          <path
            d="M4 24 C4 10, 16 0, 28 0 C40 0, 52 10, 52 24 L52 27 L4 27 Z"
            fill={capFill}
          />
          {/* Divider line between cap and body */}
          <line x1="4" y1="27" x2="52" y2="27" stroke="var(--line-strong)" strokeWidth="2" />
        </svg>

        {/* Number & Icon Overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-1 text-center"
          style={{ paddingTop: `${capHeight}px` }}
        >
          {size >= 24 && (
            <span
              className={clsx(
                'font-bold font-heading leading-none',
                status === 'upcoming' ? 'text-[var(--ink-3)]' : 'text-[var(--ink)]'
              )}
              style={{ fontSize: `${Math.max(10, Math.round(18 * scale))}px` }}
            >
              {stageNumber}
            </span>
          )}

          {/* Status icon badge */}
          {status === 'done' && size >= 36 && (
            <Check className="w-3.5 h-3.5 text-[var(--go)] mt-0.5" strokeWidth={3} />
          )}
          {status === 'blocked' && size >= 36 && (
            <Lock className="w-3.5 h-3.5 text-[var(--stop)] mt-0.5" strokeWidth={2.5} />
          )}
        </div>
      </div>

      {/* Labels underneath */}
      {(label || sublabel) && (
        <div className="mt-1.5 text-center max-w-[90px]">
          {label && (
            <div
              className={clsx(
                'font-semibold font-heading text-xs leading-tight line-clamp-1',
                status === 'current' ? 'text-[var(--ink)] font-bold' : 'text-[var(--ink-2)]'
              )}
            >
              {label}
            </div>
          )}
          {sublabel && (
            <div className="text-[11px] text-[var(--ink-3)] leading-tight mt-0.5 font-sans">
              {sublabel}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
