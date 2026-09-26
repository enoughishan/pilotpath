import { describe, it, expect } from 'vitest'
import { createAuditEvent, verifyChain } from './auditChain'
import type { AuditEventData } from './auditChain'

describe('auditChain logic module', () => {
  it('creates and verifies a valid chain of audit events', async () => {
    const chain: AuditEventData[] = []

    const ev1 = await createAuditEvent(chain, {
      id: 'ev-01',
      entityType: 'challenge',
      entityId: 'CH-014',
      actorId: 'u-officer',
      actorName: 'Meera Kulkarni',
      action: 'CHALLENGE_CREATED',
      at: '2026-08-08T10:00:00Z',
    })
    chain.push(ev1)

    const ev2 = await createAuditEvent(chain, {
      id: 'ev-02',
      entityType: 'challenge',
      entityId: 'CH-014',
      actorId: 'u-officer',
      actorName: 'Meera Kulkarni',
      action: 'CHALLENGE_PUBLISHED',
      at: '2026-08-08T10:30:00Z',
    })
    chain.push(ev2)

    const result = await verifyChain(chain)
    expect(result.ok).toBe(true)
    expect(result.count).toBe(2)
  })

  it('detects tampering with event data', async () => {
    const chain: AuditEventData[] = []
    const ev1 = await createAuditEvent(chain, {
      id: 'ev-01',
      entityType: 'challenge',
      entityId: 'CH-014',
      actorId: 'u-officer',
      actorName: 'Meera Kulkarni',
      action: 'CHALLENGE_CREATED',
      at: '2026-08-08T10:00:00Z',
    })
    chain.push(ev1)

    // Tamper with action
    chain[0].action = 'CHALLENGE_DELETED'

    const result = await verifyChain(chain)
    expect(result.ok).toBe(false)
    expect(result.brokenAt).toBe('ev-01')
  })
})
