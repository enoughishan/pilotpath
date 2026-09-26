import React, { useCallback, useEffect, useState } from 'react'
import { DocumentView } from '@/components/DocumentView'
import { Stone } from '@/components/Stone'
import { allocate, formatInr } from '@/logic/money'
import { db } from '@/mock/db'
import type { Milestone, Challenge, AuditEvent } from '@/mock/schema'
import { createAuditEvent } from '@/logic/auditChain'
import { ensureDemoMilestones } from '@/mock/demoShortcuts'
import { CheckCircle2, Download, AlertOctagon, Wand2 } from 'lucide-react'
import { clsx } from 'clsx'

interface ContractMilestonesTabProps {
  challenge: Challenge
}

export const ContractMilestonesTab: React.FC<ContractMilestonesTabProps> = ({ challenge }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [contractValueInr, setContractValueInr] = useState<number>(4800000)
  const [deptAccepted, setDeptAccepted] = useState<boolean>(false)
  const [startupAccepted, setStartupAccepted] = useState<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)

  const pilotId = `pilot-${challenge.id.slice(3)}`

  const loadMilestones = useCallback(() => {
    const targetPilotId = `pilot-${challenge.id.slice(3)}`
    Promise.all([
      db.milestones.where('pilotId').equals(targetPilotId).toArray(),
      db.auditEvents.where('entityId').equals(targetPilotId).toArray(),
    ]).then(([list, events]) => {
      setMilestones(list)
      if (list.length > 0) {
        setContractValueInr(list.reduce((sum, m) => sum + m.amountInr, 0))
      }
      setStartupAccepted(
        events.some(
          (e) =>
            e.action === 'PILOT_AGREEMENT_ACCEPTED' ||
            (e.action === 'CONTRACT_ACCEPTED' && (e.payload as { by?: string })?.by === 'startup')
        )
      )
      setDeptAccepted(
        events.some((e) => e.action === 'CONTRACT_ACCEPTED' && (e.payload as { by?: string })?.by === 'department')
      )
      setLoaded(true)
    })
  }, [challenge.id])

  useEffect(() => {
    loadMilestones()
  }, [loadMilestones])

  // Refresh when demo controls mutate data underneath us
  useEffect(() => {
    const onChange = () => loadMilestones()
    window.addEventListener('pilotbridge:data-changed', onChange)
    return () => window.removeEventListener('pilotbridge:data-changed', onChange)
  }, [loadMilestones])

  const handleAcceptDepartment = async () => {
    const events = await db.auditEvents.toArray()
    const ev = await createAuditEvent(events, {
      id: `aud-${Date.now()}`,
      entityType: 'contract',
      entityId: pilotId,
      actorId: 'u-meera',
      actorName: 'Meera Kulkarni',
      action: 'CONTRACT_ACCEPTED',
      payload: { by: 'department' },
      at: new Date().toISOString(),
    })
    await db.auditEvents.add(ev as AuditEvent)
    window.dispatchEvent(new CustomEvent('pilotbridge:data-changed'))
    loadMilestones()
    alert('Contract accepted on behalf of the department.')
  }

  const handleFillMilestones = async () => {
    const pilot = await db.pilots.where('challengeId').equals(challenge.id).first()
    if (!pilot) {
      alert('No pilot found for this challenge. Fill the Pilot tab first.')
      return
    }
    await ensureDemoMilestones(pilot, challenge.budgetBand.maxLakh)
    loadMilestones()
    alert('Milestone schedule created from the demo template.')
  }

  const totalPercent = milestones.reduce((sum, m) => sum + m.percent, 0)
  const isHundredPercent = Math.abs(totalPercent - 100) < 0.01

  const handlePercentChange = (index: number, newPct: number) => {
    const updated = [...milestones]
    updated[index].percent = newPct

    const percents = updated.map((m) => m.percent)
    const allocatedAmounts = allocate(contractValueInr, percents)
    updated.forEach((m, i) => {
      m.amountInr = allocatedAmounts[i]
    })

    setMilestones(updated)
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div>
          <span className="text-[var(--ink-3)] block font-mono">CONTRACT VALUE</span>
          <span className="font-heading font-bold text-lg text-[var(--ink)]">
            {formatInr(contractValueInr)}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {deptAccepted ? (
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--go)]" />
              <span className="font-semibold text-[var(--ink)]">Department Accepted</span>
            </div>
          ) : (
            <button
              onClick={handleAcceptDepartment}
              className="px-3 py-1.5 bg-[var(--go)] text-white font-semibold rounded-[var(--radius-sm)] hover:opacity-90 flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Accept on behalf of department</span>
            </button>
          )}
          {startupAccepted ? (
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-[var(--go)]" />
              <span className="font-semibold text-[var(--ink)]">Startup Accepted</span>
            </div>
          ) : (
            <span className="text-[var(--ink-3)] font-medium">Startup acceptance pending (Startup Portal)</span>
          )}
          <button
            onClick={() => alert('Agreement PDF download initiated (simulated @react-pdf/renderer)')}
            className="px-3 py-1.5 bg-[var(--primary)] text-white font-semibold rounded-[var(--radius-sm)] hover:bg-[var(--primary-strong)] flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download agreement (PDF)</span>
          </button>
        </div>
      </div>

      {!isHundredPercent && (
        <div className="p-3 bg-[var(--stop-tint)] border border-[var(--stop)] rounded-[var(--radius-sm)] text-xs text-[var(--stop)] flex items-center space-x-2 font-semibold">
          <AlertOctagon className="w-4 h-4 shrink-0" />
          <span>Milestones add up to {totalPercent}%. Change amounts so they total 100%.</span>
        </div>
      )}

      {/* Two Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Document View */}
        <DocumentView title={`Pilot Agreement: ${challenge.title}`} version="1.0">
          <p>
            This Agreement is made on 8 August 2026 between the Urban Development Department, Ranipur Municipal Corporation ("Department"), and Aquavrit Systems ("Startup").
          </p>
          <p>
            The Startup agrees to execute the Water Loss Reduction pilot across Wards 7, 12, and 19 for a total consideration of {formatInr(contractValueInr)}.
          </p>

          <h4 className="font-bold text-sm mt-4">Section 1: Milestone Structure</h4>
          <p className="text-xs text-[var(--ink-2)]">
            Payments are strictly tied to verified evidence submission and KPI target completion per schedule.
          </p>
        </DocumentView>

        {/* Right Milestone Builder */}
        <div className="space-y-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] p-6">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <h3 className="font-heading font-semibold text-base text-[var(--ink)]">
              Milestone Allocation & Evidence
            </h3>
            <span
              className={clsx(
                'px-2 py-0.5 text-xs font-bold rounded-full',
                isHundredPercent ? 'bg-[var(--go-tint)] text-[var(--go)]' : 'bg-[var(--stop-tint)] text-[var(--stop)]'
              )}
            >
              Total: {totalPercent}%
            </span>
          </div>

          {loaded && milestones.length === 0 && (
            <button
              onClick={handleFillMilestones}
              className="w-full px-4 py-2 bg-[var(--primary-tint)] text-[var(--primary-strong)] border border-[var(--primary)] text-xs font-semibold rounded-[var(--radius-sm)] flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>Fill milestone schedule (demo shortcut)</span>
            </button>
          )}

          <div className="space-y-4">
            {milestones.map((m, idx) => (
              <div
                key={m.id}
                className="p-3 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--sunken)] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Stone stageNumber={idx + 1} size={20} status={m.status === 'released' ? 'done' : 'upcoming'} />
                    <span className="font-bold text-[var(--ink)]">{m.title}</span>
                  </div>
                  <span className="font-mono font-bold text-[var(--primary)]">{formatInr(m.amountInr)}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10px] text-[var(--ink-3)] block">Percent Allocation (%)</label>
                    <input
                      type="number"
                      value={m.percent}
                      onChange={(e) => handlePercentChange(idx, Number(e.target.value))}
                      className="w-full p-1.5 bg-[var(--surface)] border border-[var(--line)] rounded text-xs text-[var(--ink)] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--ink-3)] block">Due Date</label>
                    <input
                      type="date"
                      value={m.dueDate}
                      readOnly
                      className="w-full p-1.5 bg-[var(--surface)] border border-[var(--line)] rounded text-xs text-[var(--ink-2)]"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-[var(--ink-2)] pt-1 border-t border-[var(--line)]">
                  <strong>Required Evidence:</strong> {m.evidenceRequired.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
