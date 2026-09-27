import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { buildSeed } from '../data/seed.js';
import { uid } from '../utils/format.js';

export const useAppStore = create(
  persist(
    (set, get) => ({
      ...buildSeed(),

      find: (coll, id) => (get()[coll] || []).find(x => x.id === id),

      add: (coll, item) => {
        if (!item.id) item.id = uid(coll.slice(0, 2).toUpperCase());
        set((state) => ({ [coll]: [...(state[coll] || []), item] }));
        return item;
      },

      update: (coll, id, patch) => {
        set((state) => ({
          [coll]: (state[coll] || []).map(x => x.id === id ? { ...x, ...patch } : x)
        }));
      },

      remove: (coll, id) => {
        set((state) => ({ [coll]: (state[coll] || []).filter(x => x.id !== id) }));
      },

      reset: () => set(buildSeed()),

      logAudit: (event) => {
        const entry = { id: uid('AU'), ts: new Date().toISOString(), ...event };
        set((state) => ({ audit: [...state.audit, entry] }));
      },

      notify: (notif) => {
        const entry = { id: uid('NT'), ts: new Date().toISOString(), read: false, ...notif };
        set((state) => ({ notifications: [...state.notifications, entry] }));
      },

      markAllRead: () => {
        set((state) => ({ notifications: state.notifications.map(n => ({ ...n, read: true })) }));
      }
    }),
    { name: 'udbhav.store.v1' }
  )
);