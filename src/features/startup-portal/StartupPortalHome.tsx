import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stone } from '@/components/Stone'
import { evaluateEligibility } from '@/logic/rules'
import type { EligibilityRule } from '@/logic/rules'
import { db } from '@/mock/db'
import type { Challenge, Startup, Pilot, AuditEvent } from '@/mock/schema'
import { createAuditEvent } from '@/logic/auditChain'
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react'

export const StartupPortalHome: React.FC = () => {
  const navigate = useNavigate()
  const [startup, setStartup] = useState<Startup | null>(null)
  const [fitChallenges, setFitChallenges] = useState<Challenge[]>([])
  const [pendingPilot, setPendingPilot] = useState<Pilot | null>(null)
  const [pendingChallenge, setPendingChallenge] = useState<Challenge | null>(null)
  const [accepted, setAccepted] = useState<boolean>(false)

  const loadStartupData = useCallback(() => {
    Promise.all([
      db.startups.get('st-aquavrit'),
      db.challenges.toArray(),
    ]).then(async ([s, challenges]) => {
      if (s) setStartup(s)
      setFitChallenges(challenges.slice(0, 3))

      const stage6 = challenges
        .filter((c) => c.stage === 6 && c.status === 'active')
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))

      for (const c of stage6) {
        const p = await db.pilots.where('challengeId').equals(c.id).first()
        if (p) {
          const events = await db.auditEvents.where('entityId').equals(p.id).toArray()
          const alreadyAccepted = events.some((e) => e.action === 'PILOT_AGREEMENT_ACCEPTED')
          if (!alreadyAccepted) {
            setPendingPilot(p)
            setPendingChallenge(c)
            setAccepted(false)
            break
          }
        }
      }
    })
  }, [])

  useEffect(() => {
    loadStartupData()
  }, [loadStartupData])

  const handleAcceptPilotTerms = async () => {
    if (!pendingPilot || !pendingChallenge) return
    const events = await db.auditEvents.toArray()
    const ev = await createAuditEvent(events, {
      id: `aud-${Date.now()}`,
      entityType: 'pilot',
      entityId: pendingPilot.id,
      actorId: 'u-sana',
      actorName: 'Sana Iqbal',
      action: 'PILOT_AGREEMENT_ACCEPTED',
      payload: { challengeId: pendingChallenge.id },
      at: new Date().toISOString(),
    })
    await db.auditEvents.add(ev as AuditEvent)
    window.dispatchEvent(new CustomEvent('pilotbridge:data-changed'))
    setAccepted(true)
    alert('Pilot terms accepted. The agreement is now binding.')
  }

  const sampleRules: EligibilityRule[] = [
    { id: 'r1', label: 'Registered Entity', field: 'registeredEntity', op: '==', value: true, required: true, relaxableForStartups: false },
    { id: 'r2', label: 'Turnover Requirement (₹3 Cr)', field: 'turnoverValCr', op: '>=', value: 3, required: false, relaxableForStartups: true, relaxationCondition: 'Waived for DPIIT recognised startups' },
  ]

  const eligibilityPreview = startup
    ? evaluateEligibility(sampleRules, { registeredEntity: true, turnoverValCr: 2 }, startup.dpiitRecognised)
    : null

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Startup Header Card */}
      <div className="p-6 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold font-heading text-[var(--ink)]">
              {startup?.name || 'Aquavrit Systems'}
            </h1>
            <span className="px-2 py-0.5 rounded bg-[var(--go-tint)] text-[var(--go)] text-xs font-bold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DPIIT Recognised</span>
            </span>
          </div>
          <p className="text-xs text-[var(--ink-2)] mt-1">{startup?.pitch}</p>
        </div>

        <div className="text-right border-l border-[var(--line)] pl-4">
          <span className="text-[10px] text-[var(--ink-3)] block font-mono">PILOT PAYMENTS RECEIVED</span>
          <span className="font-heading font-bold text-xl text-[var(--go)]">₹19,20,000</span>
        </div>
      </div>

      {/* Pending Pilot Agreement */}
      {pendingPilot && pendingChallenge && (
        <div className="p-4 bg-[var(--marker-tint)] border border-[var(--marker)] rounded-[var(--radius-md)] flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-[var(--ink)] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[var(--ink)]" />
              <span>Pilot agreement awaiting your acceptance</span>
            </div>
            <div className="text-xs text-[var(--ink-2)]">
              {pendingChallenge.id} — {pendingChallenge.title}
            </div>
            <div className="text-[11px] text-[var(--ink-3)]">
              {pendingPilot.scope}
            </div>
          </div>
          {accepted ? (
            <span className="px-3 py-2 text-xs font-bold rounded-[var(--radius-sm)] bg-[var(--go-tint)] text-[var(--go)] flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Accepted</span>
            </span>
          ) : (
            <button
              onClick={handleAcceptPilotTerms}
              className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-semibold rounded-[var(--radius-sm)] hover:bg-[var(--primary-strong)] flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept pilot terms</span>
            </button>
          )}
        </div>
      )}

      {/* Live Eligibility Preview Card */}
      {eligibilityPreview && (
        <div className="p-4 bg-[var(--primary-tint)] border border-[var(--primary)] rounded-[var(--radius-md)] space-y-2 text-xs">
          <div className="flex items-center space-x-2 font-semibold text-[var(--primary-strong)]">
            <Sparkles className="w-4 h-4" />
            <span>Live Eligibility Preview for Your Profile</span>
          </div>
          <p className="text-[var(--ink)]">
            Status:{' '}
            <strong className="text-[var(--primary-strong)]">
              {eligibilityPreview.overall.replace('_', ' ').toUpperCase()}
            </strong>
            . Turnover requirement is waived for DPIIT-recognised startups.
          </p>
        </div>
      )}

      {/* My Active Applications & Pilots */}
      <div className="space-y-4">
        <h3 className="font-heading font-semibold text-base text-[var(--ink)]">
          My Active Applications & Pilots
        </h3>

        <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Stone stageNumber={7} size={36} status="current" />
            <div>
              <div className="font-heading font-bold text-sm text-[var(--ink)]">
                CH-014 Cut water lost in ward supply networks
              </div>
              <div className="text-xs text-[var(--ink-2)]">Stage 7: Monitoring (Day 45 of 90)</div>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/challenges/CH-014?tab=pilot')}
            className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-semibold rounded-[var(--radius-sm)] hover:bg-[var(--primary-strong)] flex items-center space-x-1 cursor-pointer"
          >
            <span>Open Pilot Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Challenges That Fit You */}
      <div className="space-y-4">
        <h3 className="font-heading font-semibold text-base text-[var(--ink)]">
          Challenges That Fit Your Sector & Capabilities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fitChallenges.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/app/challenges/${c.id}?tab=overview`)}
              className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] space-y-2 cursor-pointer hover:border-[var(--primary)] transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-[var(--ink-3)] font-mono">
                <span>{c.id}</span>
                <span>{c.sector}</span>
              </div>
              <div className="font-heading font-bold text-sm text-[var(--ink)] line-clamp-2">{c.title}</div>
              <div className="text-xs text-[var(--go)] font-semibold">Budget: ₹{c.budgetBand.minLakh}-{c.budgetBand.maxLakh} lakh</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
