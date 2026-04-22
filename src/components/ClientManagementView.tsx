import type { ClientSummary } from '../types/types.ts'
import { shortDate } from '../utils/format.ts'

interface ClientManagementViewProps {
  clients: ClientSummary[]
  isLoading: boolean
}

function ClientManagementView({ clients, isLoading }: ClientManagementViewProps) {
  return (
    <section className="flex flex-col gap-4.5 px-7 pt-5.5 pb-7 min-h-0">
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-muted)">
            Clients
          </p>
          <h2 className="text-[22px] font-medium tracking-[-0.5px]">{clients.length} registered clients</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-(--ink) bg-(--ink) text-(--bg) cursor-pointer px-3.5 py-2.5 transition-all duration-180 ease-in-out"
            type="button"
          >
            Add Client
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-1.5 border border-(--line) rounded-[10px] bg-(--surface) p-6 text-(--ink-muted)">
          <h3 className="text-(--ink) text-lg font-medium">Loading clients...</h3>
          <p>Fetching `/api/clients`.</p>
        </div>
      ) : null}

      {!isLoading && !clients.length ? (
        <div className="flex flex-col gap-1.5 border border-(--line) rounded-[10px] bg-(--surface) p-6 text-(--ink-muted)">
          <h3 className="text-(--ink) text-lg font-medium">No clients found.</h3>
          <p>The current session did not receive any visible clients from the API.</p>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-1">
        {clients.map((client) => (
          <article
            key={client.id}
            className="border border-(--line) rounded-lg bg-(--surface) grid gap-4 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-[13.5px] font-medium">{client.name}</strong>
                <p className="font-mono tabular-nums text-[11.5px] text-(--ink-muted) mt-0.5">
                  {client.client_key}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded border border-(--line) px-1.75 py-0.75 text-[10.5px] uppercase tracking-[0.8px] ${client.is_active ? 'bg-(--signal-bg) text-(--signal)' : 'bg-(--surface-2) text-(--ink-muted)'}`}
              >
                {client.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <small className="text-[11.5px] text-(--ink-muted)">Created {shortDate(client.created_at)}</small>
              <small className="text-[11.5px] text-(--ink-muted)">Updated {shortDate(client.updated_at)}</small>
            </div>

            <div className="rounded-[0.9rem] bg-(--surface-2) border border-(--line) p-[0.9rem]">
              <span className="block font-mono tabular-nums text-[11px] uppercase tracking-[0.8px] text-(--ink-faint)">
                Webhook secret
              </span>
              <strong className="block mt-[0.3rem] text-(--ink) text-[13px]">Rotate from detail flow</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ClientManagementView
