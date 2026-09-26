import { create } from 'zustand'

export const INITIAL_DEMO_DATE = '2026-09-22'

interface DemoClockState {
  currentDateStr: string
  activeRole: 'officer' | 'evaluator' | 'startup' | 'validator' | 'finance' | 'admin'
  language: 'en' | 'hi'
  errorInjectionEnabled: boolean
  slowNetworkEnabled: boolean
  setCurrentDate: (dateStr: string) => void
  advanceDays: (days: number) => void
  setActiveRole: (role: 'officer' | 'evaluator' | 'startup' | 'validator' | 'finance' | 'admin') => void
  setLanguage: (lang: 'en' | 'hi') => void
  toggleErrorInjection: () => void
  toggleSlowNetwork: () => void
}

export const useDemoStore = create<DemoClockState>((set) => ({
  currentDateStr: INITIAL_DEMO_DATE,
  activeRole: 'officer',
  language: 'en',
  errorInjectionEnabled: false,
  slowNetworkEnabled: false,
  setCurrentDate: (dateStr) => set({ currentDateStr: dateStr }),
  advanceDays: (days) =>
    set((state) => {
      const d = new Date(state.currentDateStr)
      d.setDate(d.getDate() + days)
      return { currentDateStr: d.toISOString().split('T')[0] }
    }),
  setActiveRole: (role) => set({ activeRole: role }),
  setLanguage: (lang) => set({ language: lang }),
  toggleErrorInjection: () => set((state) => ({ errorInjectionEnabled: !state.errorInjectionEnabled })),
  toggleSlowNetwork: () => set((state) => ({ slowNetworkEnabled: !state.slowNetworkEnabled })),
}))
