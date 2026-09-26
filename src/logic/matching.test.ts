import { describe, it, expect } from 'vitest'
import { matchStartupToChallenge, rankMatchingStartups } from './matching'
import type { ChallengeMatchInput, StartupMatchInput } from './matching'

describe('matching logic module', () => {
  const heroChallenge: ChallengeMatchInput = {
    id: 'CH-014',
    title: 'Cut water lost in ward supply networks',
    context: 'Non-revenue water and leaks in municipal water distribution',
    sector: 'Water Resources',
    district: 'Ranipur',
    tags: ['water', 'leakage', 'sensors', 'flow'],
  }

  const waterStartup: StartupMatchInput = {
    id: 's-water',
    name: 'Aquavrit Systems',
    pitch: 'Smart acoustic sensors for municipal water leak detection and pipe network monitoring',
    sectors: ['Water Resources'],
    tags: ['water', 'sensors', 'leakage'],
    dpiitRecognised: true,
    pastPilots: 2,
    presence: ['Ranipur', 'Devgarh'],
    certifications: ['ISO 9001'],
  }

  const agriStartup: StartupMatchInput = {
    id: 's-agri',
    name: 'Gramin Loop',
    pitch: 'Soil moisture sensors and crop yield optimization for farming',
    sectors: ['Agriculture'],
    tags: ['soil', 'crop'],
    dpiitRecognised: false,
    pastPilots: 0,
    presence: ['Sundarvan'],
    certifications: [],
  }

  it('ranks water startup highest for water challenge', () => {
    const results = rankMatchingStartups(heroChallenge, [agriStartup, waterStartup])
    expect(results[0].startupId).toBe('s-water')
    expect(results[0].score).toBeGreaterThan(60)
    expect(results[0].reasons).toContain('Direct sector fit in Water Resources')
  })

  it('scores unrelated startup low', () => {
    const res = matchStartupToChallenge(heroChallenge, agriStartup)
    expect(res.score).toBeLessThan(25)
  })
})
