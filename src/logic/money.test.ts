import { describe, it, expect } from 'vitest'
import { formatInr, formatShort, parseInr, allocate } from './money'

describe('money logic module', () => {
  it('formats INR numbers correctly', () => {
    expect(formatInr(1250000)).toContain('12,50,000')
    expect(formatInr(4800000)).toContain('48,00,000')
  })

  it('formats short lakh and crore amounts', () => {
    expect(formatShort(1250000)).toBe('₹12.5 lakh')
    expect(formatShort(12000000)).toBe('₹1.2 crore')
    expect(formatShort(4800000)).toBe('₹48 lakh')
  })

  it('parses INR strings', () => {
    expect(parseInr('12.5 lakh')).toBe(1250000)
    expect(parseInr('1.2 crore')).toBe(12000000)
    expect(parseInr('₹48,00,000')).toBe(4800000)
  })

  it('allocates amounts without losing rounding remainders', () => {
    const allocated = allocate(4800000, [20, 20, 30, 30])
    expect(allocated).toEqual([960000, 960000, 1440000, 1440000])
    expect(allocated.reduce((a, b) => a + b, 0)).toBe(4800000)
  })
})
