import React, { useCallback, useEffect, useState } from 'react'
import { KPIChart } from '@/components/KPIChart'
import { db } from '@/mock/db'
import type { Pilot, Challenge } from '@/mock/schema'
import { createDemoPilotFor, ensureDemoMilestones } from '@/mock/demoShortcuts'
import { Plus, Wand2 } from 'lucide-react'

interface PilotMonitoringTabProps {
  challenge: Challenge
}

export const PilotMonitoringTab: React.FC<PilotMonitoringTabProps> = ({ challenge }) => {
  const [pilot, setPilot] = useState<Pilot | null>(null)
  const [showLogModal, setShowLogModal] = useState(false)
  const [readingVal, setReadingVal] = useState<number>(31.0)
  const [readingNote, setReadingNote] = useState<string>('Routine telemetry verification')

  const loadPilot = useCallback(() => {
    db.pilots.where('challengeId').equals(challenge.id).first().then((p) => {
      if (p) setPilot(p)
    })
  }, [challenge.id])

  useEffect(() => {
    loadPilot()
  }, [loadPilot])

  // Refresh when demo controls mutate data underneath us
  useEffect(() => {
    const onChange = () => loadPilot()
    window.addEventListener('pilotbridge:data-changed', onChange)
    return () => window.removeEventListener('pilotbridge:data-changed', onChange)
  }, [loadPilot])

  const handleAddReading = async () => {
    if (!pilot) return
    const updatedKpis = [...pilot.kpis]
    updatedKpis[0].readings.push({
      date: '22 Sep',
      value: readingVal,
      note: readingNote,
    })

    await db.pilots.update(pilot.id, { kpis: updatedKpis })
    setShowLogModal(false)
    loadPilot()
  }

  const handleFillDemoShortcut = async () => {
    const p = await createDemoPilotFor(challenge)
    if (p) {
      await ensureDemoMilestones(p, challenge.budgetBand.maxLakh)
    }
    loadPilot()
    alert('Pilot and milestone schedule created from the demo template.')
  }

  if (!pilot) {
    return (
      <div className="p-6 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] text-xs text-[var(--ink-2)] space-y-4">
        <p>No active pilot agreement found for this challenge.</p>
        <button
          onClick={handleFillDemoShortcut}
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-semibold rounded-[var(--radius-sm)] hover:bg-[var(--primary-strong)] flex items-center space-x-1.5 cursor-pointer"
        >
          <Wand2 className="w-4 h-4" />
          <span>Fill with demo shortcut</span>
        </button>
      </div>
    )
  }

  const kpi1 = pilot.kpis[0]

  return (
    <div className="space-y-6">
      {/* Header Summary Strip */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-[var(--ink-3)] font-mono">PILOT PROTOCOL: {pilot.id}</div>
          <div className="font-heading font-bold text-base text-[var(--ink)] mt-0.5">
            Scope: {pilot.sites.join(', ')} ({pilot.durationDays} days)
          </div>
          <div className="text-xs text-[var(--ink-2)]">Started: {pilot.startDate} (Day 45 of 90)</div>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-semibold rounded-[var(--radius-sm)] hover:bg-[var(--primary-strong)] flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log reading</span>
        </button>
      </div>

      {/* KPI Chart Card */}
      {kpi1 && (
        <KPIChart
          title={kpi1.name}
          unit={kpi1.unit}
          baseline={kpi1.baseline}
          target={kpi1.target}
          dataPoints={kpi1.readings.map((r, i) => ({
            date: r.date,
            value: r.value,
            milestoneStageNumber: i === 2 ? 6 : i === 4 ? 7 : undefined,
            milestoneTitle: r.note,
          }))}
        />
      )}

      {/* Readings Log Table & Risks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Readings Table (2/3) */}
        <div className="lg:col-span-2 space-y-3 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] p-4">
          <h4 className="font-heading font-semibold text-sm text-[var(--ink)]">Logged KPI Readings</h4>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[var(--sunken)] border-b border-[var(--line)] text-[var(--ink-2)] font-heading">
                  <th className="p-2">Date</th>
                  <th className="p-2">Value ({kpi1?.unit})</th>
                  <th className="p-2">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {kpi1?.readings.map((r, i) => (
                  <tr key={i}>
                    <td className="p-2 font-medium text-[var(--ink)]">{r.date}</td>
                    <td className="p-2 font-bold text-[var(--primary)]">{r.value}</td>
                    <td className="p-2 text-[var(--ink-2)]">{r.note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Register (1/3) */}
        <div className="space-y-3 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] p-4">
          <h4 className="font-heading font-semibold text-sm text-[var(--ink)]">Risk Register</h4>

          <div className="space-y-2 text-xs">
            {pilot.risks.map((r) => (
              <div key={r.id} className="p-2.5 rounded bg-[var(--sunken)] border border-[var(--line)] space-y-1">
                <div className="flex items-center justify-between font-semibold text-[var(--ink)]">
                  <span>{r.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--marker-tint)] text-[var(--ink)]">
                    L{r.likelihood} / I{r.impact}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--ink-2)]">Owner: {r.owner}</div>
                <div className="text-[11px] text-[var(--ink-3)] italic">{r.mitigation}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Log Reading Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] max-w-sm w-full rounded-[var(--radius-lg)] p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading font-bold text-base text-[var(--ink)]">Log New KPI Reading</h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[var(--ink-2)]">Non-revenue water % Reading</label>
                <input
                  type="number"
                  step="0.1"
                  value={readingVal}
                  onChange={(e) => setReadingVal(Number(e.target.value))}
                  className="w-full p-2 bg-[var(--sunken)] border border-[var(--line)] rounded text-[var(--ink)] font-bold font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[var(--ink-2)]">Reading Note</label>
                <input
                  type="text"
                  value={readingNote}
                  onChange={(e) => setReadingNote(e.target.value)}
                  className="w-full p-2 bg-[var(--sunken)] border border-[var(--line)] rounded text-[var(--ink)]"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowLogModal(false)}
                className="flex-1 py-2 text-xs font-semibold rounded border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--sunken)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReading}
                className="flex-1 py-2 text-xs font-semibold rounded bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)] cursor-pointer"
              >
                Save Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
