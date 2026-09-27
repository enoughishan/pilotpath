import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PERSONAS } from '../data/seed.js';

export const useSession = create(
  persist(
    (set, get) => ({
      role: null,
      personaId: null,
      lang: 'EN',
      theme: 'light',
      sidebarCollapsed: false,

      setPersona: (personaId) => {
        const p = PERSONAS.find(x => x.id === personaId);
        if (!p) return;
        set({ role: p.role, personaId: p.id });
      },
      setRole: (role) => set({ role }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      toggleLang: () => set((s) => ({ lang: s.lang === 'EN' ? 'हिंदी' : 'EN' })),
      logout: () => set({ role: null, personaId: null }),
      persona: () => PERSONAS.find(p => p.id === get().personaId) || null
    }),
    { name: 'pilotbridge.session.v3' }
  )
);