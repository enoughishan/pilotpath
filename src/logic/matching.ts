/**
 * Startup to Challenge TF-IDF & heuristic matching engine
 */

export interface ChallengeMatchInput {
  id: string
  title: string
  context: string
  sector: string
  district?: string
  tags?: string[]
}

export interface StartupMatchInput {
  id: string
  name: string
  pitch: string
  sectors: string[]
  tags: string[]
  dpiitRecognised: boolean
  pastPilots: number
  presence: string[]
  certifications: string[]
}

export interface MatchResult {
  startupId: string
  startupName: string
  score: number // 0 - 100
  breakdown: {
    textSimilarity: number // max 55
    sectorFit: number // max 20
    trackRecord: number // max 15
    readiness: number // max 10
  }
  matchedTerms: string[]
  reasons: string[]
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
}

export function matchStartupToChallenge(
  challenge: ChallengeMatchInput,
  startup: StartupMatchInput
): MatchResult {
  const challengeText = `${challenge.title} ${challenge.context} ${challenge.sector} ${(challenge.tags || []).join(' ')}`
  const startupText = `${startup.pitch} ${startup.sectors.join(' ')} ${startup.tags.join(' ')}`

  const challengeTokens = tokenize(challengeText)
  const startupTokens = tokenize(startupText)

  const challengeSet = new Set(challengeTokens)
  const matchedTerms = Array.from(new Set(startupTokens.filter((t) => challengeSet.has(t)))).slice(0, 6)

  // 1. Text similarity (0 - 55)
  const matchRatio = challengeSet.size > 0 ? matchedTerms.length / Math.min(10, challengeSet.size) : 0
  const textSimilarity = Math.min(55, Math.round(matchRatio * 55 * 1.5))

  // 2. Sector Fit (0 - 20)
  const sectorMatch = startup.sectors.some((s) => s.toLowerCase() === challenge.sector.toLowerCase())
  const sectorFit = sectorMatch ? 20 : 0

  // 3. Track record (0 - 15)
  const trackRecord = Math.min(15, startup.pastPilots * 5)

  // 4. Readiness (0 - 10)
  let readiness = 0
  const districtMatch = challenge.district && startup.presence.some((p) => p.toLowerCase() === challenge.district!.toLowerCase())
  if (districtMatch) readiness += 5
  if (startup.dpiitRecognised) readiness += 3
  if (startup.certifications.length > 0) readiness += 2
  readiness = Math.min(10, readiness)

  const totalScore = Math.min(100, textSimilarity + sectorFit + trackRecord + readiness)

  // Generate plain reasons
  const reasons: string[] = []
  if (sectorFit > 0) {
    reasons.push(`Direct sector fit in ${challenge.sector}`)
  }
  if (startup.pastPilots > 0) {
    reasons.push(`${startup.pastPilots} past successful pilot(s) on file`)
  }
  if (districtMatch) {
    reasons.push(`Active operational presence in ${challenge.district}`)
  }
  if (matchedTerms.length > 0) {
    reasons.push(`Matched key terms: ${matchedTerms.join(', ')}`)
  }

  return {
    startupId: startup.id,
    startupName: startup.name,
    score: totalScore,
    breakdown: {
      textSimilarity,
      sectorFit,
      trackRecord,
      readiness,
    },
    matchedTerms,
    reasons,
  }
}

export function rankMatchingStartups(
  challenge: ChallengeMatchInput,
  startups: StartupMatchInput[]
): MatchResult[] {
  return startups
    .map((s) => matchStartupToChallenge(challenge, s))
    .sort((a, b) => b.score - a.score)
}
