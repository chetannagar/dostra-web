import { useMemo, useState } from 'react'
import Icon from './Icon.tsx'
import type { Lead } from '../types/types.ts'
import { formatDateTime, getPayloadEntries, isFreshLead, stringifyPayload } from '../utils/format.ts'

interface LeadDetailCardProps {
  lead: Lead | null
  isLoading: boolean
  onBack: () => void
}

function Section({
  children,
  title,
  future,
}: {
  children: React.ReactNode
  title: string
  future?: boolean
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <p className="font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-muted)">
          {title}
        </p>
        {future ? (
          <span className="inline-flex items-center gap-1 rounded border border-(--line) px-1.75 py-0.75 font-mono text-[10.5px] uppercase tracking-[0.8px] text-(--ink-faint)">
            derived
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-2.5">{children}</div>
    </section>
  )
}

function TLItem({
  detail,
  isLast,
  label,
  timestamp,
}: {
  detail: string
  isLast?: boolean
  label: string
  timestamp: string
}) {
  return (
    <div className="flex gap-2.5">
      <div className="relative w-3 flex justify-center pt-1">
        <span className="relative z-10 w-1.75 h-1.75 rounded-full border-2 border-(--surface) bg-(--accent)" />
        {!isLast && (
          <span className="absolute top-3 -bottom-3.5 left-1/2 w-px bg-(--line)" />
        )}
      </div>
      <div className="min-w-0 flex-1 flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-3">
          <strong className="text-[12.5px] font-medium">{label}</strong>
          <span className="font-mono tabular-nums text-(--ink-faint) text-[11px]">{timestamp}</span>
        </div>
        <p className="font-mono tabular-nums text-(--ink-muted) text-[11px]">{detail}</p>
      </div>
    </div>
  )
}

function LeadDetailCard({ lead, isLoading, onBack }: LeadDetailCardProps) {
  const [payloadMode, setPayloadMode] = useState<'pretty' | 'raw'>('pretty')
  const [showToast, setShowToast] = useState(false)

  const payloadEntries = useMemo(() => getPayloadEntries(lead?.rawPayload ?? null), [lead?.rawPayload])

  if (isLoading) {
    return (
      <section className="flex flex-col gap-4.5 px-7 pt-5.5 pb-7 min-h-0">
        <div className="flex flex-col gap-1.5 border border-(--line) rounded-[10px] bg-(--surface) p-6 text-(--ink-muted)">
          <h3 className="text-(--ink) text-lg font-medium">Loading lead detail…</h3>
          <p>Fetching the latest record from `/api/leads/{'{id}'}`.</p>
        </div>
      </section>
    )
  }

  if (!lead) {
    return (
      <section className="flex flex-col gap-4.5 px-7 pt-5.5 pb-7 min-h-0">
        <div className="flex flex-col gap-1.5 border border-(--line) rounded-[10px] bg-(--surface) p-6 text-(--ink-muted)">
          <h3 className="text-(--ink) text-lg font-medium">Select a lead.</h3>
          <p>Lead details will appear here after you pick a record from the list.</p>
        </div>
      </section>
    )
  }

  const currentLead = lead
  const phone =
    typeof currentLead.rawPayload?.phone === 'string' && currentLead.rawPayload.phone
      ? currentLead.rawPayload.phone
      : 'No phone provided'

  async function handleCopyPayload() {
    await navigator.clipboard.writeText(stringifyPayload(currentLead.rawPayload))
    setShowToast(true)
    window.setTimeout(() => setShowToast(false), 1500)
  }

  return (
    <section className="flex flex-col gap-4.5 px-7 pt-5.5 pb-7 min-h-0">
      <div className="min-h-0 grid grid-cols-[1fr_420px] max-[1220px]:grid-cols-1">
        <div className="min-h-0 flex flex-col gap-4.5 overflow-auto pr-4.5 max-[1220px]:pr-0">

          <article className="border border-(--line) rounded-lg bg-(--surface) flex flex-col gap-3.5 px-5.5 py-5">
            <div className="flex items-center gap-2.5">
              <button
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-(--line) bg-(--surface) text-(--ink-muted) cursor-pointer px-2 py-1 text-[11.5px] transition-all duration-180 ease-in-out"
                onClick={onBack}
                type="button"
              >
                <Icon name="back" size={12} />
                All leads
              </button>
              <span className="font-mono tabular-nums text-(--ink-faint)">/ lead</span>
              <span className="font-mono tabular-nums">#{lead.id}</span>
              <div className="ml-auto flex items-center gap-1.5">
                {isFreshLead(lead) ? (
                  <span className="inline-flex items-center gap-1 rounded border border-(--line) bg-(--signal-bg) text-(--signal) px-1.75 py-0.75 text-[10.5px] uppercase tracking-[0.8px]">
                    new
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1 rounded border border-(--line) bg-(--surface-2) text-(--ink-muted) px-1.75 py-0.75 text-[10.5px] uppercase tracking-[0.8px]">
                  {lead.source ?? 'unknown'}
                </span>
              </div>
            </div>

            <div className="flex items-end justify-between gap-5">
              <div>
                <h1 className="text-[30px] font-medium tracking-[-0.7px] leading-[1.1]">
                  {lead.name ?? 'Unnamed lead'}
                </h1>
                <p className="font-mono tabular-nums flex items-center gap-2.5 mt-2 text-(--ink-muted) text-[12.5px]">
                  <span>{lead.email ?? 'No email provided'}</span>
                  <span className="text-(--ink-faint)">·</span>
                  <span>{phone}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-(--line) bg-(--surface) text-(--ink-muted) cursor-pointer px-2.75 py-2 text-[12.5px] transition-all duration-180 ease-in-out"
                  onClick={() => navigator.clipboard.writeText(lead.email ?? '')}
                  type="button"
                >
                  <Icon name="copy" size={13} />
                  Copy email
                </button>
                <a
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-(--ink) bg-(--ink) text-(--bg) cursor-pointer px-3.5 py-2.5 transition-all duration-180 ease-in-out"
                  href={lead.email ? `mailto:${lead.email}` : undefined}
                >
                  Reply via email <Icon name="external" size={12} />
                </a>
              </div>
            </div>
          </article>

          <article className="border border-(--line) rounded-lg bg-(--surface)">
            <div className="flex items-center justify-between gap-4 px-5.5 py-3.5">
              <p className="font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-muted)">
                Message
              </p>
            </div>
            <p className="text-[15px] leading-[1.6] text-(--ink) text-pretty px-5.5 pb-3.5">
              {lead.message ?? 'No message body was stored for this lead.'}
            </p>
          </article>

          <article className="border border-(--line) rounded-lg bg-(--surface) min-h-0 flex flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-(--line) px-5.5 py-3.5">
              <div>
                <h3 className="text-[13.5px] font-medium text-(--ink)">Raw payload</h3>
                <p className="mt-0.5 text-[11.5px] text-(--ink-faint)">
                  {payloadEntries.length} fields ·{' '}
                  {(stringifyPayload(lead.rawPayload).length / 1000).toFixed(1)}kb
                </p>
              </div>
              <div className="flex items-center gap-0.5 border border-(--line) rounded-md bg-(--surface-2) p-0.5">
                <button
                  className={`border-0 rounded cursor-pointer px-2.25 py-0.75 text-[11.5px] transition-all duration-180 ease-in-out ${payloadMode === 'pretty' ? 'bg-(--surface) text-(--ink) shadow-[var(--shadow-soft)]' : 'bg-transparent text-(--ink-muted)'}`}
                  onClick={() => setPayloadMode('pretty')}
                  type="button"
                >
                  Pretty
                </button>
                <button
                  className={`border-0 rounded cursor-pointer px-2.25 py-0.75 text-[11.5px] transition-all duration-180 ease-in-out ${payloadMode === 'raw' ? 'bg-(--surface) text-(--ink) shadow-[var(--shadow-soft)]' : 'bg-transparent text-(--ink-muted)'}`}
                  onClick={() => setPayloadMode('raw')}
                  type="button"
                >
                  Raw JSON
                </button>
                <button
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-(--line) bg-(--surface) text-(--ink-muted) cursor-pointer px-2 py-1 text-[11.5px] transition-all duration-180 ease-in-out"
                  onClick={handleCopyPayload}
                  type="button"
                >
                  <Icon name="copy" size={12} />
                  Copy
                </button>
              </div>
            </div>

            {payloadMode === 'pretty' ? (
              <div className="grid grid-cols-[200px_1fr] font-mono tabular-nums text-[12.5px]">
                {payloadEntries.map(([key, value], index) => (
                  <div key={key} className="contents">
                    <span
                      className={`border-b border-(--line) px-5.5 py-2.5 code-key whitespace-nowrap ${index % 2 === 0 ? 'bg-(--surface-2)' : 'bg-(--surface)'}`}
                    >
                      {key}
                    </span>
                    <span
                      className={`border-b border-(--line) px-5.5 py-2.5 overflow-hidden text-ellipsis whitespace-nowrap ${index % 2 === 0 ? 'bg-(--surface-2)' : 'bg-(--surface)'} ${value == null ? 'text-(--ink-faint) italic' : 'text-(--ink)'}`}
                    >
                      {value == null ? 'null' : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="overflow-auto m-0 border-t border-(--line) bg-(--code-bg) px-5.5 py-4 text-(--ink) font-mono tabular-nums text-[12px] leading-[1.65]">
                {stringifyPayload(lead.rawPayload)}
              </pre>
            )}
          </article>
        </div>

        <aside className="min-h-0 overflow-auto border-l border-(--line) bg-(--surface) px-5.5 py-5.5 flex flex-col gap-4.5 max-[1220px]:border-l-0 max-[1220px]:border-t max-[1220px]:border-(--line)">
          <Section title="Client attribution">
            <div className="flex items-center gap-2.5 border border-(--line) rounded-lg bg-(--surface-2) px-3 py-2.5">
              <div className="w-8 h-8 grid place-items-center rounded-md bg-(--accent-soft) text-(--accent-ink) text-[13px] font-semibold">
                {lead.clientName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1 flex flex-col gap-0.5">
                <strong className="text-[13px]">{lead.clientName}</strong>
                <span className="font-mono tabular-nums text-(--ink-faint) text-[11.5px]">
                  {lead.clientKey}
                </span>
              </div>
              <span
                className={`inline-flex items-center gap-1.25 font-mono tabular-nums text-[11px] ${lead.clientActive ? 'text-(--signal)' : 'text-(--ink-faint)'}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-(--signal)" />
                {lead.clientActive ? 'active' : 'inactive'}
              </span>
            </div>
          </Section>

          <Section title="Identity">
            <div className="flex flex-col gap-2.5">
              <div>
                <p className="font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-muted) mb-0.5">
                  Lead ID
                </p>
                <strong className="font-mono tabular-nums text-[12px]">#{lead.id}</strong>
              </div>
              <div>
                <p className="font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-muted) mb-0.5">
                  Webhook event
                </p>
                <strong className="font-mono tabular-nums text-[12px]">
                  {lead.webhookEventId ?? `evt_${lead.id}`}
                </strong>
              </div>
              <div>
                <p className="font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-muted) mb-0.5">
                  Source
                </p>
                <strong className="font-mono tabular-nums text-[12px]">{lead.source ?? 'unknown'}</strong>
              </div>
              <div>
                <p className="font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-muted) mb-0.5">
                  UTM source
                </p>
                <strong className="font-mono tabular-nums text-[12px]">
                  {typeof lead.rawPayload?.utm_source === 'string' ? lead.rawPayload.utm_source : '—'}
                </strong>
              </div>
              <div>
                <p className="font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-muted) mb-0.5">
                  IP address
                </p>
                <strong className="font-mono tabular-nums text-[12px]">
                  {typeof lead.rawPayload?.ip_address === 'string' ? lead.rawPayload.ip_address : '—'}
                </strong>
              </div>
            </div>
          </Section>

          <Section title="Timeline" future>
            <TLItem
              detail="POST /api/webhook/leads · 201"
              label="Received"
              timestamp={formatDateTime(lead.createdAt)}
            />
            <TLItem
              detail="HMAC signature ok"
              label="Verified"
              timestamp={formatDateTime(lead.updatedAt)}
            />
            <TLItem
              detail={`lead_id #${lead.id}`}
              isLast
              label="Stored"
              timestamp={formatDateTime(lead.updatedAt)}
            />
          </Section>

          <div className="mt-auto flex justify-between gap-3 border-t border-dashed border-(--line) pt-3 text-(--ink-faint) font-mono tabular-nums text-[10.5px]">
            <span>created {formatDateTime(lead.createdAt)}</span>
            <span>updated {formatDateTime(lead.updatedAt)}</span>
          </div>
        </aside>
      </div>

      {showToast ? (
        <div className="fixed right-6 bottom-6 z-50 border border-(--line) rounded-lg bg-(--ink) text-(--bg) px-3 py-2.5 text-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          Copied raw JSON
        </div>
      ) : null}
    </section>
  )
}

export default LeadDetailCard
