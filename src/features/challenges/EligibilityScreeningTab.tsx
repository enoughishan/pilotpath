import React, { useEffect, useState } from 'react'
import { evaluateEligibility } from '@/logic/rules'
import type { EligibilityRule } from '@/logic/rules'
import { db } from '@/mock/db'
import type { Startup, Application, Challenge, AuditEvent } from '@/mock/schema'
import { createAuditEvent } from '@/logic/auditChain'
import { CheckCircle2, XCircle, AlertCircle, ShieldCheck, Sliders, ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'

interface EligibilityScreeningTabProps {
  challenge?: Challenge
}

export const EligibilityScreeningTab: React.FC<EligibilityScreeningTabProps> = ({ challenge }) => {
  const [rows, setRows] = useState<{ startup: Startup; application: Application }[]>([])
  const [turnoverThresholdCr, setTurnoverThresholdCr] = useState<number>(3)
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set())
  const [saved, setSaved] = useState<boolean>(false)

  useEffect(() => {
    let active = true
    if (challenge) {
      db.applications.where('challengeId').equals(challenge.id).toArray().then(async (apps) => {
        if (!active) return
        const alreadyShortlisted = new Set(apps.filter((a) => a.shortlisted).map((a) => a.startupId))
        const startups = await db.startups.bulkGet(apps.map((a) => a.startupId))
        if (!active) return
        const list = apps
          .map((a, i) => ({ startup: startups[i], application: a }))
          .filter((r): r is { startup: Startup; application: Application } => Boolean(r.startup))
        setRows(list.slice(0, 12))
        setShortlistedIds(
          alreadyShortlisted.size > 0 ? alreadyShortlisted : new Set(list.map((r) => r.startup.id))
        )
        setSaved(alreadyShortlisted.size > 0)
      })
    }
    return () => {
      active = false
    }
  }, [challenge])

  const toggleShortlist = (id: string) => {
    setShortlistedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const saveAuditEvent = async (action: string, payload: Record<string, unknown>) => {
    if (!challenge) return
    const events = await db.auditEvents.toArray()
    const ev = await createAuditEvent(events, {
      id: `aud-${Date.now()}`,
      entityType: 'challenge',
      entityId: challenge.id,
      actorId: 'u-meera',
      actorName: 'Meera Kulkarni',
      action,
      payload,
      at: new Date().toISOString(),
    })
    await db.auditEvents.add(ev as AuditEvent)
  }

  const handleSaveShortlist = async () => {
    if (!challenge) return
    const ids = [...shortlistedIds]
    await Promise.all(
      rows.map((r) =>
        db.applications.update(r.application.id, { shortlisted: ids.includes(r.startup.id) })
      )
    )
    await saveAuditEvent('STARTUPS_SHORTLISTED', { count: ids.length })
    setSaved(true)
    window.dispatchEvent(new CustomEvent('pilotbridge:data-changed'))
    alert('Shortlist saved for evaluation stage.')
  }

  const handleAdvanceToEvaluation = async () => {
    if (!challenge) return
    await db.challenges.update(challenge.id, { stage: 4 })
    await saveAuditEvent('STAGE_ADVANCED', { fromStage: 3, toStage: 4 })
    window.dispatchEvent(new CustomEvent('pilotbridge:data-changed'))
    alert('Advanced to Stage 4 (Evaluation).')
  }

  // Active ruleset
  const activeRules: EligibilityRule[] = [
    {
      id: 'r1',
      label: 'Registered Entity',
      field: 'registeredEntity',
      op: '==',
      value: true,
      required: true,
      relaxableForStartups: false,
    },
    {
      id: 'r2',
      label: 'DPIIT Status',
      field: 'dpiitRecognised',
      op: '==',
      value: true,
      required: false,
      relaxableForStartups: true,
      relaxationCondition: 'Relaxed for 10-year incorporated entities',
    },
    {
      id: 'r3',
      label: 'Turnover Requirement',
      field: 'turnoverValCr',
      op: '>=',
      value: turnoverThresholdCr,
      required: false,
      relaxableForStartups: true,
      relaxationCondition: 'Waived for DPIIT recognised startups',
    },
  ]

  // Compute eligibility results live
  const screeningResults = rows.map(({ startup: s }) => {
    const sData = {
      registeredEntity: true,
      dpiitRecognised: s.dpiitRecognised,
      turnoverValCr: s.turnoverBandCr.includes('5-10') ? 6 : s.turnoverBandCr.includes('1-5') ? 2 : 0.5,
    }
    const result = evaluateEligibility(activeRules, sData, s.dpiitRecognised)
    return {
      startup: s,
      result,
    }
  })

  const eligibleCount = screeningResults.filter((r) => r.result.overall === 'eligible').length
  const relaxedCount = screeningResults.filter((r) => r.result.overall === 'eligible_with_relaxation').length
  const failCount = screeningResults.filter((r) => r.result.overall === 'not_eligible').length

  if (!challenge) {
    return (
      <div className="p-6 text-center text-sm text-[var(--ink-2)] bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)]">
        Open a challenge to screen its applications.
      </div>
    )
  }

  return (
    <div className="space-y-6" data-tour="screening-rules">
      {/* Rules Banner */}
      <div className="p-3 bg-[var(--marker-tint)] border border-[var(--marker)] rounded-[var(--radius-sm)] text-xs text-[var(--ink)] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-[var(--ink)] shrink-0" />
          <span>
            Sample thresholds. Confirm against your current procurement rules before use. Active ruleset v3.
          </span>
        </div>
        <button className="text-[var(--primary-strong)] font-semibold hover:underline cursor-pointer">
          View rules used (v3)
        </button>
      </div>

      {/* Summary Sentence & What-if Slider */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm font-semibold text-[var(--ink)]">
            Summary: {eligibleCount} eligible, {relaxedCount} eligible with relaxation, {failCount} not eligible.
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSaveShortlist}
              disabled={shortlistedIds.size === 0}
              className={clsx(
                'px-4 py-2 text-xs font-semibold rounded-[var(--radius-sm)] transition-colors',
                shortlistedIds.size === 0
                  ? 'bg-[var(--sunken)] text-[var(--ink-3)] cursor-not-allowed'
                  : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)] cursor-pointer'
              )}
            >
              {saved ? `Update shortlist (${shortlistedIds.size})` : `Shortlist ${shortlistedIds.size} startups`}
            </button>
            {saved && shortlistedIds.size > 0 && challenge.stage === 3 && (
              <button
                onClick={handleAdvanceToEvaluation}
                className="px-4 py-2 bg-[var(--go)] text-white text-xs font-semibold rounded-[var(--radius-sm)] hover:opacity-90 flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Advance to Evaluation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* What-if Slider */}
        <div className="pt-3 border-t border-[var(--line)] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[var(--ink-2)] flex items-center space-x-1">
              <Sliders className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>What-if Simulator: Prior Turnover Requirement Threshold</span>
            </span>
            <span className="font-bold font-mono text-[var(--primary)]">₹{turnoverThresholdCr} crore</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={turnoverThresholdCr}
            onChange={(e) => setTurnoverThresholdCr(Number(e.target.value))}
            className="w-full accent-[var(--primary)] cursor-pointer"
          />
        </div>
      </div>

      {/* Eligibility Results Table */}
      <div className="overflow-x-auto border border-[var(--line)] rounded-[var(--radius-md)] bg-[var(--surface)]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[var(--sunken)] border-b border-[var(--line)] text-[var(--ink-2)] font-heading">
              <th className="p-3">Startup</th>
              <th className="p-3">Registered Entity</th>
              <th className="p-3">DPIIT Status</th>
              <th className="p-3">Turnover (₹{turnoverThresholdCr} Cr)</th>
              <th className="p-3 text-right">Overall Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {screeningResults.map(({ startup, result }) => {
              const r2 = result.ruleResults[1]
              const r3 = result.ruleResults[2]

              return (
                <tr key={startup.id} className="hover:bg-[var(--sunken)] transition-colors">
                  <td className="p-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shortlistedIds.has(startup.id)}
                        onChange={() => toggleShortlist(startup.id)}
                        className="accent-[var(--primary)] w-4 h-4 cursor-pointer"
                        aria-label={`Shortlist ${startup.name}`}
                      />
                      <span className="font-semibold text-[var(--ink)]">
                        <span className="block">{startup.name}</span>
                        <span className="block text-[10px] text-[var(--ink-3)] font-normal">
                          {startup.turnoverBandCr}
                        </span>
                      </span>
                    </label>
                  </td>

                  <td className="p-3">
                    <span className="inline-flex items-center space-x-1 text-[var(--go)]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Pass</span>
                    </span>
                  </td>

                  <td className="p-3">
                    {r2.status === 'pass' ? (
                      <span className="inline-flex items-center space-x-1 text-[var(--go)]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pass</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[var(--ink-3)]">
                        <span>Standard</span>
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    {r3.status === 'pass' && (
                      <span className="inline-flex items-center space-x-1 text-[var(--go)] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pass</span>
                      </span>
                    )}
                    {r3.status === 'pass_by_relaxation' && (
                      <span className="inline-flex items-center space-x-1 text-[var(--primary)] font-semibold" title={r3.reason}>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Relaxed</span>
                      </span>
                    )}
                    {r3.status === 'fail' && (
                      <span className="inline-flex items-center space-x-1 text-[var(--stop)] font-semibold" title={r3.reason}>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Fail</span>
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-right">
                    {result.overall === 'eligible' && (
                      <span className="px-2.5 py-1 rounded-full bg-[var(--go-tint)] text-[var(--go)] font-bold">
                        Eligible
                      </span>
                    )}
                    {result.overall === 'eligible_with_relaxation' && (
                      <span className="px-2.5 py-1 rounded-full bg-[var(--primary-tint)] text-[var(--primary-strong)] font-bold">
                        Eligible (Relaxed)
                      </span>
                    )}
                    {result.overall === 'not_eligible' && (
                      <span className="px-2.5 py-1 rounded-full bg-[var(--stop-tint)] text-[var(--stop)] font-bold">
                        Not Eligible
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
