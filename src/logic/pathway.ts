/**
 * Procurement Pathway Recommender Module
 */

export interface PathwayInputs {
  contractValueLakh: number
  evidenceGrade: 'A' | 'B' | 'C'
  capableVendorsSeen: number
  isMarketplaceListed: boolean
  wantsRepeatSites: boolean
  isProprietary: boolean
}

export interface PathwayOption {
  id: 'catalogue' | 'competitive_tender' | 'pilot_extension' | 'single_source'
  title: string
  recommendationRank: number
  rationale: string
  checkBeforeProceed: string[]
}

export function recommendProcurementPathway(inputs: PathwayInputs): PathwayOption[] {
  const options: PathwayOption[] = []

  // 1. Catalogue route
  if (inputs.isMarketplaceListed) {
    options.push({
      id: 'catalogue',
      title: 'Buy directly from government marketplace catalogue',
      recommendationRank: inputs.contractValueLakh <= 10 ? 1 : 2,
      rationale:
        'The solution is already listed on the marketplace catalogue, enabling direct purchase under threshold limits.',
      checkBeforeProceed: [
        'Confirm catalog item specification matches pilot configuration',
        'Ensure department spending limits for direct buy are not exceeded',
      ],
    })
  }

  // 2. Pilot Extension route
  if (inputs.wantsRepeatSites || inputs.evidenceGrade === 'B') {
    options.push({
      id: 'pilot_extension',
      title: 'Extend or repeat pilot at additional municipal sites',
      recommendationRank: inputs.evidenceGrade === 'B' ? 1 : 2,
      rationale:
        'Evidence grade B or multi-site validation indicates value in scaling trial scope before full procurement.',
      checkBeforeProceed: [
        'Draft pilot extension agreement with updated milestone metrics',
        'Confirm budget allocation for multi-site extension',
      ],
    })
  }

  // 3. Single-source route
  if (inputs.isProprietary && inputs.capableVendorsSeen <= 1 && inputs.evidenceGrade === 'A') {
    options.push({
      id: 'single_source',
      title: 'Award via single-source proprietary route (rules permitting)',
      recommendationRank: 1,
      rationale:
        'Solution is proprietary, single capable vendor identified, and achieved Evidence Grade A in independent validation.',
      checkBeforeProceed: [
        'Obtain proprietary article certificate (PAC) sign-off from competent authority',
        'Verify single-source procurement financial threshold limits for your department',
      ],
    })
  }

  // 4. Competitive tender route (default robust fallback)
  options.push({
    id: 'competitive_tender',
    title: 'Run competitive tender with startup procurement relaxations',
    recommendationRank: options.length === 0 ? 1 : 3,
    rationale:
      'Standard compliant procurement route offering full transparency and startup relaxations on turnover and experience.',
    checkBeforeProceed: [
      'Use standard startup tender document template with relaxed eligibility criteria',
      'Publish tender call on procurement portal with 21-day notice',
    ],
  })

  // Grade C restriction: single source never recommended for C
  const filtered = options.filter((opt) => {
    if (inputs.evidenceGrade === 'C' && opt.id === 'single_source') return false
    return true
  })

  return filtered.sort((a, b) => a.recommendationRank - b.recommendationRank)
}

export function recommendPathway(inputs: {
  contractValueLakh: number
  grade: 'A' | 'B' | 'C'
  validatorVerdict?: 'pass' | 'partial' | 'fail'
  isMarketplaceListed?: boolean
  isProprietary?: boolean
  wantsRepeatSites?: boolean
  capableVendorsSeen?: number
}): { recommendation: string; options: PathwayOption[] } {
  const options = recommendProcurementPathway({
    contractValueLakh: inputs.contractValueLakh,
    evidenceGrade: inputs.grade,
    capableVendorsSeen: inputs.capableVendorsSeen ?? 1,
    isMarketplaceListed: inputs.isMarketplaceListed ?? (inputs.contractValueLakh <= 50),
    wantsRepeatSites: inputs.wantsRepeatSites ?? false,
    isProprietary: inputs.isProprietary ?? false,
  })
  const top = options[0]
  const recommendation = top
    ? `${top.title} (GeM / Catalogue route eligible under ₹50 lakh)`
    : 'Run competitive tender with startup procurement relaxations'
  return { recommendation, options }
}

