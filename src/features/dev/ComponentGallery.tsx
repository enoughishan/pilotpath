import React, { useState } from 'react'
import { Stone } from '@/components/Stone'
import { Pathway } from '@/components/Pathway'
import type { PathwayStage } from '@/components/Pathway'
import { SLARing } from '@/components/SLARing'
import { ScoreMatrix } from '@/components/ScoreMatrix'
import { KPIChart } from '@/components/KPIChart'
import { GateChecklist } from '@/components/GateChecklist'
import { AuditTrail } from '@/components/AuditTrail'
import { DocumentView } from '@/components/DocumentView'

export const ComponentGallery: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
  }

  const sampleStages: PathwayStage[] = [
    { id: 1, name: 'Challenge', count: 2, status: 'done' },
    { id: 2, name: 'Discovery', count: 1, status: 'done' },
    { id: 3, name: 'Screening', count: 1, status: 'done' },
    { id: 4, name: 'Evaluation', count: 2, status: 'done' },
    { id: 5, name: 'Pilot design', count: 1, status: 'done' },
    { id: 6, name: 'Contract', count: 1, status: 'done' },
    { id: 7, name: 'Monitoring', count: 2, status: 'current', sublabel: 'Day 45' },
    { id: 8, name: 'Payment', count: 1, status: 'upcoming' },
    { id: 9, name: 'Validation', count: 1, status: 'upcoming' },
    { id: 10, name: 'Scale-up', count: 2, status: 'upcoming' },
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-[var(--ink)]">
            Pilot Bridge Component Gallery & Design System
          </h1>
          <p className="text-[var(--ink-2)] text-sm mt-1">
            Design tokens, signature components, typography, and theme validation (/dev/components)
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 text-sm font-semibold rounded-[var(--radius-sm)] border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--sunken)] cursor-pointer"
        >
          Theme: {theme.toUpperCase()}
        </button>
      </div>

      {/* Signature Component: Stone */}
      <section className="space-y-4">
        <h2 className="text-xl font-heading text-[var(--ink)]">Signature Component: Stone</h2>
        <div className="flex flex-wrap items-end gap-6 p-6 bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--line)]">
          <Stone stageNumber={1} label="Challenge" sublabel="Day 1" status="done" size={56} />
          <Stone stageNumber={7} label="Monitoring" sublabel="Day 45" status="current" size={56} />
          <Stone stageNumber={8} label="Payment" sublabel="Due 5d" status="upcoming" size={56} />
          <Stone stageNumber={9} label="Validation" sublabel="Blocked" status="blocked" size={56} />
          <Stone stageNumber={7} status="current" size={36} />
          <Stone stageNumber={7} status="done" size={24} />
          <Stone stageNumber={7} status="done" size={20} />
        </div>
      </section>

      {/* Signature Component: Pathway */}
      <section className="space-y-4">
        <h2 className="text-xl font-heading text-[var(--ink)]">Signature Component: Pathway</h2>
        <div className="p-4 bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--line)]">
          <Pathway stages={sampleStages} currentStageId={7} />
        </div>
      </section>

      {/* Signature Component: SLA Ring */}
      <section className="space-y-4">
        <h2 className="text-xl font-heading text-[var(--ink)]">Signature Component: SLA Ring</h2>
        <div className="flex items-center gap-8 p-6 bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--line)]">
          <SLARing daysLeft={24} totalSlaDays={30} />
          <SLARing daysLeft={10} totalSlaDays={30} />
          <SLARing daysLeft={-3} totalSlaDays={30} />
        </div>
      </section>

      {/* Signature Component: Score Matrix */}
      <section className="space-y-4">
        <h2 className="text-xl font-heading text-[var(--ink)]">Signature Component: Score Matrix</h2>
        <ScoreMatrix
          criteria={[
            { id: 'c1', label: 'Technical Fit', weight: 30 },
            { id: 'c2', label: 'Innovation', weight: 15 },
            { id: 'c3', label: 'Feasibility & Scalability', weight: 20 },
            { id: 'c4', label: 'Data Security', weight: 15 },
            { id: 'c5', label: 'Team Capability', weight: 10 },
            { id: 'c6', label: 'Cost Effectiveness', weight: 10 },
          ]}
          rows={[
            {
              startupId: 's1',
              startupName: 'Aquavrit Systems',
              blindCode: 'S-01',
              scores: { c1: 9, c2: 8.5, c3: 9, c4: 8, c5: 8.5, c6: 7.5 },
              isLocked: true,
            },
            {
              startupId: 's2',
              startupName: 'Nirvahan Utility Labs',
              blindCode: 'S-02',
              scores: { c1: 7, c2: 7.5, c3: 8, c4: 8.5, c5: 7, c6: 9 },
              evaluatorSpreadFlags: { c1: true },
            },
          ]}
        />
      </section>

      {/* Signature Component: KPI Chart */}
      <section className="space-y-4">
        <h2 className="text-xl font-heading text-[var(--ink)]">Signature Component: KPI Chart</h2>
        <KPIChart
          title="Non-revenue water %"
          unit="%"
          baseline={38}
          target={25}
          dataPoints={[
            { date: '8 Aug', value: 38 },
            { date: '15 Aug', value: 37.1 },
            { date: '22 Aug', value: 35.8, milestoneStageNumber: 6, milestoneTitle: 'Sensors Installed' },
            { date: '29 Aug', value: 34.9 },
            { date: '5 Sep', value: 33.6, milestoneStageNumber: 7, milestoneTitle: 'Baseline Verified' },
            { date: '12 Sep', value: 32.4 },
            { date: '21 Sep', value: 31.7 },
          ]}
        />
      </section>

      {/* Signature Component: Gate Checklist */}
      <section className="space-y-4">
        <h2 className="text-xl font-heading text-[var(--ink)]">Signature Component: Gate Checklist</h2>
        <GateChecklist
          stageNumber={1}
          stageName="Challenge"
          gates={[
            { id: 'g1', label: 'Problem statement complete (context, baseline, target, budget band)', ok: true },
            { id: 'g2', label: 'Approver sign-off on challenge file', ok: false, detail: 'Awaiting Joint Director sign-off', fixHref: '/app/challenges/CH-014?tab=overview' },
          ]}
        />
      </section>

      {/* Signature Component: Audit Trail */}
      <section className="space-y-4">
        <h2 className="text-xl font-heading text-[var(--ink)]">Signature Component: Audit Trail</h2>
        <AuditTrail
          events={[
            {
              id: 'ev1',
              action: 'CHALLENGE_PUBLISHED',
              actorName: 'Meera Kulkarni',
              actorRole: 'Joint Director',
              timestamp: '8 Aug 2026 10:30',
              hash: '8f9a2b1c4e7d3f0a',
              prevHash: '0000000000000000',
              payloadSummary: 'Published CH-014 Cut water lost in ward supply networks',
            },
            {
              id: 'ev2',
              action: 'PILOT_AGREEMENT_ACCEPTED',
              actorName: 'Sana Iqbal',
              actorRole: 'Startup Founder',
              timestamp: '15 Aug 2026 14:15',
              hash: '3e4f5a6b7c8d9e0f',
              prevHash: '8f9a2b1c4e7d3f0a',
              payloadSummary: 'Accepted Pilot Agreement v1 for ₹48,00,000',
            },
          ]}
        />
      </section>

      {/* Signature Component: Document View */}
      <section className="space-y-4">
        <h2 className="text-xl font-heading text-[var(--ink)]">Signature Component: Document View</h2>
        <DocumentView title="Pilot Agreement: CH-014 Water Loss Reduction" version="1.0" lastUpdated="15 Aug 2026">
          <p>
            This agreement is entered into between the Urban Development Department, Ranipur Municipal Corporation, and Aquavrit Systems for testing innovative water leak detection technology.
          </p>
          <p>
            The pilot duration shall be 90 days across Wards 7, 12, and 19. All milestone payments are contingent upon verified KPI readings logged to the platform.
          </p>
        </DocumentView>
      </section>
    </div>
  )
}
