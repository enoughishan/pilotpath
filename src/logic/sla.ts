/**
 * Payment SLA calculation module
 */

export interface MilestoneSlaInput {
  id: string
  title: string
  submittedAt?: string
  status: 'pending' | 'evidence_submitted' | 'verified' | 'approved' | 'released' | 'rejected'
  slaDays?: number
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export function daysBetween(fromStr: string, toStr: string): number {
  const from = new Date(fromStr).getTime()
  const to = new Date(toStr).getTime()
  return Math.round((to - from) / (1000 * 60 * 60 * 24))
}

export function paymentDue(submittedAt: string, slaDays = 30): string {
  return addDays(submittedAt, slaDays)
}

export function ringState(
  now: string,
  submittedAt: string,
  slaDays = 30
): { elapsedPct: number; daysLeft: number; tone: 'ok' | 'watch' | 'late' } {
  const elapsedDays = daysBetween(submittedAt, now)
  const daysLeft = slaDays - elapsedDays
  const elapsedPct = Math.min(100, Math.max(0, Math.round((elapsedDays / slaDays) * 100)))

  let tone: 'ok' | 'watch' | 'late' = 'ok'
  if (daysLeft < 0 || elapsedPct > 100) {
    tone = 'late'
  } else if (elapsedPct >= 60) {
    tone = 'watch'
  }

  return { elapsedPct, daysLeft, tone }
}

export function overduePayments(
  milestones: MilestoneSlaInput[],
  now: string
): MilestoneSlaInput[] {
  return milestones.filter((m) => {
    if (m.status === 'released' || m.status === 'rejected' || !m.submittedAt) {
      return false
    }
    const sla = m.slaDays ?? 30
    const state = ringState(now, m.submittedAt, sla)
    return state.tone === 'late'
  })
}

export function computeSlaStatus(
  submittedAt: string,
  now: string,
  slaDays = 30
): { daysLeft: number; isOverdue: boolean; elapsedPct: number; tone: 'ok' | 'watch' | 'late' } {
  const state = ringState(now, submittedAt, slaDays)
  return {
    ...state,
    isOverdue: state.tone === 'late' || state.daysLeft < 0,
  }
}

