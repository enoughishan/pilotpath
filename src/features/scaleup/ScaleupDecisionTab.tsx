import React, { useCallback, useEffect, useState } from 'react'
import { DocumentView } from '@/components/DocumentView'
import { assembleDossier } from '@/logic/dossier'
import type { DossierReport } from '@/logic/dossier'
import { recommendProcurementPathway } from '@/logic/pathway'
import type { PathwayInputs } from '@/logic/pathway'
import { db } from '@/mock/db'
import type { Adoption, Challenge, ScaleDecision, AuditEvent } from '@/mock/schema'
import { createAuditEvent } from '@/logic/auditChain'
import { Award, Download, CheckCircle2 } from 'lucide-react'
import { clsx } from 'clsx'

interface ScaleupDecisionTabProps {
  challenge?: Challenge
}

export const ScaleupDecisionTab: React.FC<ScaleupDecisionTabProps> = ({ challenge }) => {
  const [adoptions, setAdoptions] = useState<Adoption[]>([])
  const [recorded, setRecorded] = useState<boolean>(false)

  // Pathway Recommender Inputs
  const [pathwayInputs, setPathwayInputs] = useState<PathwayInputs>({
    contractValueLakh: 48,
    evidenceGrade: 'A',
    capableVendorsSeen: 1,
    isMarketplaceListed: true,
    wantsRepeatSites: false,
    isProprietary: true,
  })

  const loadAdoptions = useCallback(() => {
    db.adoptions.toArray().then((list) => {
      setAdoptions(list)
    })
  }, [])

  useEffect(() => {
    loadAdoptions()
  }, [loadAdoptions])

  const dossierReport: DossierReport = assembleDossier({
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
    readingsLoggedPct: 96,
    validatorVerdict: 'pass',
    paymentTimelinessAvgDays: 19,
    risksMaterializedCount: 0,
    recommendationText: 'Proceed to scale-up procurement across municipal wards.',
  })

  const pathwayOptions = recommendProcurementPathway(pathwayInputs)

  const handleRequestAdoption = async (district: string) => {
    const newAdoption: Adoption = {
      id: `ad-${adoptions.length + 1}-${district}`,
      pilotId: 'pilot-004',
      departmentId: 'dept-ph',
      district,
      status: 'requested',
    }
    await db.adoptions.add(newAdoption)
    loadAdoptions()
    alert(`Adoption requested for district ${district}.`)
  }

  const handleRecordDecision = async () => {
    const challengeId = challenge?.id ?? 'CH-014'
    const decision: ScaleDecision = {
      id: `scale-${challengeId}`,
      pilotId: `pilot-${challengeId.slice(3)}`,
      evidenceGrade: 'A',
      pathwayChosen: 'GeM direct listing',
      rationale: 'Validated outcomes with a full audit chain.',
      approvedBy: 'u-meera',
      approvedAt: new Date().toISOString(),
    }
    await db.scaleDecisions.put(decision)
    const events = await db.auditEvents.toArray()
    const ev = await createAuditEvent(events, {
      id: `aud-${Date.now()}`,
      entityType: 'challenge',
      entityId: challengeId,
      actorId: 'u-meera',
      actorName: 'Meera Kulkarni',
      action: 'SCALE_DECISION_RECORDED',
      payload: { grade: 'A', pathway: decision.pathwayChosen },
      at: new Date().toISOString(),
    })
    await db.auditEvents.add(ev as AuditEvent)
    window.dispatchEvent(new CustomEvent('pilotbridge:data-changed'))
    setRecorded(true)
    alert('Scale-up decision recorded and signed off.')
  }

  const districtList = [
    { name: 'Ranipur', status: 'live' },
    { name: 'Devgarh', status: 'live' },
    { name: 'Sundarvan', status: 'approved' },
    { name: 'Manikpur', status: 'requested' },
    { name: 'Chandrapali', status: 'not_adopted' },
    { name: 'Kasturigram', status: 'not_adopted' },
    { name: 'Jheelpur', status: 'not_adopted' },
    { name: 'Nandanwadi', status: 'not_adopted' },
  ]

  return (
    <div className="space-y-6">
      {/* Evidence Grade Banner */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-[var(--go-tint)] border border-[var(--go)] flex items-center justify-center font-bold font-heading text-xl text-[var(--go)]">
            Grade {dossierReport.evidenceGrade}
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-[var(--ink)]">
              Evidence Dossier Grade: {dossierReport.evidenceGrade}
            </h3>
            <p className="text-xs text-[var(--ink-2)]">{dossierReport.gradeRationale}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {recorded ? (
            <button
              disabled
              className="px-4 py-2 bg-[var(--go-tint)] text-[var(--go)] text-xs font-semibold rounded-[var(--radius-sm)] flex items-center space-x-1.5 cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Decision recorded & signed off</span>
            </button>
          ) : (
            <button
              onClick={handleRecordDecision}
              className="px-4 py-2 bg-[var(--go)] text-white text-xs font-semibold rounded-[var(--radius-sm)] hover:opacity-90 flex items-center space-x-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Record decision & sign off</span>
            </button>
          )}
          <button
            onClick={() => alert('Downloading Evidence Dossier PDF...')}
            className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-semibold rounded-[var(--radius-sm)] hover:bg-[var(--primary-strong)] flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Dossier (PDF)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Dossier View */}
        <DocumentView title="Scale-up Evidence Dossier: CH-014 Water Loss Reduction" version="1.0">
          <p>
            This dossier compiles empirical results from the 90-day pilot executed by Aquavrit Systems for Urban Development Department.
          </p>

          <h4 className="font-bold text-sm mt-4">1. KPI Outcomes Summary</h4>
          <div className="my-2 p-3 bg-[var(--sunken)] rounded border border-[var(--line)] text-xs space-y-1 font-mono">
            <div>Non-revenue water: Baseline 38% → Achieved 24% (Target 25% MET)</div>
            <div>Leak repair time: Baseline 72h → Achieved 20h (Target 24h MET)</div>
          </div>

          <h4 className="font-bold text-sm mt-4">2. Financial & Payment Integrity</h4>
          <p className="text-xs text-[var(--ink-2)]">
            All 4 milestone payments verified. Average payment turnaround: 19 days.
          </p>

          <h4 className="font-bold text-sm mt-4">3. Recommendation</h4>
          <p className="text-xs text-[var(--ink-2)]">{dossierReport.data.recommendationText}</p>
        </DocumentView>

        {/* Right Pathway Recommender & District Adoption */}
        <div className="space-y-6">
          {/* Pathway Recommender */}
          <div className="p-6 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] space-y-4">
            <h3 className="font-heading font-semibold text-base text-[var(--ink)]">
              Procurement Pathway Recommender
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded bg-[var(--sunken)]">
              <label className="flex items-center space-x-2 cursor-pointer font-semibold">
                <input
                  type="checkbox"
                  checked={pathwayInputs.isMarketplaceListed}
                  onChange={(e) => setPathwayInputs({ ...pathwayInputs, isMarketplaceListed: e.target.checked })}
                />
                <span>Listed on Marketplace</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer font-semibold">
                <input
                  type="checkbox"
                  checked={pathwayInputs.isProprietary}
                  onChange={(e) => setPathwayInputs({ ...pathwayInputs, isProprietary: e.target.checked })}
                />
                <span>Proprietary Article</span>
              </label>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-[var(--ink-2)] block">Ranked Pathway Options:</span>
              {pathwayOptions.map((opt, idx) => (
                <div
                  key={opt.id}
                  className={clsx(
                    'p-3 rounded-[var(--radius-sm)] border space-y-1 text-xs',
                    idx === 0 ? 'bg-[var(--primary-tint)] border-[var(--primary)]' : 'bg-[var(--sunken)] border-[var(--line)]'
                  )}
                >
                  <div className="flex items-center justify-between font-bold text-[var(--ink)]">
                    <span>{idx + 1}. {opt.title}</span>
                    {idx === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--primary)] text-white font-bold">TOP RECOMMENDATION</span>}
                  </div>
                  <p className="text-[11px] text-[var(--ink-2)]">{opt.rationale}</p>
                </div>
              ))}
            </div>
          </div>

          {/* District Adoption Tile Grid */}
          <div className="p-6 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] space-y-4">
            <h3 className="font-heading font-semibold text-base text-[var(--ink)]">
              District Adoption Grid
            </h3>

            <div className="grid grid-cols-4 gap-3 text-center">
              {districtList.map((d) => {
                // Persisted adoption requests override the static seed status so the
                // tile flips to "requested" immediately after another district adopts.
                const persisted = adoptions.find((a) => a.district === d.name)
                const status = persisted ? persisted.status : d.status
                const live = status === 'live'
                const approved = status === 'approved'
                const requested = status === 'requested'

                return (
                  <div
                    key={d.name}
                    onClick={() => status === 'not_adopted' && handleRequestAdoption(d.name)}
                    className={clsx(
                      'p-3 rounded-[var(--radius-sm)] border text-xs font-semibold space-y-1 transition-colors cursor-pointer',
                      live
                        ? 'bg-[var(--go-tint)] text-[var(--go)] border-[var(--go)]'
                        : approved
                        ? 'bg-[var(--primary-tint)] text-[var(--primary-strong)] border-[var(--primary)]'
                        : requested
                        ? 'bg-[var(--marker-tint)] text-[var(--ink)] border-[var(--marker)]'
                        : 'bg-[var(--sunken)] text-[var(--ink-3)] border-[var(--line)] hover:bg-[var(--surface)]'
                    )}
                  >
                    <div>{d.name}</div>
                    <div className="text-[10px] uppercase font-bold">{status.replace('_', ' ')}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
