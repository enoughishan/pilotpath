import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { seedDatabase } from './seed'

export const worker = setupWorker(...handlers)

export async function initMockBackend() {
  await seedDatabase()
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      await worker.start({
        onUnhandledRequest: 'bypass',
      })
    } catch {
      // Fallback: if service worker fails or is disabled, app will query Dexie directly
      console.warn('MSW worker could not start. Application fallback to local IndexedDB.')
    }
  }
}
