import { describe, it, expect } from 'vitest'
import {
  computeWeightedTotal,
  aggregateEvaluations,
  rankShortlist,
} from './scoring'
import type { RubricCriterion, SingleEvaluation } from './scoring'

describe('scoring logic module', () => {
  const sampleCriteria: RubricCriterion[] = [
    { id: 'c1', label: 'Technical Fit', weight: 40 },
    { id: 'c2', label: 'Innovation', weight: 20 },
    { id: 'c3', label: 'Cost Effectiveness', weight: 40 },
  ]

  it('calculates weighted total score correctly', () => {
    // 9/10 * 40 + 8/10 * 20 + 7/10 * 40 = 36 + 16 + 28 = 80
    const total = computeWeightedTotal({ c1: 9, c2: 8, c3: 7 }, sampleCriteria)
    expect(total).toBe(80)
  })

  it('flags wide evaluator spread (>3 points)', () => {
    const evals: SingleEvaluation[] = [
      {
        id: 'e1',
        applicationId: 'app-1',
        startupId: 'st-1',
        evaluatorId: 'ev-1',
        scores: { c1: 9, c2: 8, c3: 7 },
        conflict: { declared: false },
      },
      {
        id: 'e2',
        applicationId: 'app-1',
        startupId: 'st-1',
        evaluatorId: 'ev-2',
        scores: { c1: 4, c2: 8, c3: 7 }, // c1 spread is 9 - 4 = 5 > 3
        conflict: { declared: false },
      },
    ]

    const agg = aggregateEvaluations(
      'app-1',
      'st-1',
      'Aquavrit',
      'S-01',
      evals,
      sampleCriteria
    )
    expect(agg.spreadFlags.c1).toBe(true)
    expect(agg.spreadFlags.c2).toBeUndefined()
  })

  it('excludes declared conflicts from aggregation', () => {
    const evals: SingleEvaluation[] = [
      {
        id: 'e1',
        applicationId: 'app-1',
        startupId: 'st-1',
        evaluatorId: 'ev-1',
        scores: { c1: 9, c2: 9, c3: 9 },
        conflict: { declared: false },
      },
      {
        id: 'e2',
        applicationId: 'app-1',
        startupId: 'st-1',
        evaluatorId: 'ev-2',
        scores: { c1: 1, c2: 1, c3: 1 },
        conflict: { declared: true, note: 'Ex-employee' },
      },
    ]

    const agg = aggregateEvaluations(
      'app-1',
      'st-1',
      'Aquavrit',
      'S-01',
      evals,
      sampleCriteria
    )
    expect(agg.evaluationsCount).toBe(1)
    expect(agg.averageTotal).toBe(90)
  })

  it('ranks startups with tie-break rules', () => {
    const s1 = {
      applicationId: 'app-1',
      startupId: 'st-1',
      startupName: 'Startup A',
      blindCode: 'S-01',
      averageTotal: 80,
      criterionAverages: { c1: 9, c2: 6, c3: 7 },
      spreadFlags: {},
      evaluationsCount: 2,
    }
    const s2 = {
      applicationId: 'app-2',
      startupId: 'st-2',
      startupName: 'Startup B',
      blindCode: 'S-02',
      averageTotal: 80,
      criterionAverages: { c1: 7, c2: 9, c3: 8 },
      spreadFlags: {},
      evaluationsCount: 2,
    }

    const ranked = rankShortlist([s2, s1], sampleCriteria)
    // s1 has higher Technical Fit (c1 = 9 vs 7) -> should rank first
    expect(ranked[0].startupId).toBe('st-1')
  })
})
