import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  FolderCheck,
  Building2,
  FileText,
  TrendingUp,
  Search,
  Bell,
  ChevronDown,
  RotateCcw,
  Compass,
  CheckSquare,
  Wallet,
  ShieldAlert,
  Sliders,
  Sun,
  Moon,
} from 'lucide-react'
import { useDemoStore } from '@/mock/demoClock'
import { CommandPalette } from '@/components/CommandPalette'
import { DemoPanel } from '@/components/DemoPanel'
import { GuidedTour } from '@/components/GuidedTour'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'
import { db } from '@/mock/db'
import type { Notification } from '@/mock/schema'

const ROLE_META = {
  officer:   { label: 'Officer',    emoji: '🏛️', color: '#2563EB', home: '/app/pathway' },
  evaluator: { label: 'Evaluator',  emoji: '⚖️', color: '#D97706', home: '/app/evaluator/queue' },
  startup:   { label: 'Startup',    emoji: '🚀', color: '#059669', home: '/app/startup/home' },
  validator: { label: 'Validator',  emoji: '🔬', color: '#DC2626', home: '/app/validator/assignments' },
  finance:   { label: 'Finance',    emoji: '💳', color: '#475569', home: '/app/finance/payments' },
  admin:     { label: 'Admin',      emoji: '⚙️', color: '#7C3AED', home: '/app/admin/overview' },
}

