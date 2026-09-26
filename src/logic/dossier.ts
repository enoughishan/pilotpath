/**
 * Evidence Dossier assembly and evidence grading module
 */

export interface DossierInputData {
  challengeTitle: string
  departmentName: string
  startupName: string
  pilotScope: string
  durationDays: number
  contractValueInr: number
  kpiResults: Array<{
    name: string
    baseline: number
    target: number
    achieved: number
    unit: string
    met: boolean
  }>
  readingsLoggedPct: number // 0 - 100
  validatorVerdict?: 'pass' | 'partial' | 'fail'
  paymentTimelinessAvgDays: number
  risksMaterializedCount: number
  recommendationText: string
}

export interface DossierReport {
  evidenceGrade: 'A' | 'B' | 'C'
  gradeRationale: string
  data: DossierInputData
}

export function computeEvidenceGrade(
  kpiResults: DossierInputData['kpiResults'],
  readingsPct: number,
  validatorVerdict?: 'pass' | 'partial' | 'fail'
): { grade: 'A' | 'B' | 'C'; rationale: string } {
  const allKpisMet = kpiResults.length > 0 && kpiResults.every((k) => k.met)
  const mostKpisMet =
    kpiResults.length > 0 && kpiResults.filter((k) => k.met).length / kpiResults.length >= 0.66

  if (validatorVerdict === 'pass' && allKpisMet && readingsPct >= 90) {
    return {
      grade: 'A',
      rationale: 'Validator pass, all KPIs met, readings logged on 90%+ of scheduled dates.',
    }
  }

  if ((validatorVerdict === 'pass' || validatorVerdict === 'partial') && mostKpisMet) {
    return {
      grade: 'B',
      rationale: 'Validator pass/partial with majority of KPI targets achieved.',
    }
  }

  return {
    grade: 'C',
    rationale: 'Unmet KPI targets, low reading cadence, or failed validation report.',
  }
}

export function assembleDossier(input: DossierInputData): DossierReport {
  const { grade, rationale } = computeEvidenceGrade(
    input.kpiResults,
    input.readingsLoggedPct,
    input.validatorVerdict
  )

  return {
    evidenceGrade: grade,
    gradeRationale: rationale,
    data: input,
  }
}
