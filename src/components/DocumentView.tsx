import React from 'react'

interface DocumentViewProps {
  title: string
  version?: string
  lastUpdated?: string
  children: React.ReactNode
}

export const DocumentView: React.FC<DocumentViewProps> = ({
  title,
  version,
  lastUpdated,
  children,
}) => {
  return (
    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-md)] p-8 max-w-[68ch] mx-auto shadow-xs">
      <div className="border-b border-[var(--line)] pb-4 mb-6">
        <h1 className="document-heading text-2xl text-[var(--ink)]">{title}</h1>
        {(version || lastUpdated) && (
          <div className="text-xs text-[var(--ink-3)] font-sans mt-1">
            {version && <span>Version {version}</span>}
            {version && lastUpdated && <span> • </span>}
            {lastUpdated && <span>Updated {lastUpdated}</span>}
          </div>
        )}
      </div>
      <div className="document-body space-y-4 text-[var(--ink)]">{children}</div>
    </div>
  )
}
