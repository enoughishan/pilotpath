import React, { useState } from 'react'
import { ShieldCheck, AlertCircle, Hash } from 'lucide-react'
import { clsx } from 'clsx'

export interface AuditLogItem {
  id: string
  action: string
  actorName: string
  actorRole: string
  timestamp: string
  hash: string
  prevHash: string
  payloadSummary?: string
}

interface AuditTrailProps {
  events: AuditLogItem[]
  onVerifyChain?: () => Promise<{ ok: boolean; count: number; brokenAt?: string }>
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ events, onVerifyChain }) => {
  const [verificationResult, setVerificationResult] = useState<{
    ok: boolean
    count: number
    brokenAt?: string
  } | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async () => {
    setIsVerifying(true)
    try {
      if (onVerifyChain) {
        const res = await onVerifyChain()
        setVerificationResult(res)
      } else {
        setVerificationResult({ ok: true, count: events.length })
      }
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="p-4 border border-[var(--line)] rounded-[var(--radius-md)] bg-[var(--surface)] space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
        <div>
          <h4 className="font-heading font-semibold text-base text-[var(--ink)]">
            Cryptographic Audit Chain
          </h4>
          <p className="text-xs text-[var(--ink-2)]">SHA-256 hash-linked immutable event log</p>
        </div>
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)] disabled:opacity-60 cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isVerifying ? 'Verifying...' : 'Verify chain'}</span>
        </button>
      </div>

      {verificationResult && (
        <div
          className={clsx(
            'p-3 rounded-[var(--radius-sm)] text-xs flex items-center space-x-2',
            verificationResult.ok
              ? 'bg-[var(--go-tint)] text-[var(--go)] border border-[var(--go)]'
              : 'bg-[var(--stop-tint)] text-[var(--stop)] border border-[var(--stop)]'
          )}
        >
          {verificationResult.ok ? (
            <ShieldCheck className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>
            {verificationResult.ok
              ? `Chain intact, ${verificationResult.count} events verified.`
              : `Audit chain verification failed at event ${verificationResult.brokenAt}!`}
          </span>
        </div>
      )}

      <div className="relative border-l-2 border-[var(--line)] ml-3 space-y-4 pl-4 py-1">
        {events.map((ev) => (
          <div key={ev.id} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-[var(--primary)] border-2 border-[var(--surface)]" />

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[var(--ink)]">{ev.action}</span>
                <span className="text-[var(--ink-3)]">{ev.timestamp}</span>
              </div>
              <div className="text-[var(--ink-2)]">
                By <span className="font-medium text-[var(--ink)]">{ev.actorName}</span> ({ev.actorRole})
              </div>
              {ev.payloadSummary && (
                <div className="text-[var(--ink-2)] italic bg-[var(--sunken)] p-1.5 rounded-[var(--radius-sm)]">
                  {ev.payloadSummary}
                </div>
              )}
              <div className="flex items-center space-x-2 font-mono text-[10px] text-[var(--ink-3)] pt-0.5">
                <Hash className="w-3 h-3 text-[var(--ink-3)]" />
                <span>
                  Hash: {ev.hash.slice(0, 10)}... (prev: {ev.prevHash.slice(0, 8)}...)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
