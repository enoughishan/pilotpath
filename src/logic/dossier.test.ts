import { describe, it, expect } from 'vitest'
import { assembleDossier, computeEvidenceGrade } from './dossier'
import type { DossierInputData } from './dossier'

describe('dossier logic module', () => {
  const sampleInput: DossierInputData = {
    challengeTitle: 'Cut water lost in ward supply networks',
    departmentName: 'Urban Development Department',
    startupName: 'Aquavrit Systems',
    pilotScope: 'Wards 7, 12 and 19',
    durationDays: 90,
    contractValueInr: 4800000,
    kpiResults: [
      { name: 'Non-revenue water %', baseline: 38, target: 25, achieved: 24, unit: '%', met: true },
      { name: 'Leak repair time', baseline: 72, target: 24, achieved: 20, unit: 'hours', met: true },
    ],
    readingsLoggedPct: 95,
    validatorVerdict: 'pass',
    paymentTimelinessAvgDays: 19,
    risksMaterializedCount: 0,
    recommendationText: 'Proceed to scale-up procurement across municipal wards.',
  }

  it('assigns Grade A for perfect pilot execution', () => {
    const dossier = assembleDossier(sampleInput)
    expect(dossier.evidenceGrade).toBe('A')
    expect(dossier.gradeRationale).toContain('Validator pass, all KPIs met')
  })

  it('downgrades to B if reading cadence is low', () => {
    const grade = computeEvidenceGrade(sampleInput.kpiResults, 75, 'pass')
    expect(grade.grade).toBe('B')
  })

  it('downgrades to C if validator verdict is fail', () => {
    const grade = computeEvidenceGrade(sampleInput.kpiResults, 95, 'fail')
    expect(grade.grade).toBe('C')
  })
})
