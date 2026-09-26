import { describe, it, expect } from 'vitest'
import { evaluateStatementQuality } from './statementQuality'

describe('statementQuality logic module', () => {
  it('flags solution prescriptive wording', () => {
    const checks = evaluateStatementQuality({
      context: 'We need a custom blockchain AI app to track water meters',
      baselineMetric: 'NRW %',
      baselineValue: 38,
      targetValue: 25,
      budgetMinLakh: 40,
      budgetMaxLakh: 60,
      dataAvailable: ['Flow logs'],
      constraints: ['No PII'],
    })

    const q2 = checks.find((c) => c.id === 'q2')
    expect(q2?.passed).toBe(false)
    expect(q2?.feedback).toContain('This names a solution')
  })

  it('passes high quality outcome statement', () => {
    const checks = evaluateStatementQuality({
      context: 'High non-revenue water loss in municipal wards requiring detection and repair optimization',
      baselineMetric: 'NRW %',
      baselineValue: 38,
      targetValue: 25,
      budgetMinLakh: 40,
      budgetMaxLakh: 60,
      dataAvailable: ['Flow logs'],
      constraints: ['No PII'],
    })

    expect(checks.every((c) => c.passed)).toBe(true)
  })
})