export const AppLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const { activeRole, currentDateStr, setActiveRole, setLanguage, language } = useDemoStore()
  const [demoPanelOpen, setDemoPanelOpen] = useState(false)
  const [tourActive, setTourActive] = useState(false)
  const [personaOpen, setPersonaOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light'
  )

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
  }

  // Personas
  const personas = [
    { role: 'officer',   name: 'Meera Kulkarni',  title: 'Joint Director' },
    { role: 'evaluator', name: 'Dr. Arvind Rao',  title: 'Domain Expert' },
    { role: 'startup',   name: 'Sana Iqbal',       title: 'Startup Founder' },
    { role: 'validator', name: 'Prof. Nandini Bose',title: 'Test Lab Validator' },
    { role: 'finance',   name: 'Rakesh Menon',     title: 'Accounts Officer' },
    { role: 'admin',     name: 'Farah Sheikh',     title: 'Innovation Cell Admin' },
  ]
  const currentPersona = personas.find((p) => p.role === activeRole) || personas[0]
  const roleMeta = ROLE_META[activeRole as keyof typeof ROLE_META] || ROLE_META.officer

  useEffect(() => {
    db.notifications.toArray().then(setNotifications)
  }, [])

  const unread = notifications.filter((n) => !n.readAt).length

  const switchPersona = (role: typeof activeRole) => {
    setActiveRole(role)
    setPersonaOpen(false)
    const home = ROLE_META[role]?.home ?? '/app/pathway'
    navigate(home)
  }

  const railItemsByRole: Record<string, Array<{ path: string; label: string; icon: React.FC<{ className?: string }> }>> = {
    officer: [
      { path: '/app/pathway', label: 'Pathway', icon: FolderCheck },
      { path: '/app/challenges/CH-014?tab=overview', label: 'Case file', icon: Building2 },
      { path: '/app/documents', label: 'Templates', icon: FileText },
      { path: '/app/demand', label: 'Demand', icon: TrendingUp },
    ],
    evaluator: [
      { path: '/app/evaluator/queue', label: 'Queue', icon: CheckSquare },
      { path: '/app/admin/rubrics', label: 'Rubrics', icon: Sliders },
    ],
    startup: [
      { path: '/app/startup/home', label: 'Home', icon: FolderCheck },
      { path: '/app/startup/opportunities', label: 'Explore', icon: Building2 },
      { path: '/app/startup/payments', label: 'Payments', icon: Wallet },
    ],
    validator: [
      { path: '/app/validator/assignments', label: 'Work', icon: CheckSquare },
    ],
    finance: [
      { path: '/app/finance/payments', label: 'Payments', icon: Wallet },
    ],
    admin: [
      { path: '/app/admin/overview', label: 'Rules', icon: Sliders },
      { path: '/app/documents', label: 'Templates', icon: FileText },
      { path: '/app/demand', label: 'Demand', icon: TrendingUp },
      { path: '/app/challenges/CH-014?tab=audit', label: 'Audit', icon: ShieldAlert },
    ],
  }

  const railItems = railItemsByRole[activeRole] || railItemsByRole.officer

  return (
    <div className="min-h-screen flex flex-col bg-[var(--ground)] text-[var(--ink)]">
      <CommandPalette />
      <DemoPanel isOpen={demoPanelOpen} onClose={() => setDemoPanelOpen(false)} />
      <GuidedTour isActive={tourActive} onClose={() => setTourActive(false)} />

      {/* ── TOP HEADER ── */}
      <header className="h-14 sticky top-0 z-30 bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--line)] shadow-[var(--shadow-xs)]">
        <div className="h-full px-4 flex items-center justify-between gap-4">

          {/* Left: Logo + Search */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-md grad-brand flex items-center justify-center shadow-[var(--shadow-primary)]">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13V5l5-3 5 3v8" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 13V9h4v4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="font-heading font-bold text-[16px] text-[var(--ink)] hidden sm:block">Pilot Bridge</span>
            </button>

            {/* Search */}
            <button
              onClick={() => {
                const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
                document.dispatchEvent(event)
              }}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] bg-[var(--sunken)] border border-[var(--line)] text-xs text-[var(--ink-3)] hover:border-[var(--line-strong)] hover:text-[var(--ink-2)] cursor-pointer transition-all max-w-xs w-full"
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="flex-1 text-left">{t('shell.searchPlaceholder')}</span>
              <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--line)] text-[var(--ink-3)]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Demo clock */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--sunken)] border border-[var(--line)] text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--go)] animate-pulse" />
              <span className="text-[var(--ink-3)] font-medium">{t('shell.demoClock')}:</span>
              <span className="font-bold font-mono text-[var(--ink)]">{currentDateStr}</span>
            </div>

            {/* Language */}
            <div className="flex items-center rounded-[var(--radius-sm)] border border-[var(--line)] overflow-hidden text-[11px]">
              <button
                onClick={() => { setLanguage('en'); i18n.changeLanguage('en') }}
                className={clsx('px-2 py-1 font-bold cursor-pointer transition-colors', language === 'en' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] text-[var(--ink-3)] hover:bg-[var(--sunken)]')}
              >EN</button>
              <button
                onClick={() => { setLanguage('hi'); i18n.changeLanguage('hi') }}
                className={clsx('px-2 py-1 font-bold cursor-pointer transition-colors', language === 'hi' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] text-[var(--ink-3)] hover:bg-[var(--sunken)]')}
              >हि</button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="p-1.5 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--sunken)] text-[var(--ink-2)] hover:text-[var(--ink)] cursor-pointer transition-all"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[var(--marker)]" />}
            </button>

            {/* Bell */}
            <div className="relative">
              <button
                onClick={() => { setNotesOpen((o) => !o); setPersonaOpen(false) }}
                className="relative p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--sunken)] text-[var(--ink-2)] hover:text-[var(--ink)] cursor-pointer transition-colors"
                title={t('shell.notifications')}
              >
                <Bell className="w-4 h-4" />
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--marker)]" />
                )}
              </button>
              {notesOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xl)] p-2 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[var(--ink-3)] uppercase tracking-widest">
                    Inbox
                  </div>
                  {notifications.length === 0 && (
                    <div className="px-3 py-4 text-xs text-[var(--ink-3)]">No notices yet. Reset demo data if this is empty.</div>
                  )}
                  {notifications.slice(0, 6).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        setNotesOpen(false)
                        navigate(n.entityRef)
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-[var(--radius-md)] hover:bg-[var(--sunken)] cursor-pointer"
                    >
                      <div className="text-xs text-[var(--ink)] leading-snug">{n.text}</div>
                      <div className="text-[10px] text-[var(--ink-3)] mt-1">{n.kind} · {n.at.slice(0, 10)}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Persona switcher */}
            <div className="relative">
              <button
                onClick={() => { setPersonaOpen((o) => !o); setNotesOpen(false) }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--sunken)] cursor-pointer transition-colors"
              >
                <span className="text-lg leading-none">{roleMeta.emoji}</span>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-[var(--ink)] leading-none">{currentPersona.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-[var(--ink-3)] leading-none mt-0.5">{roleMeta.label}</div>
                </div>
                <ChevronDown className="w-3 h-3 text-[var(--ink-3)]" />
              </button>

              {personaOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] shadow-[var(--shadow-xl)] p-2 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold text-[var(--ink-3)] uppercase tracking-widest mb-1">
                  Switch Role Persona
                </div>
                {personas.map((p) => {
                  const meta = ROLE_META[p.role as keyof typeof ROLE_META]
                  return (
                    <button
                      key={p.role}
                      onClick={() => switchPersona(p.role as Parameters<typeof setActiveRole>[0])}
                      className={clsx(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] cursor-pointer text-left transition-colors',
                        activeRole === p.role
                          ? 'bg-[var(--primary-tint)] text-[var(--primary)]'
                          : 'hover:bg-[var(--sunken)] text-[var(--ink)]'
                      )}
                    >
                      <span className="text-lg leading-none">{meta.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate">{p.name}</div>
                        <div className="text-[10px] text-[var(--ink-3)]">{p.title}</div>
                      </div>
                      {activeRole === p.role && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT RAIL ── */}
        <aside className="w-16 bg-[var(--surface)] border-r border-[var(--line)] flex flex-col items-center py-3 gap-1 shrink-0 hidden sm:flex">
          {railItems.map((item) => {
            const Icon = item.icon
            const [pathOnly, query] = item.path.split('?')
            const isActive = query
              ? location.pathname === pathOnly && (location.search.includes(query) || (query.includes('overview') && location.pathname.startsWith('/app/challenges/') && !location.search.includes('audit')))
              : location.pathname === pathOnly || (pathOnly !== '/app/pathway' && location.pathname.startsWith(pathOnly))
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                title={item.label}
                className={clsx(
                  'relative w-full h-12 flex flex-col items-center justify-center gap-0.5 cursor-pointer rounded-none transition-all group',
                  isActive
                    ? 'text-[var(--primary)]'
                    : 'text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--sunken)]'
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-[var(--primary)] rounded-r-full shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                )}
                {/* Active bg */}
                {isActive && (
                  <span className="absolute inset-1 rounded-[var(--radius-sm)] bg-[var(--primary-tint)]" />
                )}
                <Icon className="w-4.5 h-4.5 relative z-10 transition-transform group-hover:scale-110 duration-200" />
                <span className="text-[10px] font-heading font-semibold leading-none relative z-10">{item.label}</span>
              </button>
            )
          })}
        </aside>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6 pb-20">
          <Outlet />
        </main>
      </div>

      {/* ── BOTTOM HONESTY FOOTER ── */}
      <footer className="h-9 bg-[var(--surface)] border-t border-[var(--line)] px-4 flex items-center justify-between text-xs text-[var(--ink-3)] z-20 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--marker)] animate-pulse" />
          <span className="font-medium">{t('shell.honestyLabel')}</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDemoPanelOpen(true)}
            className="hover:text-[var(--ink)] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Sliders className="w-3 h-3" />
            <span>Demo Controls</span>
          </button>
          <button
            onClick={async () => {
              if (confirm('Reset all demo data to seed state?')) {
                const { seedDatabase } = await import('@/mock/seed')
                await seedDatabase(true)
                window.location.reload()
              }
            }}
            className="hover:text-[var(--ink)] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('shell.resetDemoData')}</span>
          </button>
          <button
            onClick={() => setTourActive(true)}
            className="hover:text-[var(--ink)] flex items-center gap-1.5 cursor-pointer transition-colors"
            data-tour="take-tour-btn"
          >
            <Compass className="w-3 h-3" />
            <span>{t('shell.takeTour')}</span>
          </button>
        </div>
      </footer>
    </div>
  )
}
