import React, { useState } from 'react'
import {
  Clock,
  RotateCcw,
  UserCheck,
  ShieldCheck,
  Languages,
  X,
  Inbox,
  Wand2,
} from 'lucide-react'
import { useDemoStore } from '@/mock/demoClock'
import { seedDatabase } from '@/mock/seed'
import { db } from '@/mock/db'
import { verifyChain } from '@/logic/auditChain'
import { simulateApplicationsArriving, fillStageWithSampleData } from '@/mock/demoShortcuts'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'

interface DemoPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const DemoPanel: React.FC<DemoPanelProps> = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation()
  const {
    currentDateStr,
    activeRole,
    language,
    errorInjectionEnabled,
    slowNetworkEnabled,
    advanceDays,
    setActiveRole,
    setLanguage,
    toggleErrorInjection,
    toggleSlowNetwork,
  } = useDemoStore()

  const [auditMessage, setAuditMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const handleRoleChange = (role: typeof activeRole) => {
    setActiveRole(role)
  }

  const handleLanguageToggle = (lang: 'en' | 'hi') => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
  }

  const handleResetData = async () => {
    if (confirm('Reset all demo data back to original seeded state?')) {
      await seedDatabase(true)
      window.location.reload()
    }
  }

  const handleVerifyChain = async () => {
    const events = await db.auditEvents.toArray()
    const res = await verifyChain(events)
    if (res.ok) {
      setAuditMessage(`Audit chain intact: ${res.count} events verified.`)
    } else {
      setAuditMessage(`Chain verification FAILED at event ${res.brokenAt}!`)
    }
  }

  const handleTamperChain = async () => {
    const events = await db.auditEvents.toArray()
    if (events.length > 0) {
      events[0].action = 'TAMPERED_ACTION'
      await db.auditEvents.put(events[0])
      setAuditMessage('Tampered with first audit event action. Run "Verify chain" to detect.')
    }
  }

  const handleSimulateApplications = async () => {
    const message = await simulateApplicationsArriving()
    setAuditMessage(message)
  }

  const handleFillStage = async () => {
    const message = await fillStageWithSampleData()
    setAuditMessage(message)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] p-6 max-w-lg w-full space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
          <div className="flex items-center space-x-2">
            <span className="font-heading font-bold text-lg text-[var(--ink)]">
              Demo Controls (Simulated)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--marker)] text-[var(--ink)] font-bold">
              PROTOTYPE
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close demo controls"
            className="p-1 rounded-[var(--radius-sm)] hover:bg-[var(--sunken)] text-[var(--ink-2)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona Switcher */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--ink-2)] flex items-center space-x-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Switch Role Persona</span>
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs font-medium">
            {[
              { role: 'officer', label: 'Officer (Meera)' },
              { role: 'evaluator', label: 'Evaluator (Arvind)' },
              { role: 'startup', label: 'Startup (Sana)' },
              { role: 'validator', label: 'Validator (Nandini)' },
              { role: 'finance', label: 'Finance (Rakesh)' },
              { role: 'admin', label: 'Admin (Farah)' },
            ].map((p) => (
              <button
                key={p.role}
                onClick={() => handleRoleChange(p.role as Parameters<typeof handleRoleChange>[0])}
                className={clsx(
                  'p-2 rounded-[var(--radius-sm)] border text-left cursor-pointer transition-colors',
                  activeRole === p.role
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                    : 'bg-[var(--sunken)] text-[var(--ink)] border-[var(--line)] hover:bg-[var(--surface)]'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Clock */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--ink-2)] flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Virtual Demo Clock: <strong className="text-[var(--ink)]">{currentDateStr}</strong></span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => advanceDays(1)}
              className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--sunken)] cursor-pointer"
            >
              +1 Day
            </button>
            <button
              onClick={() => advanceDays(7)}
              className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--sunken)] cursor-pointer"
            >
              +7 Days
            </button>
            <button
              onClick={() => advanceDays(30)}
              className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--line-strong)] bg-[var(--surface)] hover:bg-[var(--sunken)] cursor-pointer"
            >
              +30 Days
            </button>
          </div>
        </div>

        {/* Simulation Tools */}
        <div className="space-y-2 border-t border-[var(--line)] pt-4">
          <label className="text-xs font-semibold text-[var(--ink-2)] flex items-center space-x-1">
            <Wand2 className="w-3.5 h-3.5" />
            <span>Simulation Tools</span>
          </label>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={handleSimulateApplications}
              className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--marker-tint)] text-[var(--ink)] border border-[var(--marker)] font-semibold cursor-pointer flex items-center space-x-1"
            >
              <Inbox className="w-3 h-3" />
              <span>Simulate applications arriving</span>
            </button>
            <button
              onClick={handleFillStage}
              className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--go-tint)] text-[var(--go)] border border-[var(--go)] font-semibold cursor-pointer flex items-center space-x-1"
            >
              <Wand2 className="w-3 h-3" />
              <span>Fill this stage with sample data</span>
            </button>
          </div>
        </div>

        {/* Audit & Data Tools */}
        <div className="space-y-2 border-t border-[var(--line)] pt-4">
          <label className="text-xs font-semibold text-[var(--ink-2)] flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit & System Tools</span>
          </label>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={handleVerifyChain}
              className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--primary-tint)] text-[var(--primary-strong)] border border-[var(--primary)] font-semibold cursor-pointer"
            >
              Verify Audit Chain
            </button>
            <button
              onClick={handleTamperChain}
              className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--stop-tint)] text-[var(--stop)] border border-[var(--stop)] font-semibold cursor-pointer"
            >
              Tamper Audit Event
            </button>
            <button
              onClick={handleResetData}
              className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--sunken)] text-[var(--ink)] border border-[var(--line)] font-semibold cursor-pointer flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
          {auditMessage && (
            <div className="text-xs p-2 rounded bg-[var(--sunken)] text-[var(--ink)] font-mono mt-2">
              {auditMessage}
            </div>
          )}
        </div>

        {/* Network & Language Toggles */}
        <div className="flex items-center justify-between border-t border-[var(--line)] pt-4 text-xs">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={slowNetworkEnabled}
                onChange={toggleSlowNetwork}
                className="rounded text-[var(--primary)]"
              />
              <span>Slow Network</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={errorInjectionEnabled}
                onChange={toggleErrorInjection}
                className="rounded text-[var(--stop)]"
              />
              <span>Inject 3% Errors</span>
            </label>
          </div>
          <div className="flex items-center space-x-1">
            <Languages className="w-4 h-4 text-[var(--ink-2)]" />
            <button
              onClick={() => handleLanguageToggle('en')}
              className={clsx('px-2 py-1 rounded text-xs font-bold', language === 'en' ? 'bg-[var(--primary)] text-white' : 'text-[var(--ink-2)]')}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageToggle('hi')}
              className={clsx('px-2 py-1 rounded text-xs font-bold', language === 'hi' ? 'bg-[var(--primary)] text-white' : 'text-[var(--ink-2)]')}
            >
              हि
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
