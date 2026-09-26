import { http, HttpResponse } from 'msw'
import { db } from './db'
import { simulateLatency, shouldInjectError } from './latency'

import type { Challenge } from './schema'

export const handlers = [
  // Challenges
  http.get('/api/challenges', async () => {
    await simulateLatency()
    const list = await db.challenges.toArray()
    return HttpResponse.json(list)
  }),

  http.get('/api/challenges/:id', async ({ params }) => {
    await simulateLatency()
    const challenge = await db.challenges.get(params.id as string)
    if (!challenge) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(challenge)
  }),

  http.post('/api/challenges', async ({ request }) => {
    await simulateLatency()
    if (shouldInjectError(true)) {
      return new HttpResponse(JSON.stringify({ message: 'Simulated 503 Server Error. Try again.' }), { status: 503 })
    }
    const body = (await request.json()) as Challenge
    await db.challenges.add(body)
    return HttpResponse.json(body, { status: 201 })
  }),

  // Startups
  http.get('/api/startups', async () => {
    await simulateLatency()
    const list = await db.startups.toArray()
    return HttpResponse.json(list)
  }),

  // Applications
  http.get('/api/applications', async () => {
    await simulateLatency()
    const list = await db.applications.toArray()
    return HttpResponse.json(list)
  }),

  // Pilots
  http.get('/api/pilots', async () => {
    await simulateLatency()
    const list = await db.pilots.toArray()
    return HttpResponse.json(list)
  }),

  // Milestones
  http.get('/api/milestones', async () => {
    await simulateLatency()
    const list = await db.milestones.toArray()
    return HttpResponse.json(list)
  }),

  // Audit Events
  http.get('/api/audit-events', async () => {
    await simulateLatency()
    const list = await db.auditEvents.toArray()
    return HttpResponse.json(list)
  }),

  // Reset Demo Data Endpoint
  http.post('/api/demo/reset', async () => {
    await simulateLatency()
    const { seedDatabase } = await import('./seed')
    await seedDatabase(true)
    return HttpResponse.json({ ok: true, message: 'Demo data reset to initial seed.' })
  }),
]
