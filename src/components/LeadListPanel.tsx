import { useEffect, useMemo, useState } from 'react'
import Icon from './Icon.tsx'
import type { AuthUser, Lead, LeadFilters, PaginationMeta } from '../types/types.ts'
import {
  formatDateTime,
  formatLeadReceived,
  formatTime,
  getPayloadEntries,
  isFreshLead,
} from '../utils/format.ts'

interface LeadListPanelProps {
  activeUser: AuthUser
  availableClients: Array<{ key: string; label: string }>
  filters: LeadFilters
  isLoading: boolean
  onFilterChange: (next: LeadFilters) => void
  onLeadOpen: (leadId: number) => void
  onLeadSelect: (leadId: number) => void
  onPageChange: (page: number) => void
  pagination: PaginationMeta | null
  previewLead: Lead | null
  selectedLeadId: number | null
  visibleLeads: Lead[]
}

function FilterChip({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) {
  return (
    <label className="inline-flex items-center gap-1.75 border border-(--line) rounded-[20px] bg-(--surface) text-(--ink) px-2.5 py-1.5 text-[12px]">
      <span className="text-(--ink-faint) font-mono text-[10.5px] uppercase tracking-[0.6px]">{label}</span>
      {children}
    </label>
  )
}

function PreviewCode({ lead }: { lead: Lead }) {
  const entries = useMemo(() => getPayloadEntries(lead.rawPayload).slice(0, 5), [lead.rawPayload])
  const fallbackEntries = entries.length
    ? entries
    : [
        ['name', lead.name ?? ''],
        ['email', lead.email ?? ''],
        ['message', lead.message ?? ''],
        ['source', lead.source ?? ''],
        ['webhook_event_id', lead.webhookEventId ?? `evt_${lead.id}`],
      ]

  return (
    <pre className="min-h-0 flex-1 overflow-auto border border-(--line) rounded-md bg-(--code-bg) p-3 text-(--ink-muted) font-mono text-[11.5px] leading-[1.65]">
      <span>{'{'}</span>
      {fallbackEntries.map(([key, value], index) => (
        <span key={key} className="block pl-3.5">
          <span className="code-key">"{key}"</span>:{' '}
          <span className="code-value">"{String(value)}"</span>
          {index < fallbackEntries.length - 1 ? ',' : ''}
        </span>
      ))}
      <span>{'}'}</span>
    </pre>
  )
}

function LeadPreview({
  lead,
  onLeadOpen,
}: {
  lead: Lead
  onLeadOpen: (leadId: number) => void
}) {
  return (
    <aside className="min-h-0 flex flex-col bg-(--surface)">
      <div className="flex items-center justify-between gap-3 px-5.5 py-4">
        <div>
          <p className="font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-muted)">
            Lead · #{lead.id}
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-(--line) bg-(--surface) text-(--ink-muted) cursor-pointer px-2 py-1 text-[11.5px] transition-all duration-180 ease-in-out"
          onClick={() => onLeadOpen(lead.id)}
          type="button"
        >
          Open detail <Icon name="external" size={11} />
        </button>
      </div>

      <div className="flex flex-col gap-2.5 border-t border-(--line) px-5.5 py-4">
        <h3 className="text-[20px] font-medium tracking-[-0.3px]">{lead.name ?? 'Unnamed lead'}</h3>
        <p className="font-mono tabular-nums text-[13px]">{lead.email ?? '(no email provided)'}</p>
        <div className="flex flex-wrap gap-1.5">
          {isFreshLead(lead) ? (
            <span className="inline-flex items-center gap-1 rounded border border-(--line) bg-(--signal-bg) text-(--signal) px-1.75 py-0.75 text-[10.5px] uppercase tracking-[0.8px]">
              new · {formatLeadReceived(lead)}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 rounded border border-(--line) bg-(--surface-2) text-(--ink-muted) px-1.75 py-0.75 text-[10.5px] uppercase tracking-[0.8px]">
            {lead.source ?? 'unknown'}
          </span>
          <span className="inline-flex items-center gap-1 rounded border border-(--line) bg-(--surface-2) text-(--ink-muted) px-1.75 py-0.75 text-[10.5px] uppercase tracking-[0.8px]">
            {lead.clientKey}
          </span>
        </div>
      </div>

      <section className="border-t border-(--line) px-5.5 py-4">
        <p className="font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-muted) mb-2">
          Message
        </p>
        <p className="text-[13.5px] leading-[1.55] text-(--ink) text-pretty">
          {lead.message ?? 'No message stored.'}
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3.5 border-t border-(--line) px-5.5 py-4">
        <div>
          <p className="font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-muted) mb-1">Client</p>
          <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] block">{lead.clientName}</strong>
        </div>
        <div>
          <p className="font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-muted) mb-1">Key</p>
          <strong className="font-mono tabular-nums overflow-hidden text-ellipsis whitespace-nowrap text-[13px] block">{lead.clientKey}</strong>
        </div>
        <div>
          <p className="font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-muted) mb-1">Received</p>
          <strong className="font-mono tabular-nums overflow-hidden text-ellipsis whitespace-nowrap text-[13px] block">{formatDateTime(lead.createdAt)}</strong>
        </div>
        <div>
          <p className="font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-muted) mb-1">Source</p>
          <strong className="font-mono tabular-nums overflow-hidden text-ellipsis whitespace-nowrap text-[13px] block">{lead.source ?? 'unknown'}</strong>
        </div>
      </section>

      <section className="min-h-0 flex-1 flex flex-col border-t border-(--line) px-5.5 py-4">
        <div className="flex items-center justify-between gap-3 mb-2">
          <p className="font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-muted)">
            Payload · preview
          </p>
          <span className="border-0 bg-transparent text-(--accent) p-0 text-[11.5px] font-mono cursor-default">
            view full →
          </span>
        </div>
        <PreviewCode lead={lead} />
      </section>
    </aside>
  )
}

function LeadListPanel({
  activeUser,
  availableClients,
  filters,
  isLoading,
  onFilterChange,
  onLeadOpen,
  onLeadSelect,
  onPageChange,
  pagination,
  previewLead,
  selectedLeadId,
  visibleLeads,
}: LeadListPanelProps) {
  const [emailDraft, setEmailDraft] = useState(filters.email)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (emailDraft !== filters.email) {
        onFilterChange({ ...filters, email: emailDraft, page: 1 })
      }
    }, 250)

    return () => window.clearTimeout(timeout)
  }, [emailDraft, filters, onFilterChange])

  const preview = previewLead ?? visibleLeads.find((lead) => lead.id === selectedLeadId) ?? visibleLeads[0] ?? null

  const isAdmin = activeUser.role === 'admin'
  const tableColsClass = isAdmin
    ? 'grid-cols-[68px_1.3fr_1.1fr_1.5fr_110px]'
    : 'grid-cols-[68px_1.3fr_2fr_110px]'

  return (
    <section className="flex flex-col gap-4.5 min-h-0">
      <div className="flex items-center gap-2.5 border-b border-(--line) bg-(--surface) px-7 py-3 -mt-5.5 -mx-7">
        {isAdmin ? (
          <FilterChip label="Client">
            <select
              value={filters.clientId}
              onChange={(event) =>
                onFilterChange({ ...filters, clientId: event.target.value, page: 1 })
              }
            >
              <option value="">All clients</option>
              {availableClients.map((client) => (
                <option key={client.key} value={client.key}>
                  {client.label}
                </option>
              ))}
            </select>
          </FilterChip>
        ) : (
          <div className="inline-flex items-center gap-1.5 border border-(--line) rounded-[20px] px-2.5 py-1.5 font-mono text-[11.5px] bg-(--accent-soft) text-(--accent-ink)">
            <span className="w-1.5 h-1.5 rounded-full bg-(--signal)" />
            <span className="text-[10.5px] uppercase tracking-[0.6px]">Client</span>
            <span>{activeUser.clients[0]?.name ?? 'Assigned client'}</span>
          </div>
        )}

        <FilterChip label="Email">
          <input
            placeholder="any"
            type="email"
            value={emailDraft}
            onChange={(event) => setEmailDraft(event.target.value)}
          />
        </FilterChip>

        <FilterChip label="From">
          <input
            type="date"
            value={filters.from}
            onChange={(event) => onFilterChange({ ...filters, from: event.target.value, page: 1 })}
          />
        </FilterChip>

        <FilterChip label="To">
          <input
            type="date"
            value={filters.to}
            onChange={(event) => onFilterChange({ ...filters, to: event.target.value, page: 1 })}
          />
        </FilterChip>

        <div className="ml-auto inline-flex items-center gap-3 text-(--ink-faint) text-[12px]">
          <span>
            <span className="font-mono tabular-nums text-(--ink)">{pagination?.total ?? visibleLeads.length}</span>{' '}
            leads · page{' '}
            <span className="font-mono tabular-nums text-(--ink)">{pagination?.currentPage ?? 1}</span> /{' '}
            {pagination?.lastPage ?? 1}
          </span>
          <div className="inline-flex gap-0.5">
            <button
              className="inline-flex items-center justify-center rounded-md border border-(--line) bg-(--surface) text-(--ink-muted) cursor-pointer w-8 h-8 p-0 transition-all duration-180 ease-in-out disabled:cursor-not-allowed disabled:opacity-55"
              disabled={(pagination?.currentPage ?? 1) <= 1}
              onClick={() => onPageChange((pagination?.currentPage ?? 1) - 1)}
              type="button"
            >
              <Icon name="chevronL" size={13} />
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md border border-(--line) bg-(--surface) text-(--ink-muted) cursor-pointer w-8 h-8 p-0 transition-all duration-180 ease-in-out disabled:cursor-not-allowed disabled:opacity-55"
              disabled={(pagination?.currentPage ?? 1) >= (pagination?.lastPage ?? 1)}
              onClick={() => onPageChange((pagination?.currentPage ?? 1) + 1)}
              type="button"
            >
              <Icon name="chevron" size={13} />
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 grid grid-cols-[1fr_440px] max-[1220px]:grid-cols-1">
        <section className="min-h-0 flex flex-col border-r border-(--line)">
          <div
            className={`grid ${tableColsClass} gap-3 items-center border-b border-(--line) bg-(--surface) text-(--ink-faint) px-5.5 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.8px]`}
          >
            <span>ID</span>
            <span>Lead</span>
            {isAdmin ? <span>Client</span> : null}
            <span>Message</span>
            <span className="text-right">Received</span>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            {visibleLeads.map((lead) => {
              const selected = lead.id === selectedLeadId
              return (
                <button
                  key={lead.id}
                  className={`grid ${tableColsClass} gap-3 items-center w-full border-0 border-b border-(--line) cursor-pointer text-(--ink) text-left transition-all duration-180 ${selected ? 'border-l-2 border-l-(--accent) bg-(--surface) pl-5 pr-5.5 py-3.5' : 'bg-transparent px-5.5 py-3.5'}`}
                  onClick={() => onLeadSelect(lead.id)}
                  type="button"
                >
                  <span className="font-mono tabular-nums">#{lead.id}</span>
                  <span className="min-w-0 inline-flex items-center gap-2">
                    {isFreshLead(lead) ? (
                      <i className="w-1.5 h-1.5 shrink-0 rounded-full bg-(--signal)" />
                    ) : null}
                    <span className="flex flex-col min-w-0">
                      <strong className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {lead.name ?? 'Unnamed lead'}
                      </strong>
                      <span className="font-mono tabular-nums text-(--ink-faint) text-[11.5px]">
                        {lead.email ?? '—'}
                      </span>
                    </span>
                  </span>
                  {isAdmin ? (
                    <span className="flex flex-col min-w-0">
                      <strong className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {lead.clientName}
                      </strong>
                      <span className="font-mono tabular-nums text-(--ink-faint) text-[11.5px]">
                        {lead.clientKey}
                      </span>
                    </span>
                  ) : null}
                  <span className="overflow-hidden text-(--ink-muted) text-[13px] text-ellipsis whitespace-nowrap">
                    {lead.message ?? 'No message stored.'}
                  </span>
                  <span className="flex flex-col items-end gap-0.5">
                    <span className="font-mono tabular-nums">{formatLeadReceived(lead)}</span>
                    <span className="font-mono tabular-nums text-(--ink-faint) text-[11.5px]">
                      {formatTime(lead.createdAt)}
                    </span>
                  </span>
                </button>
              )
            })}

            {isLoading ? (
              <div className="flex flex-col gap-1.5 border border-(--line) rounded-[10px] bg-(--surface) p-6 text-(--ink-muted) m-[18px_22px]">
                <h3 className="text-(--ink) text-lg font-medium">Loading leads…</h3>
                <p>Waiting for `/api/leads`.</p>
              </div>
            ) : null}

            {!isLoading && !visibleLeads.length ? (
              <div className="flex flex-col gap-1.5 border border-(--line) rounded-[10px] bg-(--surface) p-6 text-(--ink-muted) m-[18px_22px]">
                <h3 className="text-(--ink) text-lg font-medium">No leads in this scope</h3>
                <p>Adjust the filters or check that the backend returned records.</p>
              </div>
            ) : null}
          </div>
        </section>

        {preview ? <LeadPreview lead={preview} onLeadOpen={onLeadOpen} /> : null}
      </div>
    </section>
  )
}

export default LeadListPanel
