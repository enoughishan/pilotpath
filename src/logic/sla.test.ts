import { describe, it, expect } from 'vitest'
import { paymentDue, ringState, overduePayments } from './sla'

describe('sla logic module', () => {
  it('calculates due date from submission date', () => {
    expect(paymentDue('2026-08-01', 30)).toBe('2026-08-31')
  })

  it('determines ringState tones accurately', () => {
    // 5 days elapsed out of 30 -> ok (16%)
    expect(ringState('2026-08-06', '2026-08-01', 30)).toEqual({
      elapsedPct: Math.round((5 / 30) * 100),
      daysLeft: 25,
      tone: 'ok',
    })

    // 20 days elapsed out of 30 -> watch (66%)
    expect(ringState('2026-08-21', '2026-08-01', 30).tone).toBe('watch')

    // 35 days elapsed out of 30 -> late (-5 days)
    expect(ringState('2026-09-05', '2026-08-01', 30)).toEqual({
      elapsedPct: 100,
      daysLeft: -5,
      tone: 'late',
    })
  })

  it('filters overdue payments', () => {
    const milestones = [
      { id: 'm1', title: 'M1', submittedAt: '2026-08-01', status: 'evidence_submitted' as const },
      { id: 'm2', title: 'M2', submittedAt: '2026-09-15', status: 'evidence_submitted' as const },
      { id: 'm3', title: 'M3', submittedAt: '2026-08-01', status: 'released' as const },
    ]

    const overdue = overduePayments(milestones, '2026-09-22')
    expect(overdue.length).toBe(1)
    expect(overdue[0].id).toBe('m1')
  })
})
