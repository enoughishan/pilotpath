import React, { useEffect, useMemo, useState } from 'react'
import { DocumentView } from '@/components/DocumentView'
import { db } from '@/mock/db'
import type { Template } from '@/mock/schema'
import { TEMPLATE_CATALOGUE } from '@/features/templates/catalogue'
import { Download, FileText, Filter, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { clsx } from 'clsx'

export const TemplateLibrary: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedId, setSelectedId] = useState<string>(TEMPLATE_CATALOGUE[0].id)
  const [category, setCategory] = useState<string>('all')

  useEffect(() => {
    let active = true
    db.templates.toArray().then((list) => {
      if (!active) return
      setTemplates(list.length ? list : TEMPLATE_CATALOGUE.map((t) => ({
        id: t.id,
        name: t.name,
        kind: t.kind,
        version: t.version,
        fields: t.fields,
        body: t.body,
      })))
    })
    return () => {
      active = false
    }
  }, [])

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(TEMPLATE_CATALOGUE.map((t) => t.category)))],
    []
  )

  const enriched = useMemo(() => {
    return TEMPLATE_CATALOGUE.filter((t) => category === 'all' || t.category === category).map((cat) => {
      const row = templates.find((x) => x.id === cat.id)
      return { ...cat, version: row?.version ?? cat.version, name: row?.name ?? cat.name, body: row?.body || cat.body }
    })
  }, [templates, category])

  const selected = enriched.find((t) => t.id === selectedId) ?? enriched[0]

  const paragraphs = selected.body.split(/\n\n/)

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--primary)] mb-1">
            Standard instruments
          </p>
          <h1 className="text-2xl font-bold font-heading text-[var(--ink)]">
            Challenge, contract and procurement templates
          </h1>
          <p className="text-sm text-[var(--ink-2)] mt-1 max-w-2xl">
            Departments start from these instruments so problem statements, evaluation, pilots, data/IP, cyber, risk and scale-up remain consistent and auditable.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--ink-3)]">
          <Shield className="w-3.5 h-3.5" />
          Illustrative clauses — confirm with legal cell
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={clsx(
              'px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer',
              category === c
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-[var(--surface)] text-[var(--ink-2)] border-[var(--line)] hover:border-[var(--line-strong)]'
            )}
          >
            {c === 'all' ? 'All templates' : c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-2">
          {enriched.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              className={clsx(
                'w-full text-left p-4 rounded-[var(--radius-lg)] border cursor-pointer transition-colors',
                selected?.id === t.id
                  ? 'bg-[var(--primary-tint)] border-[var(--primary)]'
                  : 'bg-[var(--surface)] border-[var(--line)] hover:border-[var(--line-strong)]'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 shrink-0 text-[var(--primary)]" />
                  <span className="font-heading font-bold text-sm text-[var(--ink)] leading-snug">{t.name}</span>
                </div>
                <span className="font-mono text-[10px] text-[var(--ink-3)] shrink-0">v{t.version}</span>
              </div>
              <p className="text-[12px] text-[var(--ink-2)] mt-2 leading-relaxed">{t.summary}</p>
              <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[var(--ink-3)]">{t.category}</div>
            </button>
          ))}
        </div>

        {selected && (
          <div className="lg:col-span-8 space-y-4">
            <div className="card p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-heading font-bold text-lg text-[var(--ink)]">{selected.name}</h2>
                <p className="text-xs text-[var(--ink-2)] mt-0.5">{selected.summary}</p>
              </div>
              <button
                onClick={() =>
                  toast.message('PDF export is simulated in this prototype', {
                    description: `${selected.name} v${selected.version} would download as a controlled form.`,
                  })
                }
                className="btn-primary"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selected.clauses.map((c) => (
                <span key={c} className="badge badge-blue">
                  <Filter className="w-3 h-3" />
                  {c}
                </span>
              ))}
            </div>

            <DocumentView title={selected.name} version={selected.version} lastUpdated="Sep 2026">
              {paragraphs.map((block) => (
                <p key={block.slice(0, 40)} className="whitespace-pre-line">
                  {block}
                </p>
              ))}
            </DocumentView>
          </div>
        )}
      </div>
    </div>
  )
}
