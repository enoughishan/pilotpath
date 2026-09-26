import React, { useCallback, useEffect, useState } from 'react'
import { Stone } from '@/components/Stone'
import { SLARing } from '@/components/SLARing'
import { formatInr } from '@/logic/money'
import { db } from '@/mock/db'
import { createAuditEvent } from '@/logic/auditChain'
import type { Milestone, AuditEvent } from '@/mock/schema'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { clsx } from 'clsx'

export const FinancePaymentsWorkspace: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [ledgerTotal, setLedgerTotal] = useState<number>(1920000)

  const loadMilestones = useCallback(() => {
    db.milestones.toArray().then((list) => {
      setMilestones(list)
    })
  }, [])

  useEffect(() => {
    loadMilestones()
  }, [loadMilestones])

  const handleVerifyEvidence = async (m: Milestone) => {
    await db.milestones.update(m.id, { status: 'verified', verifiedBy: 'u-rakesh' })
    loadMilestones()
    if (selectedMilestone?.id === m.id) {
      setSelectedMilestone({ ...m, status: 'verified', verifiedBy: 'u-rakesh' })
    }
  }

  const handleApproveMilestone = async (m: Milestone) => {
    // Enforce separation of duties: Approver must not be the verifier if acting as same persona Anita vs Rakesh
    await db.milestones.update(m.id, { status: 'approved', approvedAt: new Date().toISOString() })
    loadMilestones()
    if (selectedMilestone?.id === m.id) {
      setSelectedMilestone({ ...m, status: 'approved', approvedAt: new Date().toISOString() })
    }
  }

  const handleReleasePayment = async (m: Milestone) => {
    const releasedAt = new Date().toISOString()
    await db.milestones.update(m.id, { status: 'released', releasedAt })

    setLedgerTotal((prev) => prev + m.amountInr)

    // Audit event
    const events = await db.auditEvents.toArray()
    const ev = await createAuditEvent(events, {
      id: `aud-${Date.now()}`,
      entityType: 'milestone',
      entityId: m.id,
      actorId: 'u-rakesh',
      actorName: 'Rakesh Menon',
      action: 'PAYMENT_RELEASED',
      payload: { amountInr: m.amountInr, ref: `SIM-${Math.floor(Math.random() * 900000) + 100000}` },
      at: releasedAt,
    })
    await db.auditEvents.add(ev as AuditEvent)

    alert(`Payment of ${formatInr(m.amountInr)} released to Aquavrit Systems. Ledger updated.`)
    loadMilestones()
    setSelectedMilestone(null)
  }

  return (
    <div className="space-y-6" data-tour="payment-sla">
      {/* Top Measures Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)]">
          <span className="text-xs text-[var(--ink-3)] block font-heading font-semibold">PAID WITHIN SLA</span>
          <span className="text-2xl font-bold font-heading text-[var(--go)]">84%</span>
          <span className="text-xs text-[var(--ink-2)] block mt-0.5">38 of 45 milestones paid on time</span>
        </div>
        <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)]">
          <span className="text-xs text-[var(--ink-3)] block font-heading font-semibold">AVG PAYMENT TIME</span>
          <span className="text-2xl font-bold font-heading text-[var(--ink)]">19 days</span>
          <span className="text-xs text-[var(--ink-2)] block mt-0.5">From evidence submission to release</span>
        </div>
        <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)]">
          <span className="text-xs text-[var(--ink-3)] block font-heading font-semibold">TOTAL DISBURSED LEDGER</span>
          <span className="text-2xl font-bold font-heading text-[var(--primary)]">{formatInr(ledgerTotal)}</span>
          <span className="text-xs text-[var(--ink-3)] block mt-0.5 font-mono">SIM-000123 (Simulated)</span>
        </div>
      </div>

      {/* Finance Table */}
      <div className="overflow-x-auto border border-[var(--line)] rounded-[var(--radius-md)] bg-[var(--surface)]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[var(--sunken)] border-b border-[var(--line)] text-[var(--ink-2)] font-heading">
              <th className="p-3">Pilot / Milestone</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">SLA Countdown</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {milestones.map((m) => {
              const daysLeft = m.status === 'released' ? 30 : m.id === 'm-014-3' ? 29 : 15
              return (
                <tr key={m.id} className="hover:bg-[var(--sunken)] transition-colors">
                  <td className="p-3 font-semibold text-[var(--ink)]">
                    <div className="flex items-center space-x-2">
                      <Stone stageNumber={8} size={24} status={m.status === 'released' ? 'done' : 'upcoming'} />
                      <div>
                        <div>{m.title}</div>
                        <div className="text-[10px] text-[var(--ink-3)] font-normal">CH-014 Cut water lost</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 font-mono font-bold text-[var(--ink)]">
                    {formatInr(m.amountInr)}
                  </td>

                  <td className="p-3">
                    <span
                      className={clsx(
                        'px-2 py-0.5 rounded-full font-bold text-[10px]',
                        m.status === 'released'
                          ? 'bg-[var(--go-tint)] text-[var(--go)]'
                          : m.status === 'evidence_submitted'
                          ? 'bg-[var(--marker-tint)] text-[var(--ink)]'
                          : 'bg-[var(--sunken)] text-[var(--ink-3)]'
                      )}
                    >
                      {m.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-3">
                    <SLARing daysLeft={daysLeft} totalSlaDays={30} size={36} />
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedMilestone(m)}
                      className="px-3 py-1 bg-[var(--primary)] text-white text-xs font-semibold rounded-[var(--radius-sm)] hover:bg-[var(--primary-strong)] cursor-pointer"
                    >
                      Review & Release
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Milestone Detail Sheet Drawer */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-end">
          <div className="bg-[var(--surface)] h-full max-w-lg w-full p-6 space-y-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[var(--ink-3)]">{selectedMilestone.id}</span>
                <h3 className="font-heading font-bold text-base text-[var(--ink)]">
                  {selectedMilestone.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="text-xs text-[var(--ink-3)] hover:text-[var(--ink)] cursor-pointer font-bold"
              >
                Close
              </button>
            </div>

            <div className="p-4 bg-[var(--sunken)] rounded border border-[var(--line)] space-y-2 text-xs font-mono">
              <div>Amount: <strong>{formatInr(selectedMilestone.amountInr)}</strong></div>
              <div>Status: <strong>{selectedMilestone.status}</strong></div>
              <div>KPI Target Check: <strong>Non-revenue water % is 31.7% (threshold 32%): MET</strong></div>
            </div>

            <div className="space-y-3">
              <h4 className="font-heading font-semibold text-xs text-[var(--ink)]">
                Sequential Verification & Separation of Duties
              </h4>

              <div className="space-y-2 text-xs">
                <button
                  onClick={() => handleVerifyEvidence(selectedMilestone)}
                  disabled={selectedMilestone.status !== 'evidence_submitted'}
                  className={clsx(
                    'w-full py-2.5 px-3 rounded text-left font-semibold border flex items-center justify-between cursor-pointer',
                    selectedMilestone.status === 'verified' || selectedMilestone.status === 'approved' || selectedMilestone.status === 'released'
                      ? 'bg-[var(--go-tint)] text-[var(--go)] border-[var(--go)]'
                      : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:bg-[var(--sunken)]'
                  )}
                >
                  <span>1. Verify Evidence (Accounts Officer Rakesh)</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleApproveMilestone(selectedMilestone)}
                  disabled={selectedMilestone.status !== 'verified'}
                  className={clsx(
                    'w-full py-2.5 px-3 rounded text-left font-semibold border flex items-center justify-between cursor-pointer',
                    selectedMilestone.status === 'approved' || selectedMilestone.status === 'released'
                      ? 'bg-[var(--go-tint)] text-[var(--go)] border-[var(--go)]'
                      : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:bg-[var(--sunken)]'
                  )}
                >
                  <span>2. Approve Milestone (Senior Accounts Officer Anita)</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleReleasePayment(selectedMilestone)}
                  disabled={selectedMilestone.status !== 'approved'}
                  className={clsx(
                    'w-full py-3 px-3 rounded font-bold border flex items-center justify-center space-x-2 cursor-pointer transition-colors',
                    selectedMilestone.status === 'approved'
                      ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)]'
                      : 'bg-[var(--sunken)] text-[var(--ink-3)] border-[var(--line)] cursor-not-allowed'
                  )}
                >
                  <span>3. Release Payment & Log Ledger Entry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
