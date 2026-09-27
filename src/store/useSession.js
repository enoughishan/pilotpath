import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSession = create(
  persist(
    (set, get) => ({
      // Auth state
      authenticated: false,
      loginType: null,         // 'gov' | 'startup' | 'public'
      role: null,              // 'officer' | 'evaluator' | 'validator' | 'accounts' | 'startup'
      user: null,              // { name, email, designation, district, department, ... }
      district: null,
      department: null,

      // UI state
      lang: 'EN',
      theme: 'light',
      sidebarCollapsed: false,

      // Actions
      signInGovernment: ({ district, department, role, name, email, designation }) => {
        set({
          authenticated: true,
          loginType: 'gov',
          role,
          district,
          department,
          user: { name, email, designation }
        });
      },

      signInStartup: ({ email, name, company, designation }) => {
        set({
          authenticated: true,
          loginType: 'startup',
          role: 'startup',
          user: { name, email, company, designation }
        });
      },

      publicView: () => {
        set({
          authenticated: true,
          loginType: 'public',
          role: 'public',
          user: { name: 'Public Viewer', email: '' }
        });
      },

      signOut: () => set({
        authenticated: false,
        loginType: null,
        role: null,
        user: null,
        district: null,
        department: null
      }),

      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      toggleLang: () => set(s => ({ lang: s.lang === 'EN' ? 'हिंदी' : 'EN' }))
    }),
    { name: 'udbhav.session.v1' }
  )
);