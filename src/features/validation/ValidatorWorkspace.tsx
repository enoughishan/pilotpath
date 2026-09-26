import React, { useState } from 'react'
import { DocumentView } from '@/components/DocumentView'
import { db } from '@/mock/db'
import type { AuditEvent } from '@/mock/schema'
import { createAuditEvent } from '@/logic/auditChain'
import { CheckCircle2, Lock, PenTool } from 'lucide-react'
import { clsx } from 'clsx'

export const ValidatorWorkspace: React.FC = () => {
  const [method, setMethod] = useState<string>('Independent physical audit and telemetry verification')
  const [findings, setFindings] = useState<string>(
    'The calibrated optical sensor grid logged continuous PM2.5 and PM10 telemetry across all ten industrial-zone sites. Verification confirms sensor density rose from 1 per sq km baseline to 8.4 per sq km by Day 45.'
  )
  const [verdict, setVerdict] = useState<'pass' | 'partial' | 'fail'>('pass')
  const [validatorName, setValidatorName] = useState<string>('Prof. Nandini Bose')
  const [declarationChecked, setDeclarationChecked] = useState<boolean>(false)
  const [isSigned, setIsSigned] = useState<boolean>(false)

  const handleSignReport = async () => {
    if (!declarationChecked || !validatorName) return

    setIsSigned(true)

    const events = await db.auditEvents.toArray()
    const ev = await createAuditEvent(events, {
      id: `aud-${Date.now()}`,
      entityType: 'validation',
      entityId: 'val-008',
      actorId: 'u-nandini',
      actorName: validatorName,
      action: 'VALIDATION_REPORT_SIGNED',
      payload: { verdict, method },
      at: new Date().toISOString(),
    })
    await db.auditEvents.add(ev as AuditEvent)

    alert('Validation report signed and locked. Audit entry recorded.')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
        <div>
          <div className="text-xs text-[var(--ink-3)] font-mono">INDEPENDENT VALIDATION WORKSPACE</div>
          <h1 className="text-2xl font-bold font-heading text-[var(--ink)] mt-0.5">
            Validation Assignment: CH-008 Air-quality Hotspot Mapping
          </h1>
        </div>

        {isSigned && (
          <span className="px-3 py-1 rounded-full bg-[var(--go-tint)] text-[var(--go)] font-bold text-xs flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Report Signed & Locked</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Telemetry Summary */}
        <DocumentView title="Pilot Evidence Summary: CH-008 Industrial Zone Sensor Grid">
          <p>
            Independent testing laboratory evaluation by State Engineering College Test Lab for Urban Development Department.
          </p>
          <div className="my-4 p-3 bg-[var(--sunken)] rounded border border-[var(--line)] text-xs space-y-1 font-mono">
            <div>Baseline Sensor Density: 1 per sq km</div>
            <div>Day 45 Sensor Density: 8.4 per sq km</div>
            <div>Target: 10 per sq km by Day 90</div>
            <div>Readings Logged Cadence: 94%</div>
          </div>
        </DocumentView>

        {/* Right Validation Form */}
        <div className="space-y-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] p-6">
          <h3 className="font-heading font-semibold text-base text-[var(--ink)]">
            Independent Audit Report
          </h3>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-[var(--ink-2)]">Verification Method</label>
              <input
                type="text"
                disabled={isSigned}
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full p-2 bg-[var(--sunken)] border border-[var(--line)] rounded text-[var(--ink)]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[var(--ink-2)]">Detailed Findings</label>
              <textarea
                rows={4}
                disabled={isSigned}
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                className="w-full p-2 bg-[var(--sunken)] border border-[var(--line)] rounded text-[var(--ink)]"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-[var(--ink-2)] block">Final Validation Verdict</label>
              <div className="space-y-2">
                {[
                  { value: 'pass', label: 'Pass (Moves pilot to scale-up decision)', tone: 'text-[var(--go)]' },
                  { value: 'partial', label: 'Partial Pass (Requires pilot scope extension)', tone: 'text-[var(--marker)]' },
                  { value: 'fail', label: 'Fail (Pilot targets unmet)', tone: 'text-[var(--stop)]' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center space-x-2 cursor-pointer font-semibold">
                    <input
                      type="radio"
                      name="verdict"
                      disabled={isSigned}
                      checked={verdict === opt.value}
                      onChange={() => setVerdict(opt.value as 'pass' | 'partial' | 'fail')}
                      className="accent-[var(--primary)]"
                    />
                    <span className={opt.tone}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {!isSigned ? (
              <div className="pt-4 border-t border-[var(--line)] space-y-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[var(--ink-2)]">Validator Full Name (e-Sign)</label>
                  <input
                    type="text"
                    value={validatorName}
                    onChange={(e) => setValidatorName(e.target.value)}
                    className="w-full p-2 bg-[var(--sunken)] border border-[var(--line)] rounded text-[var(--ink)] font-semibold"
                  />
                </div>

                <label className="flex items-start space-x-2 cursor-pointer text-[11px] text-[var(--ink-2)]">
                  <input
                    type="checkbox"
                    checked={declarationChecked}
                    onChange={(e) => setDeclarationChecked(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    I confirm this independent validation report reflects accurate physical lab and telemetry test findings.
                  </span>
                </label>

                <button
                  disabled={!declarationChecked || !validatorName}
                  onClick={handleSignReport}
                  className={clsx(
                    'w-full py-2.5 px-4 font-semibold text-xs rounded flex items-center justify-center space-x-2 cursor-pointer transition-colors',
                    declarationChecked && validatorName
                      ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)]'
                      : 'bg-[var(--sunken)] text-[var(--ink-3)] border border-[var(--line)] cursor-not-allowed'
                  )}
                >
                  <PenTool className="w-4 h-4" />
                  <span>Sign Report & Lock</span>
                </button>
              </div>
            ) : (
              <div className="p-3 bg-[var(--sunken)] border border-[var(--line)] rounded text-xs text-[var(--ink-2)] flex items-center space-x-2">
                <Lock className="w-4 h-4 text-[var(--ink-3)]" />
                <span>Signed by {validatorName} on {new Date().toLocaleDateString()}. Report is immutable.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
