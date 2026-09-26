import { useDemoStore } from './demoClock'

export async function simulateLatency(): Promise<void> {
  const isSlow = useDemoStore.getState().slowNetworkEnabled
  const min = isSlow ? 1200 : 150
  const max = isSlow ? 2500 : 500
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  await new Promise((resolve) => setTimeout(resolve, delay))
}

export function shouldInjectError(isWriteOperation = false): boolean {
  if (!isWriteOperation) return false
  const enabled = useDemoStore.getState().errorInjectionEnabled
  if (!enabled) return false
  return Math.random() < 0.03 // 3% random failure rate when toggled
}
