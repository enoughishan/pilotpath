import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DocumentView } from '@/components/DocumentView'
import { evaluateStatementQuality } from '@/logic/statementQuality'
import { db } from '@/mock/db'
import { createAuditEvent } from '@/logic/auditChain'
import type { AuditEvent } from '@/mock/schema'
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'

export const ChallengeBuilder: React.FC = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState<number>(1)
  const [problemText, setProblemText] = useState<string>('')
  const [isDrafting, setIsDrafting] = useState<boolean>(false)

  // Structured fields
  const [title, setTitle] = useState<string>('')
  const [sector] = useState<string>('Urban Development')
  const [district] = useState<string>('Ranipur')
  const [context, setContext] = useState<string>('')
  const [baselineMetric, setBaselineMetric] = useState<string>('Non-revenue water %')
  const [baselineValue, setBaselineValue] = useState<number>(38)
  const [baselineUnit] = useState<string>('%')
  const [targetValue, setTargetValue] = useState<number>(25)
  const [byDays, setByDays] = useState<number>(90)
  const [budgetMinLakh, setBudgetMinLakh] = useState<number>(40)
  const [budgetMaxLakh, setBudgetMaxLakh] = useState<number>(60)
  const [dataAvailable, setDataAvailable] = useState<string>('12 months flow logs, pipe network map')
  const [constraints, setConstraints] = useState<string>('No consumer PII, intermittent supply support')
  const [isApproved, setIsApproved] = useState<boolean>(false)

  const handleUseSample = () => {
    setProblemText(
      'A quarter of treated water and more in some wards never reaches a bill. Leaks are found by complaints, repair takes days, and meter data is incomplete.'
    )
    setTitle('Cut water lost in ward supply networks')
    setContext(
      'A quarter of treated water and more in some wards never reaches a bill. Leaks are found by complaints, repair takes days, and meter data is incomplete.'
    )
  }

  const handleSimulateDrafting = () => {
    setIsDrafting(true)
    setTimeout(() => {
      setIsDrafting(false)
      if (!title) setTitle('Cut water lost in ward supply networks')
      if (!context)
        setContext(
          problemText ||
            'A quarter of treated water and more in some wards never reaches a bill. Leaks are found by complaints, repair takes days, and meter data is incomplete.'
        )
    }, 800)
  }

  const qualityChecks = evaluateStatementQuality({
    context: context || problemText,
    baselineMetric,
    baselineValue,
    targetValue,
    budgetMinLakh,
    budgetMaxLakh,
    dataAvailable: dataAvailable ? dataAvailable.split(',') : [],
    constraints: constraints ? constraints.split(',') : [],
  })

  const allQualityPassed = qualityChecks.every((c) => c.passed)

  const handlePublish = async () => {
    const newId = `CH-0${Math.floor(Math.random() * 80) + 25}`
    const newChallenge = {
      id: newId,
      title: title || 'Cut water lost in ward supply networks',
      departmentId: 'dept-ud',
      ownerId: 'u-meera',
      sector,
      district,
      stage: 1,
      status: 'active' as const,
      context: context || problemText,
      baseline: { metric: baselineMetric, value: baselineValue, unit: baselineUnit },
      target: { metric: baselineMetric, value: targetValue, unit: baselineUnit, byDays },
      budgetBand: { minLakh: budgetMinLakh, maxLakh: budgetMaxLakh },
      dataAvailable: dataAvailable.split(',').map((s) => s.trim()),
      constraints: constraints.split(',').map((s) => s.trim()),
      callOpensOn: '2026-09-22',
      callClosesOn: '2026-10-22',
      rubricId: 'rubric-default',
      rulesetId: 'rules-default',
      createdAt: new Date().toISOString().split('T')[0],
    }

    await db.challenges.add(newChallenge)

    const events = await db.auditEvents.toArray()
    const ev = await createAuditEvent(events, {
      id: `aud-${Date.now()}`,
      entityType: 'challenge',
      entityId: newId,
      actorId: 'u-meera',
      actorName: 'Meera Kulkarni',
      action: 'CHALLENGE_PUBLISHED',
      payload: { title: newChallenge.title },
      at: new Date().toISOString(),
    })
    await db.auditEvents.add(ev as AuditEvent)

    navigate(`/app/challenges/${newId}?tab=overview`)
  }

  return (
    <div className="space-y-6" data-tour="challenge-builder">
      <div className="border-b border-[var(--line)] pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[var(--ink)]">
            Create New Challenge
          </h1>
          <p className="text-xs text-[var(--ink-2)] mt-0.5">
            Turn operational pain points into outcome-based problem statements
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-[var(--ink-3)]">
          <span>Step {step} of 5</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Form Pane */}
        <div className="space-y-6 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] p-6">
          {/* Step 1: Problem */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-base text-[var(--ink)]">
                  Step 1: Problem Description
                </h3>
                <button
                  onClick={handleUseSample}
                  className="text-xs text-[var(--primary)] font-semibold hover:underline cursor-pointer"
                >
                  Use sample problem
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--ink-2)]">Challenge Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cut water lost in ward supply networks"
                  className="w-full p-2.5 text-sm bg-[var(--sunken)] border border-[var(--line-strong)] rounded-[var(--radius-sm)] text-[var(--ink)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--ink-2)]">
                  Describe the operational problem in plain words
                </label>
                <textarea
                  rows={5}
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  placeholder="What is happening? What is the current operational impact?"
                  className="w-full p-2.5 text-sm bg-[var(--sunken)] border border-[var(--line-strong)] rounded-[var(--radius-sm)] text-[var(--ink)]"
                />
              </div>

              <button
                onClick={handleSimulateDrafting}
                disabled={isDrafting}
                className="w-full py-2.5 px-4 bg-[var(--primary-tint)] border border-[var(--primary)] text-[var(--primary-strong)] font-semibold text-xs rounded-[var(--radius-sm)] hover:bg-[var(--primary)] hover:text-white flex items-center justify-center space-x-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isDrafting ? 'Drafting problem statement...' : 'Draft problem statement (AI Assistant)'}</span>
              </button>
            </div>
          )}

          {/* Step 2: Outcome & Baseline */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-base text-[var(--ink)]">
                Step 2: Baseline & Target Outcome Metrics
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--ink-2)]">Baseline Metric Name</label>
                  <input
                    type="text"
                    value={baselineMetric}
                    onChange={(e) => setBaselineMetric(e.target.value)}
                    className="w-full p-2 bg-[var(--sunken)] border border-[var(--line-strong)] rounded text-sm text-[var(--ink)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--ink-2)]">Baseline Value</label>
                  <input
                    type="number"
                    value={baselineValue}
                    onChange={(e) => setBaselineValue(Number(e.target.value))}
                    className="w-full p-2 bg-[var(--sunken)] border border-[var(--line-strong)] rounded text-sm text-[var(--ink)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--ink-2)]">Target Metric Value</label>
                  <input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(Number(e.target.value))}
                    className="w-full p-2 bg-[var(--sunken)] border border-[var(--line-strong)] rounded text-sm text-[var(--ink)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--ink-2)]">Target Timeline (Days)</label>
                  <input
                    type="number"
                    value={byDays}
                    onChange={(e) => setByDays(Number(e.target.value))}
                    className="w-full p-2 bg-[var(--sunken)] border border-[var(--line-strong)] rounded text-sm text-[var(--ink)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Data & Constraints */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-base text-[var(--ink)]">
                Step 3: Data Available & Constraints
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--ink-2)]">Data Available (comma separated)</label>
                <input
                  type="text"
                  value={dataAvailable}
                  onChange={(e) => setDataAvailable(e.target.value)}
                  className="w-full p-2.5 bg-[var(--sunken)] border border-[var(--line-strong)] rounded text-sm text-[var(--ink)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--ink-2)]">Constraints (comma separated)</label>
                <input
                  type="text"
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  className="w-full p-2.5 bg-[var(--sunken)] border border-[var(--line-strong)] rounded text-sm text-[var(--ink)]"
                />
              </div>
            </div>
          )}

          {/* Step 4: Budget & Timeline */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-base text-[var(--ink)]">
                Step 4: Budget Band (Lakhs)
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--ink-2)]">Minimum Budget (₹ Lakh)</label>
                  <input
                    type="number"
                    value={budgetMinLakh}
                    onChange={(e) => setBudgetMinLakh(Number(e.target.value))}
                    className="w-full p-2.5 bg-[var(--sunken)] border border-[var(--line-strong)] rounded text-sm text-[var(--ink)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--ink-2)]">Maximum Budget (₹ Lakh)</label>
                  <input
                    type="number"
                    value={budgetMaxLakh}
                    onChange={(e) => setBudgetMaxLakh(Number(e.target.value))}
                    className="w-full p-2.5 bg-[var(--sunken)] border border-[var(--line-strong)] rounded text-sm text-[var(--ink)]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Publish */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-base text-[var(--ink)]">
                Step 5: Review & Stage 1 Gate Sign-off
              </h3>

              <div className="p-4 bg-[var(--sunken)] border border-[var(--line)] rounded-[var(--radius-sm)] space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-[var(--ink)]">
                  <input
                    type="checkbox"
                    checked={isApproved}
                    onChange={(e) => setIsApproved(e.target.checked)}
                    className="rounded text-[var(--primary)]"
                  />
                  <span>Approver sign-off on challenge file (Joint Director Meera Kulkarni)</span>
                </label>
              </div>

              <button
                disabled={!isApproved || !allQualityPassed}
                onClick={handlePublish}
                className={clsx(
                  'w-full py-3 px-4 font-semibold text-xs rounded-[var(--radius-sm)] flex items-center justify-center space-x-2 cursor-pointer transition-colors',
                  isApproved && allQualityPassed
                    ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)]'
                    : 'bg-[var(--sunken)] text-[var(--ink-3)] cursor-not-allowed border border-[var(--line)]'
                )}
              >
                <span>Publish Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between border-t border-[var(--line)] pt-4">
            <button
              disabled={step === 1}
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-1.5 text-xs font-semibold rounded border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--sunken)] disabled:opacity-40 cursor-pointer"
            >
              Back
            </button>
            <button
              disabled={step === 5}
              onClick={() => setStep((s) => s + 1)}
              className="px-4 py-1.5 text-xs font-semibold rounded bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)] disabled:opacity-40 cursor-pointer"
            >
              Next Step
            </button>
          </div>
        </div>

        {/* Right Live Preview & Quality Analysis Pane */}
        <div className="space-y-6">
          {/* Quality Panel */}
          <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
              <h4 className="font-heading font-semibold text-sm text-[var(--ink)]">
                Statement Quality Analysis
              </h4>
              <span
                className={clsx(
                  'px-2 py-0.5 text-[10px] font-bold rounded-full',
                  allQualityPassed ? 'bg-[var(--go-tint)] text-[var(--go)]' : 'bg-[var(--marker-tint)] text-[var(--ink)]'
                )}
              >
                {allQualityPassed ? 'Quality Gate Passed' : 'Action Needed'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {qualityChecks.map((q) => (
                <div key={q.id} className="flex items-start space-x-2">
                  {q.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-[var(--go)] shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[var(--stop)] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className={clsx('font-medium', q.passed ? 'text-[var(--ink)]' : 'text-[var(--stop)]')}>
                      {q.label}
                    </div>
                    {q.feedback && <div className="text-[11px] text-[var(--ink-2)] mt-0.5">{q.feedback}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Document Preview */}
          <DocumentView title={title || 'Cut water lost in ward supply networks'} version="0.1 (Draft)">
            <p className="italic text-sm text-[var(--ink-2)]">{context || problemText || 'Problem description preview...'}</p>

            <div className="my-4 p-4 rounded bg-[var(--sunken)] border border-[var(--line)] space-y-2 text-xs font-sans">
              <div><strong>Baseline:</strong> {baselineValue} {baselineUnit} ({baselineMetric})</div>
              <div><strong>Target:</strong> {targetValue} {baselineUnit} within {byDays} days</div>
              <div><strong>Budget Band:</strong> ₹{budgetMinLakh} to ₹{budgetMaxLakh} lakh</div>
            </div>
          </DocumentView>
        </div>
      </div>
    </div>
  )
}
