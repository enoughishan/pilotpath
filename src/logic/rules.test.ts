import { describe, it, expect } from 'vitest'
import { evaluateEligibility } from './rules'
import type { EligibilityRule } from './rules'

describe('rules logic module', () => {
  const ruleset: EligibilityRule[] = [
    {
      id: 'r1',
      label: 'Registered Entity',
      field: 'registeredEntity',
      op: '==',
      value: true,
      required: true,
      relaxableForStartups: false,
    },
    {
      id: 'r2',
      label: 'Minimum Turnover',
      field: 'turnoverCr',
      op: '>=',
      value: 3,
      required: false,
      relaxableForStartups: true,
      relaxationCondition: 'Waived for DPIIT recognised startups',
    },
  ]

  it('passes eligible startup fully', () => {
    const data = { registeredEntity: true, turnoverCr: 5 }
    const result = evaluateEligibility(ruleset, data, false)
    expect(result.overall).toBe('eligible')
  })

  it('applies relaxation to recognized startup with low turnover', () => {
    const data = { registeredEntity: true, turnoverCr: 0.5 }
    const result = evaluateEligibility(ruleset, data, true)
    expect(result.overall).toBe('eligible_with_relaxation')
    expect(result.ruleResults[1].status).toBe('pass_by_relaxation')
  })

  it('fails non-recognized startup with low turnover', () => {
    const data = { registeredEntity: true, turnoverCr: 0.5 }
    const result = evaluateEligibility(ruleset, data, false)
    expect(result.overall).toBe('not_eligible')
    expect(result.ruleResults[1].status).toBe('fail')
  })

  it('yields needs_review when data is missing', () => {
    const data = { registeredEntity: true }
    const result = evaluateEligibility(ruleset, data, false)
    expect(result.overall).toBe('needs_review')
    expect(result.ruleResults[1].status).toBe('needs_review')
  })
})
