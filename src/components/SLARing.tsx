import React from 'react'
import { clsx } from 'clsx'

interface SLARingProps {
  daysLeft: number
  totalSlaDays?: number
  size?: number
}

export const SLARing: React.FC<SLARingProps> = ({
  daysLeft,
  totalSlaDays = 30,
  size = 48,
}) => {
  const isOverdue = daysLeft < 0
  const elapsedDays = isOverdue ? totalSlaDays + Math.abs(daysLeft) : totalSlaDays - daysLeft
  const elapsedPct = Math.min(100, Math.max(0, (elapsedDays / totalSlaDays) * 100))

  // Tone determination
  let tone: 'ok' | 'watch' | 'late' = 'ok'
  if (isOverdue || elapsedPct > 100) {
    tone = 'late'
  } else if (elapsedPct >= 60) {
    tone = 'watch'
  }

  const strokeColor = {
    ok: 'var(--go)',
    watch: 'var(--marker)',
    late: 'var(--stop)',
  }[tone]

  const radius = (size - 6) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Math.min(elapsedPct, 100) / 100) * circumference

  return (
    <div className="inline-flex flex-col items-center select-none" title={`${daysLeft} days remaining of ${totalSlaDays}-day SLA`}>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--line)"
            strokeWidth="3.5"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth="3.5"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span className="font-bold font-heading text-xs tabular-nums text-[var(--ink)]">
            {Math.abs(daysLeft)}
          </span>
        </div>
      </div>
      <span
        className={clsx(
          'text-[10px] font-medium leading-tight mt-0.5',
          tone === 'late' ? 'text-[var(--stop)] font-semibold' : 'text-[var(--ink-2)]'
        )}
      >
        {isOverdue ? 'days late' : 'days left'}
      </span>
    </div>
  )
}
