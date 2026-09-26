/**
 * Problem statement quality analyzer logic module
 */

export interface QualityCheckItem {
  id: string
  label: string
  passed: boolean
  feedback?: string
}

export function evaluateStatementQuality(input: {
  context: string
  baselineMetric?: string
  baselineValue?: number
  targetValue?: number
  budgetMinLakh?: number
  budgetMaxLakh?: number
  dataAvailable?: string[]
  constraints?: string[]
}): QualityCheckItem[] {
  const fullText = (input.context || '').toLowerCase()

  // Solution prescriptive terms check
  const prescriptiveTerms = ['blockchain', 'ai app', 'flutter app', 'react app', 'drone service', 'iot device', 'custom portal', 'mobile application']
  const foundPrescriptive = prescriptiveTerms.filter((term) => fullText.includes(term))

  return [
    {
      id: 'q1',
      label: 'Measurable baseline and target specified',
      passed:
        Boolean(input.baselineMetric) &&
        input.baselineValue !== undefined &&
        input.targetValue !== undefined,
      feedback: 'Ensure quantitative baseline and target KPI metrics are defined.',
    },
    {
      id: 'q2',
      label: 'Outcome-focused problem statement (not solution prescriptive)',
      passed: foundPrescriptive.length === 0,
      feedback:
        foundPrescriptive.length > 0
          ? `This names a solution ("${foundPrescriptive.join(', ')}"). Describe the outcome you need so more startups can propose approaches.`
          : 'Great! Stated as a clear operational outcome.',
    },
    {
      id: 'q3',
      label: 'Operational constraints listed',
      passed: Boolean(input.constraints && input.constraints.length > 0),
      feedback: 'List at least one operational or technical constraint.',
    },
    {
      id: 'q4',
      label: 'Data availability declared',
      passed: Boolean(input.dataAvailable && input.dataAvailable.length > 0),
      feedback: 'State datasets or logs available to startups.',
    },
    {
      id: 'q5',
      label: 'Budget band defined',
      passed:
        input.budgetMinLakh !== undefined &&
        input.budgetMaxLakh !== undefined &&
        input.budgetMaxLakh >= input.budgetMinLakh,
      feedback: 'Provide minimum and maximum estimated budget band in lakhs.',
    },
  ]
}
