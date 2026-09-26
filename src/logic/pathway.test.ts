import { describe, it, expect } from 'vitest'
import { recommendProcurementPathway } from './pathway'
import type { PathwayInputs } from './pathway'

describe('pathway logic module', () => {
  it('recommends single-source for Grade A proprietary solution with 1 vendor', () => {
    const inputs: PathwayInputs = {
      contractValueLakh: 48,
      evidenceGrade: 'A',
      capableVendorsSeen: 1,
      isMarketplaceListed: false,
      wantsRepeatSites: false,
      isProprietary: true,
    }

    const options = recommendProcurementPathway(inputs)
    expect(options[0].id).toBe('single_source')
  })

  it('never recommends single-source for Grade C evidence', () => {
    const inputs: PathwayInputs = {
      contractValueLakh: 48,
      evidenceGrade: 'C',
      capableVendorsSeen: 1,
      isMarketplaceListed: false,
      wantsRepeatSites: false,
      isProprietary: true,
    }

    const options = recommendProcurementPathway(inputs)
    expect(options.some((o) => o.id === 'single_source')).toBe(false)
  })
})
