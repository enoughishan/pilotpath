/**
 * Cryptographic Audit Chain implementation using SubtleCrypto SHA-256
 */

export interface AuditEventData {
  id: string
  entityType: string
  entityId: string
  actorId: string
  actorName: string
  action: string
  payload?: Record<string, unknown>
  at: string
  prevHash: string
  hash?: string
}

export const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000'

function canonicalizeJson(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj)
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalizeJson).join(',') + ']'
  }
  const keys = Object.keys(obj as Record<string, unknown>).sort()
  const entries = keys.map(
    (k) => JSON.stringify(k) + ':' + canonicalizeJson((obj as Record<string, unknown>)[k])
  )
  return '{' + entries.join(',') + '}'
}

export async function computeEventHash(
  prevHash: string,
  eventData: Omit<AuditEventData, 'hash' | 'prevHash'>
): Promise<string> {
  const canonical = canonicalizeJson(eventData)
  const message = prevHash + canonical
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function createAuditEvent(
  events: AuditEventData[],
  eventData: Omit<AuditEventData, 'hash' | 'prevHash'>
): Promise<AuditEventData> {
  const prevHash = events.length > 0 ? events[events.length - 1].hash! : GENESIS_HASH
  const hash = await computeEventHash(prevHash, eventData)
  return {
    ...eventData,
    prevHash,
    hash,
  }
}

export async function verifyChain(
  events: AuditEventData[]
): Promise<{ ok: boolean; intact: boolean; count: number; brokenAt?: string; failedAt: string | null }> {
  let prevHash = GENESIS_HASH

  for (let i = 0; i < events.length; i++) {
    const ev = events[i]
    if (ev.prevHash !== prevHash) {
      return { ok: false, intact: false, count: i, brokenAt: ev.id, failedAt: ev.id }
    }

    const cleanData = { ...ev }
    delete (cleanData as Record<string, unknown>).hash
    delete (cleanData as Record<string, unknown>).prevHash
    const computed = await computeEventHash(prevHash, cleanData as Omit<AuditEventData, 'hash' | 'prevHash'>)
    if (computed !== ev.hash) {
      return { ok: false, intact: false, count: i, brokenAt: ev.id, failedAt: ev.id }
    }

    prevHash = ev.hash!
  }

  return { ok: true, intact: true, count: events.length, failedAt: null }
}
