import React, { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { useNavigate } from 'react-router-dom'
import { Search, FolderCheck, Building2, Users, FileText, Sparkles } from 'lucide-react'
import { useDemoStore } from '@/mock/demoClock'

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { advanceDays, setActiveRole } = useDemoStore()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  if (!open) return null

  const runCommand = (action: () => void) => {
    setOpen(false)
    action()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-24 p-4">
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-lg)] shadow-2xl max-w-xl w-full overflow-hidden">
        <Command label="Global Command Menu">
          <div className="flex items-center px-4 border-b border-[var(--line)]">
            <Search className="w-4 h-4 text-[var(--ink-3)] mr-2 shrink-0" />
            <Command.Input
              placeholder="Search challenges, startups, templates, or run actions... (Esc to close)"
              className="w-full py-3.5 bg-transparent text-sm text-[var(--ink)] focus:outline-none"
            />
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-2 text-xs">
            <Command.Empty className="p-4 text-center text-[var(--ink-3)]">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation & Shortcuts" className="text-[var(--ink-2)] font-semibold px-2 py-1">
              <Command.Item
                onSelect={() => runCommand(() => navigate('/app/pathway'))}
                className="flex items-center space-x-2 p-2 rounded-[var(--radius-sm)] hover:bg-[var(--sunken)] cursor-pointer text-[var(--ink)]"
              >
                <FolderCheck className="w-4 h-4 text-[var(--primary)]" />
                <span>Officer Pathway Board</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/app/challenges/CH-014?tab=overview'))}
                className="flex items-center space-x-2 p-2 rounded-[var(--radius-sm)] hover:bg-[var(--sunken)] cursor-pointer text-[var(--ink)]"
              >
                <Building2 className="w-4 h-4 text-[var(--primary)]" />
                <span>CH-014 Water Loss Reduction (Hero Challenge)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate('/app/challenges/new'))}
                className="flex items-center space-x-2 p-2 rounded-[var(--radius-sm)] hover:bg-[var(--sunken)] cursor-pointer text-[var(--ink)]"
              >
                <Sparkles className="w-4 h-4 text-[var(--marker)]" />
                <span>Create New Challenge</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Role Switching" className="text-[var(--ink-2)] font-semibold px-2 py-1 border-t border-[var(--line)] pt-2">
              <Command.Item
                onSelect={() => runCommand(() => setActiveRole('officer'))}
                className="flex items-center space-x-2 p-2 rounded-[var(--radius-sm)] hover:bg-[var(--sunken)] cursor-pointer text-[var(--ink)]"
              >
                <Users className="w-4 h-4 text-[var(--primary)]" />
                <span>Switch Role to Officer (Meera Kulkarni)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => setActiveRole('evaluator'))}
                className="flex items-center space-x-2 p-2 rounded-[var(--radius-sm)] hover:bg-[var(--sunken)] cursor-pointer text-[var(--ink)]"
              >
                <Users className="w-4 h-4 text-[var(--marker)]" />
                <span>Switch Role to Evaluator (Dr. Arvind Rao)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => setActiveRole('startup'))}
                className="flex items-center space-x-2 p-2 rounded-[var(--radius-sm)] hover:bg-[var(--sunken)] cursor-pointer text-[var(--ink)]"
              >
                <Users className="w-4 h-4 text-[var(--go)]" />
                <span>Switch Role to Startup Founder (Sana Iqbal)</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Demo Actions" className="text-[var(--ink-2)] font-semibold px-2 py-1 border-t border-[var(--line)] pt-2">
              <Command.Item
                onSelect={() => runCommand(() => advanceDays(7))}
                className="flex items-center space-x-2 p-2 rounded-[var(--radius-sm)] hover:bg-[var(--sunken)] cursor-pointer text-[var(--ink)]"
              >
                <FileText className="w-4 h-4 text-[var(--primary)]" />
                <span>Advance Virtual Clock +7 Days</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
