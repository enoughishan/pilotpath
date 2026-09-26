import { describe, it, expect } from 'vitest'
import { evaluateGate, canAdvance, advance, retreat } from './stateMachine'
import type { ChallengeSnapshot } from './stateMachine'

describe('stateMachine logic module', () => {
  const stage1Passing: ChallengeSnapshot = {
    id: 'CH-014',
    stage: 1,
    title: 'Cut water lost in ward supply networks',
    context: 'Municipal NRW water loss',
    baselineValue: 38,
    targetValue: 25,
    budgetMinLakh: 40,
    budgetMaxLakh: 60,
    isApprovedByDepartment: true,
  }

  const stage1Failing: ChallengeSnapshot = {
    ...stage1Passing,
    isApprovedByDepartment: false,
  }

  it('evaluates gate requirements correctly', () => {
    const gatesPass = evaluateGate(stage1Passing)
    expect(gatesPass.every((g) => g.ok)).toBe(true)

    const gatesFail = evaluateGate(stage1Failing)
    expect(gatesFail.some((g) => !g.ok)).toBe(true)
  })

  it('advances stage when gate passes', () => {
    expect(canAdvance(stage1Passing)).toBe(true)
    const next = advance(stage1Passing)
    expect(next.stage).toBe(2)
  })

  it('throws error on advance when gate fails', () => {
    expect(canAdvance(stage1Failing)).toBe(false)
    expect(() => advance(stage1Failing)).toThrow('not satisfied')
  })

  it('requires a written reason to retreat', () => {
    const stage2Snap: ChallengeSnapshot = { ...stage1Passing, stage: 2 }
    expect(() => retreat(stage2Snap, '')).toThrow('requires a non-empty written reason')
    const prev = retreat(stage2Snap, 'Needs additional scope editing')
    expect(prev.stage).toBe(1)
  })

  it('requires stage 8 gate to have all milestones released', () => {
    const stage8Pending: ChallengeSnapshot = {
      ...stage1Passing,
      stage: 8,
      milestonesAllReleased: false,
    }
    expect(canAdvance(stage8Pending)).toBe(false)

    const stage8Released: ChallengeSnapshot = {
      ...stage1Passing,
      stage: 8,
      milestonesAllReleased: true,
    }
    expect(canAdvance(stage8Released)).toBe(true)
  })
})
