import React, { useEffect, useState } from 'react'
import { evaluateEligibility } from '@/logic/rules'
import type { EligibilityRule } from '@/logic/rules'
import { AuditTrail } from '@/components/AuditTrail'
import type { AuditLogItem } from '@/components/AuditTrail'
import { db } from '@/mock/db'
import { createAuditEvent, verifyChain } from '@/logic/auditChain'
import type { Startup, AuditEvent } from '@/mock/schema'
import { AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'

export const AdminRulesRubricsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'rubrics' | 'audit'>('rules')
  const [startups, setStartups] = useState<Startup[]>([])
  const [selectedStartupId, setSelectedStartupId] = useState<string>('st-aquavrit')
  const [auditEvents, setAuditEvents] = useState<AuditLogItem[]>([])

  // Rules editor state
  const [rules] = useState<EligibilityRule[]>([
    { id: 'r1', label: 'Registered Indian Entity', field: 'registeredEntity', op: '==', value: true, required: true, relaxableForStartups: false },
    { id: 'r2', label: 'Startup Status', field: 'dpiitRecognised', op: '==', value: true, required: false, relaxableForStartups: true, relaxationCondition: 'Relaxed for 10-year incorporated entities' },
    { id: 'r3', label: 'Turnover Requirement', field: 'turnoverValCr', op: '>=', value: 3, required: false, relaxableForStartups: true, relaxationCondition: 'Waived for DPIIT recognised startups' },
  ])

  // Rubric weights state
  const [rubricWeights, setRubricWeights] = useState<Record<string, number>>({
    c1: 30,
    c2: 15,
    c3: 20,
    c4: 15,
    c5: 10,
    c6: 10,
  })

  const loadAdminData = async () => {
    const list = await db.startups.toArray()
    setStartups(list)
    const events = await db.auditEvents.toArray()
    setAuditEvents(
      events.map((e) => ({
        id: e.id,
        action: e.action,
        actorName: e.actorName,
        actorRole: 'Nodal Admin',
        timestamp: new Date(e.at).toLocaleString(),
        hash: e.hash,
        prevHash: e.prevHash,
      }))
    )
  }

  useEffect(() => {
    let active = true
    Promise.all([db.startups.toArray(), db.auditEvents.toArray()]).then(([list, events]) => {
      if (active) {
        setStartups(list)
        setAuditEvents(
          events.map((e) => ({
            id: e.id,
            action: e.action,
            actorName: e.actorName,
            actorRole: 'Nodal Admin',
            timestamp: new Date(e.at).toLocaleString(),
            hash: e.hash,
            prevHash: e.prevHash,
          }))
        )
      }
    })
    return () => {
      active = false
    }
  }, [])

  // Refresh audit trail when demo controls or other screens mutate the chain
  useEffect(() => {
    const onChange = () => { void loadAdminData() }
    window.addEventListener('pilotbridge:data-changed', onChange)
    return () => window.removeEventListener('pilotbridge:data-changed', onChange)
  }, [])

  const selectedStartup = startups.find((s) => s.id === selectedStartupId) || startups[0]

  const testResult = selectedStartup
    ? evaluateEligibility(
        rules,
        {
          registeredEntity: true,
          dpiitRecognised: selectedStartup.dpiitRecognised,
          turnoverValCr: selectedStartup.turnoverBandCr.includes('5-10') ? 6 : selectedStartup.turnoverBandCr.includes('1-5') ? 2 : 0.5,
        },
        selectedStartup.dpiitRecognised
      )
    : null

  const rubricTotalWeight = Object.values(rubricWeights).reduce((a, b) => a + b, 0)
  const isRubricValid = Math.abs(rubricTotalWeight - 100) < 0.01

  const handlePublishRules = async () => {
    const events = await db.auditEvents.toArray()
    const ev = await createAuditEvent(events, {
      id: `aud-${Date.now()}`,
      entityType: 'ruleset',
      entityId: 'rules-default',
      actorId: 'u-farah',
      actorName: 'Farah Sheikh',
      action: 'RULESET_PUBLISHED_V4',
      payload: { rulesCount: rules.length },
      at: new Date().toISOString(),
    })
    await db.auditEvents.add(ev as AuditEvent)
    alert('Eligibility ruleset published as v4. Audit event logged.')
    loadAdminData()
  }

  const handleVerifyChain = async () => {
    const events = await db.auditEvents.toArray()
    const res = await verifyChain(events)
    if (res.ok) {
      return { ok: true as const, count: res.count }
    }
    return { ok: false as const, count: res.count, brokenAt: res.brokenAt }
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[var(--line)] pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[var(--ink)]">
            Admin Governance Workspace
          </h1>
          <p className="text-xs text-[var(--ink-2)] mt-0.5">
            Manage eligibility threshold rules, evaluation rubrics, and cryptographic audit logs
          </p>
        </div>

        <div className="flex space-x-1 border border-[var(--line)] rounded-[var(--radius-sm)] p-1 bg-[var(--surface)] text-xs font-heading font-semibold">
          <button
            onClick={() => setActiveTab('rules')}
            className={clsx('px-3 py-1 rounded cursor-pointer', activeTab === 'rules' ? 'bg-[var(--primary)] text-white' : 'text-[var(--ink-2)]')}
          >
            Eligibility Rules
          </button>
          <button
            onClick={() => setActiveTab('rubrics')}
            className={clsx('px-3 py-1 rounded cursor-pointer', activeTab === 'rubrics' ? 'bg-[var(--primary)] text-white' : 'text-[var(--ink-2)]')}
          >
            Rubric Library
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={clsx('px-3 py-1 rounded cursor-pointer', activeTab === 'audit' ? 'bg-[var(--primary)] text-white' : 'text-[var(--ink-2)]')}
          >
            Audit Chain
          </button>
        </div>
      </div>

      {/* Rules Editor Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="p-3 bg-[var(--marker-tint)] border border-[var(--marker)] rounded-[var(--radius-sm)] text-xs text-[var(--ink)] flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Sample thresholds. Confirm against your current procurement rules before use.</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rule List */}
            <div className="space-y-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] p-6">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <h3 className="font-heading font-semibold text-base text-[var(--ink)]">
                  Active Eligibility Rules (v3)
                </h3>
                <button
                  onClick={handlePublishRules}
                  className="px-3 py-1.5 bg-[var(--primary)] text-white text-xs font-semibold rounded hover:bg-[var(--primary-strong)] cursor-pointer"
                >
                  Publish as v4
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {rules.map((r, i) => (
                  <div key={r.id} className="p-3 rounded bg-[var(--sunken)] border border-[var(--line)] space-y-1">
                    <div className="flex items-center justify-between font-bold text-[var(--ink)]">
                      <span>{i + 1}. {r.label}</span>
                      <span className="font-mono text-[10px] text-[var(--primary)]">{r.field} {r.op} {String(r.value)}</span>
                    </div>
                    {r.relaxableForStartups && (
                      <div className="text-[11px] text-[var(--primary-strong)] italic">
                        Relaxable: {r.relaxationCondition}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Test Bench */}
            <div className="space-y-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] p-6">
              <h3 className="font-heading font-semibold text-base text-[var(--ink)]">
                Live Test Bench
              </h3>
              <p className="text-xs text-[var(--ink-2)]">Select a startup to re-run eligibility rules live:</p>

              <select
                value={selectedStartupId}
                onChange={(e) => setSelectedStartupId(e.target.value)}
                className="w-full p-2 bg-[var(--sunken)] border border-[var(--line)] rounded text-xs text-[var(--ink)]"
              >
                {startups.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.dpiitRecognised ? 'DPIIT' : 'Standard'})
                  </option>
                ))}
              </select>

              {testResult && (
                <div className="p-4 rounded bg-[var(--sunken)] border border-[var(--line)] space-y-2 text-xs font-mono">
                  <div>Overall Result: <strong>{testResult.overall.toUpperCase()}</strong></div>
                  <div className="space-y-1 pt-2 border-t border-[var(--line)]">
                    {testResult.ruleResults.map((r) => (
                      <div key={r.ruleId} className="flex items-center justify-between">
                        <span>{r.label}</span>
                        <span className="font-bold">{r.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rubric Library Tab */}
      {activeTab === 'rubrics' && (
        <div className="p-6 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
            <h3 className="font-heading font-semibold text-base text-[var(--ink)]">
              Weight Allocator (Sliders must total 100%)
            </h3>
            <span
              className={clsx(
                'px-2 py-0.5 text-xs font-bold rounded-full',
                isRubricValid ? 'bg-[var(--go-tint)] text-[var(--go)]' : 'bg-[var(--stop-tint)] text-[var(--stop)]'
              )}
            >
              Total Weight: {rubricTotalWeight}%
            </span>
          </div>

          <div className="space-y-4 max-w-xl">
            {[
              { id: 'c1', label: 'Technical fit' },
              { id: 'c2', label: 'Innovation' },
              { id: 'c3', label: 'Feasibility and scalability' },
              { id: 'c4', label: 'Data security and compliance' },
              { id: 'c5', label: 'Team and delivery capability' },
              { id: 'c6', label: 'Cost effectiveness' },
            ].map((c) => (
              <div key={c.id} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span>{c.label}</span>
                  <span className="font-mono text-[var(--primary)]">{rubricWeights[c.id]}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={rubricWeights[c.id]}
                  onChange={(e) => setRubricWeights({ ...rubricWeights, [c.id]: Number(e.target.value) })}
                  className="w-full accent-[var(--primary)] cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Chain Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <p className="text-xs text-[var(--ink-2)]">
            Every action in Pilot Bridge is written to a SHA-256 hash chain. Verify below to confirm no event has been tampered with.
          </p>
          <AuditTrail events={auditEvents} onVerifyChain={handleVerifyChain} />
        </div>
      )}
    </div>
  )
}
