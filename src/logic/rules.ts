/**
 * Eligibility rules evaluation engine
 */

export interface EligibilityRule {
  id: string
  label: string
  field: string
  op: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'exists'
  value: unknown
  required: boolean
  relaxableForStartups: boolean
  relaxationCondition?: string
}

export interface RuleEvaluationResult {
  ruleId: string
  label: string
  status: 'pass' | 'pass_by_relaxation' | 'fail' | 'needs_review'
  actual?: unknown
  expected: unknown
  reason: string
}

export interface EligibilityResult {
  overall: 'eligible' | 'eligible_with_relaxation' | 'not_eligible' | 'needs_review'
  ruleResults: RuleEvaluationResult[]
  exceptionsNote?: string
}

export function evaluateSingleRule(
  rule: EligibilityRule,
  data: Record<string, unknown>,
  isRecognisedStartup: boolean
): RuleEvaluationResult {
  const actual = data[rule.field]

  if (actual === undefined || actual === null) {
    return {
      ruleId: rule.id,
      label: rule.label,
      status: 'needs_review',
      actual: undefined,
      expected: rule.value,
      reason: `Field '${rule.field}' is missing or not declared. Needs manual review.`,
    }
  }

  let passed = false

  switch (rule.op) {
    case '==':
      passed = actual === rule.value
      break
    case '!=':
      passed = actual !== rule.value
      break
    case '<':
      passed = (actual as number) < (rule.value as number)
      break
    case '<=':
      passed = (actual as number) <= (rule.value as number)
      break
    case '>':
      passed = (actual as number) > (rule.value as number)
      break
    case '>=':
      passed = (actual as number) >= (rule.value as number)
      break
    case 'in':
      passed = Array.isArray(rule.value) && rule.value.includes(actual)
      break
    case 'exists':
      passed = Boolean(actual)
      break
  }

  if (passed) {
    return {
      ruleId: rule.id,
      label: rule.label,
      status: 'pass',
      actual,
      expected: rule.value,
      reason: 'Requirement satisfied.',
    }
  }

  // Check relaxation for DPIIT recognised startups
  if (rule.relaxableForStartups && isRecognisedStartup) {
    return {
      ruleId: rule.id,
      label: rule.label,
      status: 'pass_by_relaxation',
      actual,
      expected: rule.value,
      reason: `Requirement relaxed for DPIIT recognised startup (${rule.relaxationCondition || 'Startup relaxation rule'}).`,
    }
  }

  return {
    ruleId: rule.id,
    label: rule.label,
    status: 'fail',
    actual,
    expected: rule.value,
    reason: `Failed requirement: expected ${rule.op} ${rule.value}, got ${actual}.`,
  }
}

export function evaluateEligibility(
  rules: EligibilityRule[],
  startupData: Record<string, unknown>,
  isRecognisedStartup: boolean
): EligibilityResult {
  const ruleResults = rules.map((r) => evaluateSingleRule(r, startupData, isRecognisedStartup))

  const hasFail = ruleResults.some((r) => r.status === 'fail')
  const hasReview = ruleResults.some((r) => r.status === 'needs_review')
  const hasRelaxed = ruleResults.some((r) => r.status === 'pass_by_relaxation')

  let overall: EligibilityResult['overall'] = 'eligible'
  if (hasFail) {
    overall = 'not_eligible'
  } else if (hasReview) {
    overall = 'needs_review'
  } else if (hasRelaxed) {
    overall = 'eligible_with_relaxation'
  }

  return { overall, ruleResults }
}
