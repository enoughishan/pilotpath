/**
 * Rubric evaluation and scoring module
 */

export interface RubricCriterion {
  id: string
  label: string
  weight: number
  guidance?: string
  maxScore?: number
}

export interface SingleEvaluation {
  id: string
  applicationId: string
  startupId: string
  evaluatorId: string
  scores: Record<string, number> // criterionId -> score (0-10)
  comments?: Record<string, string>
  conflict: { declared: boolean; note?: string }
  lockedAt?: string
}

export interface ConsolidatedScore {
  applicationId: string
  startupId: string
  startupName: string
  blindCode: string
  averageTotal: number
  criterionAverages: Record<string, number>
  spreadFlags: Record<string, boolean> // true if spread > 3
  evaluationsCount: number
}

export interface EvaluatorScoreSet {
  evaluatorId: string
  scores: Record<string, number>
}

export function computeWeightedTotal(
  scoresOrCriteria: Record<string, number> | RubricCriterion[],
  criteriaOrScores: RubricCriterion[] | Record<string, number>
): number {
  let scores: Record<string, number>
  let criteria: RubricCriterion[]
  if (Array.isArray(scoresOrCriteria)) {
    criteria = scoresOrCriteria
    scores = criteriaOrScores as Record<string, number>
  } else {
    scores = scoresOrCriteria
    criteria = criteriaOrScores as RubricCriterion[]
  }
  return criteria.reduce((sum, c) => {
    const s = scores[c.id] ?? 0
    const max = c.maxScore ?? 10
    return sum + (s / max) * c.weight
  }, 0)
}

export function detectSpread(
  evaluatorScores: Array<{ evaluatorId: string; scores: Record<string, number> }>,
  threshold = 3
): Record<string, boolean> {
  const flags: Record<string, boolean> = {}
  if (evaluatorScores.length < 2) return flags
  const allCriteria = new Set<string>()
  evaluatorScores.forEach((e) => Object.keys(e.scores).forEach((c) => allCriteria.add(c)))
  for (const c of allCriteria) {
    const vals = evaluatorScores.map((e) => e.scores[c]).filter((v) => typeof v === 'number')
    if (vals.length > 1) {
      const min = Math.min(...vals)
      const max = Math.max(...vals)
      if (max - min > threshold) {
        flags[c] = true
      }
    }
  }
  return flags
}

export function aggregateEvaluations(
  applicationId: string,
  startupId: string,
  startupName: string,
  blindCode: string,
  evaluations: SingleEvaluation[],
  criteria: RubricCriterion[]
): ConsolidatedScore {
  // Filter out evaluations with conflicts
  const validEvals = evaluations.filter((e) => !e.conflict?.declared)

  if (validEvals.length === 0) {
    const zeroAverages = Object.fromEntries(criteria.map((c) => [c.id, 0]))
    return {
      applicationId,
      startupId,
      startupName,
      blindCode,
      averageTotal: 0,
      criterionAverages: zeroAverages,
      spreadFlags: {},
      evaluationsCount: 0,
    }
  }

  const criterionAverages: Record<string, number> = {}
  const spreadFlags: Record<string, boolean> = {}

  for (const c of criteria) {
    const scoresForC = validEvals.map((e) => e.scores[c.id] ?? 0)
    const avg = scoresForC.reduce((a, b) => a + b, 0) / validEvals.length
    criterionAverages[c.id] = avg

    if (scoresForC.length > 1) {
      const min = Math.min(...scoresForC)
      const max = Math.max(...scoresForC)
      if (max - min > 3) {
        spreadFlags[c.id] = true
      }
    }
  }

  const averageTotal = computeWeightedTotal(criterionAverages, criteria)

  return {
    applicationId,
    startupId,
    startupName,
    blindCode,
    averageTotal,
    criterionAverages,
    spreadFlags,
    evaluationsCount: validEvals.length,
  }
}

export function rankShortlist(
  consolidatedScores: ConsolidatedScore[],
  criteria: RubricCriterion[]
): ConsolidatedScore[] {
  // Find technical fit criterion ID and cost effectiveness criterion ID
  const techFitId = criteria.find((c) => c.label.toLowerCase().includes('technical'))?.id
  const costEffId = criteria.find((c) => c.label.toLowerCase().includes('cost'))?.id

  return [...consolidatedScores].sort((a, b) => {
    // Primary: Total score
    if (Math.abs(b.averageTotal - a.averageTotal) > 0.001) {
      return b.averageTotal - a.averageTotal
    }
    // Tie-break 1: Technical Fit score
    if (techFitId) {
      const aTech = a.criterionAverages[techFitId] ?? 0
      const bTech = b.criterionAverages[techFitId] ?? 0
      if (Math.abs(bTech - aTech) > 0.001) {
        return bTech - aTech
      }
    }
    // Tie-break 2: Cost Effectiveness score
    if (costEffId) {
      const aCost = a.criterionAverages[costEffId] ?? 0
      const bCost = b.criterionAverages[costEffId] ?? 0
      return bCost - aCost
    }
    return a.startupName.localeCompare(b.startupName)
  })
}
