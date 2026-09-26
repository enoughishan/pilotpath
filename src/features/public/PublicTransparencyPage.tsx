import React, { useCallback, useEffect, useState } from 'react'
import { db } from '@/mock/db'
import type { DemandItem, Pilot } from '@/mock/schema'
import { Download } from 'lucide-react'

export const PublicTransparencyPage: React.FC = () => {
  const [demandItems, setDemandItems] = useState<DemandItem[]>([])
  const [, setCompletedPilots] = useState<Pilot[]>([])

  const loadPublicData = useCallback(() => {
    Promise.all([
      db.demandItems.toArray(),
      db.pilots.where('status').equals('completed').toArray(),
    ]).then(([dList, pList]) => {
      setDemandItems(dList)
      setCompletedPilots(pList)
    })
  }, [])

  useEffect(() => {
    loadPublicData()
  }, [loadPublicData])

  const handleExportCSV = (sectionName: string) => {
    const csvContent = 'data:text/csv;charset=utf-8,ID,Department,Theme,Budget\n1,Urban Dev,Water,48\n2,Public Health,Cold Chain,35'
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `pilotbridge_${sectionName.toLowerCase()}_export.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-[var(--ground)] text-[var(--ink)] space-y-12 pb-16">
      {/* Top Header */}
      <header className="h-16 border-b border-[var(--line)] bg-[var(--surface)] px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-[var(--primary)] text-white font-black text-sm flex items-center justify-center">
            P
          </div>
          <span className="font-heading font-bold text-xl">Pilot Bridge Public Transparency Ledger</span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[var(--marker-tint)] text-[var(--ink)]">
          PUBLIC READ-ONLY LEDGER
        </span>
      </header>

      <main className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Programme in Numbers (Ledger Sentence format) */}
        <section className="p-6 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] space-y-3">
          <h2 className="font-heading font-bold text-xl text-[var(--ink)]">Programme Performance in Numbers</h2>
          <p className="text-base text-[var(--ink-2)] leading-relaxed font-sans">
            <strong className="text-[var(--primary)] font-bold">42 challenges</strong> published across state departments this year.{' '}
            <strong className="text-[var(--primary)] font-bold">18</strong> reached a controlled 90-day pilot trial.{' '}
            <strong className="text-[var(--go)] font-bold">11</strong> completed independent validation, and{' '}
            <strong className="text-[var(--go)] font-bold">84%</strong> of milestone payments were disbursed within the 30-day payment SLA.
          </p>
        </section>

        {/* Public Demand Board */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-xl text-[var(--ink)]">
                Upcoming Department Demand Board
              </h2>
              <p className="text-xs text-[var(--ink-2)]">Forward operational needs published by government departments</p>
            </div>

            <button
              onClick={() => handleExportCSV('Demand_Board')}
              className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--line-strong)] text-xs font-semibold rounded hover:bg-[var(--sunken)] flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Demand CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-[var(--line)] rounded-[var(--radius-md)] bg-[var(--surface)]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--sunken)] border-b border-[var(--line)] text-[var(--ink-2)] font-heading">
                  <th className="p-3">Department</th>
                  <th className="p-3">Theme</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Est. Budget</th>
                  <th className="p-3">Target Quarter</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {demandItems.slice(0, 10).map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--sunken)] transition-colors">
                    <td className="p-3 font-semibold text-[var(--ink)]">{item.departmentName}</td>
                    <td className="p-3 font-medium text-[var(--primary)]">{item.theme}</td>
                    <td className="p-3 text-[var(--ink-2)] max-w-xs">{item.description}</td>
                    <td className="p-3 font-bold font-mono">₹{item.estimatedBudgetLakh} lakh</td>
                    <td className="p-3 text-[var(--ink-2)]">{item.targetQuarter}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => alert(`Subscribed to notifications for ${item.theme}`)}
                        className="px-2.5 py-1 rounded bg-[var(--primary-tint)] text-[var(--primary-strong)] font-bold cursor-pointer"
                      >
                        Notify me
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Verified Outcomes */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-xl text-[var(--ink)]">Verified Pilot Outcomes</h2>
            <button
              onClick={() => handleExportCSV('Verified_Outcomes')}
              className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--line-strong)] text-xs font-semibold rounded hover:bg-[var(--sunken)] flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Outcomes CSV</span>
            </button>
          </div>

          <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded bg-[var(--sunken)] border border-[var(--line)]">
              <div>
                <div className="font-bold text-sm text-[var(--ink)]">CH-004 Streetlight Fault Detection</div>
                <div className="text-[var(--ink-2)] mt-0.5">Aquavrit Systems • Urban Development Department</div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full bg-[var(--go-tint)] text-[var(--go)] font-bold">
                  Grade A (Pass)
                </span>
                <div className="text-[10px] text-[var(--ink-3)] mt-1">Fault detection: 168h → 3.2h</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
