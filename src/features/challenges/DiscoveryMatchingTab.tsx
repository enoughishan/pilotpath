import React, { useEffect, useState } from 'react'
import { matchStartupToChallenge } from '@/logic/matching'
import type { MatchResult } from '@/logic/matching'
import { db } from '@/mock/db'
import type { Startup, Challenge } from '@/mock/schema'
import { ChevronDown, ChevronUp, Upload, ShieldCheck } from 'lucide-react'
import { clsx } from 'clsx'

interface DiscoveryMatchingTabProps {
  challenge: Challenge
}

export const DiscoveryMatchingTab: React.FC<DiscoveryMatchingTabProps> = ({ challenge }) => {
  const [startups, setStartups] = useState<Startup[]>([])
  const [matchResults, setMatchResults] = useState<MatchResult[]>([])
  const [expandedStartupId, setExpandedStartupId] = useState<string | null>(null)
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set(['st-aquavrit']))
  const [compareList] = useState<string[]>([])
  const [showCSVModal, setShowCSVModal] = useState(false)
  const [applicationsCount, setApplicationsCount] = useState<number>(0)

  useEffect(() => {
    let active = true
    Promise.all([
      db.startups.toArray(),
      db.applications.where('challengeId').equals(challenge.id).toArray(),
    ]).then(([list, apps]) => {
      if (!active) return
      setStartups(list)
      setApplicationsCount(apps.length)
      const cInput = {
        id: challenge.id,
        title: challenge.title,
        context: challenge.context,
        sector: challenge.sector,
        district: challenge.district,
        tags: ['water', 'leakage', 'sensors', 'flow'],
      }
      const results = list
        .map((s) => matchStartupToChallenge(cInput, s))
        .sort((a, b) => b.score - a.score)
      setMatchResults(results)
    })
    return () => {
      active = false
    }
  }, [challenge])

  const toggleInvite = (id: string) => {
    setInvitedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-6" data-tour="discovery-matching">
      {/* Top Strip Summary */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-6">
          <div>
            <span className="text-[var(--ink-3)] block">Call Closes</span>
            <span className="font-bold text-[var(--ink)]">{challenge.callClosesOn}</span>
          </div>
          <div>
            <span className="text-[var(--ink-3)] block">Days Remaining</span>
            <span className="font-bold text-[var(--go)]">12 days</span>
          </div>
          <div>
            <span className="text-[var(--ink-3)] block">Invited Startups</span>
            <span className="font-bold text-[var(--ink)]">{invitedIds.size}</span>
          </div>
          <div>
            <span className="text-[var(--ink-3)] block">Applications Received</span>
            <span className="font-bold text-[var(--primary)]">{applicationsCount}</span>
          </div>
        </div>

        <button
          onClick={() => setShowCSVModal(true)}
          className="px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--sunken)] font-semibold flex items-center space-x-1.5 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Connector preview (CSV Import)</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Filters Column */}
        <div className="space-y-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] p-4 h-fit">
          <h4 className="font-heading font-semibold text-sm text-[var(--ink)]">Filter Matches</h4>

          <div className="space-y-2 text-xs">
            <label className="text-[var(--ink-2)] font-semibold block">DPIIT Recognition</label>
            <select className="w-full p-2 bg-[var(--sunken)] border border-[var(--line)] rounded text-[var(--ink)]">
              <option>All Startups</option>
              <option>DPIIT Recognised Only</option>
            </select>
          </div>

          <div className="space-y-2 text-xs">
            <label className="text-[var(--ink-2)] font-semibold block">Minimum Match Score</label>
            <input type="range" min="0" max="100" defaultValue="40" className="w-full" />
          </div>
        </div>

        {/* Right Ranked List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--ink-2)]">
            <span className="font-semibold">{matchResults.length} Matched Startups</span>
            {compareList.length > 0 && (
              <span className="font-bold text-[var(--primary)]">
                {compareList.length}/3 selected for comparison
              </span>
            )}
          </div>

          <div className="space-y-3">
            {matchResults.map((res) => {
              const startup = startups.find((s) => s.id === res.startupId)
              const isExpanded = expandedStartupId === res.startupId
              const isInvited = invitedIds.has(res.startupId)

              return (
                <div
                  key={res.startupId}
                  className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] p-4 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-heading font-bold text-base text-[var(--ink)]">
                          {res.startupName}
                        </span>
                        {startup?.dpiitRecognised && (
                          <span className="px-1.5 py-0.5 rounded bg-[var(--go-tint)] text-[var(--go)] text-[10px] font-bold flex items-center space-x-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>DPIIT</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--ink-2)] line-clamp-1">{startup?.pitch}</p>
                    </div>

                    {/* Match Score & Actions */}
                    <div className="flex items-center space-x-3 shrink-0">
                      <div className="text-right">
                        <div className="font-heading font-bold text-lg text-[var(--primary)]">
                          {res.score}/100
                        </div>
                        <div className="w-20 h-1.5 bg-[var(--sunken)] rounded-full overflow-hidden flex">
                          <div
                            className="bg-[var(--primary)] h-full"
                            style={{ width: `${res.breakdown.textSimilarity}%` }}
                          />
                          <div
                            className="bg-[var(--marker)] h-full"
                            style={{ width: `${res.breakdown.sectorFit}%` }}
                          />
                          <div
                            className="bg-[var(--go)] h-full"
                            style={{ width: `${res.breakdown.trackRecord}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => toggleInvite(res.startupId)}
                        className={clsx(
                          'px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] border cursor-pointer transition-colors',
                          isInvited
                            ? 'bg-[var(--go-tint)] text-[var(--go)] border-[var(--go)]'
                            : 'bg-[var(--primary)] text-white border-[var(--primary)] hover:bg-[var(--primary-strong)]'
                        )}
                      >
                        {isInvited ? 'Invited' : 'Invite'}
                      </button>

                      <button
                        onClick={() =>
                          setExpandedStartupId(isExpanded ? null : res.startupId)
                        }
                        className="p-1.5 text-[var(--ink-3)] hover:text-[var(--ink)] cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Breakdown & Reasons */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-[var(--line)] space-y-3 text-xs">
                      <div className="grid grid-cols-4 gap-2 text-center p-2 rounded bg-[var(--sunken)] font-mono">
                        <div>
                          <span className="text-[var(--ink-3)] block text-[10px]">Text Match</span>
                          <span>{res.breakdown.textSimilarity}/55</span>
                        </div>
                        <div>
                          <span className="text-[var(--ink-3)] block text-[10px]">Sector Fit</span>
                          <span>{res.breakdown.sectorFit}/20</span>
                        </div>
                        <div>
                          <span className="text-[var(--ink-3)] block text-[10px]">Track Record</span>
                          <span>{res.breakdown.trackRecord}/15</span>
                        </div>
                        <div>
                          <span className="text-[var(--ink-3)] block text-[10px]">Readiness</span>
                          <span>{res.breakdown.readiness}/10</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="font-semibold text-[var(--ink)] block">Matching Reasons:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[var(--ink-2)]">
                          {res.reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CSV Connector Preview Modal */}
      {showCSVModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] max-w-md w-full rounded-[var(--radius-lg)] p-6 space-y-4 shadow-2xl">
            <h3 className="font-heading font-bold text-base text-[var(--ink)]">
              Connector Preview: Import Registry Export
            </h3>
            <p className="text-xs text-[var(--ink-2)]">
              Simulated CSV registry adapter. Drag & drop a CSV file containing startup records to import into local IndexedDB.
            </p>

            <div className="border-2 border-dashed border-[var(--line-strong)] rounded-[var(--radius-md)] p-8 text-center space-y-2">
              <Upload className="w-8 h-8 text-[var(--primary)] mx-auto" />
              <div className="text-xs font-semibold text-[var(--ink)]">Drop CSV registry export here</div>
              <div className="text-[10px] text-[var(--ink-3)]">CSV, max 5MB</div>
            </div>

            <button
              onClick={() => setShowCSVModal(false)}
              className="w-full py-2 bg-[var(--sunken)] text-xs font-semibold text-[var(--ink)] rounded border border-[var(--line)] cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
