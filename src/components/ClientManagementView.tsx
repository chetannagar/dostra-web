import type { ClientSummary } from '../types/types.ts'
import { shortDate } from '../utils/format.ts'
import '../styles/admin.css'

interface ClientManagementViewProps {
  clients: ClientSummary[]
  isLoading: boolean
}

function ClientManagementView({ clients, isLoading }: ClientManagementViewProps) {
  return (
    <section className="panel-stack">
      <div className="page-intro">
        <div>
          <p className="section-label">Clients</p>
          <h2>{clients.length} registered clients</h2>
        </div>
        <div className="header-actions">
          <button className="primary-button" type="button">
            Add Client
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="surface-card empty-state">
          <h4>Loading clients...</h4>
          <p>Fetching `/api/clients`.</p>
        </div>
      ) : null}

      {!isLoading && !clients.length ? (
        <div className="surface-card empty-state">
          <h4>No clients found.</h4>
          <p>The current session did not receive any visible clients from the API.</p>
        </div>
      ) : null}

      <div className="card-grid">
        {clients.map((client) => (
          <article key={client.id} className="surface-card client-card">
            <div className="client-card-head">
              <div>
                <strong>{client.name}</strong>
                <p>{client.client_key}</p>
              </div>
              <span className={client.is_active ? 'pill positive' : 'pill negative'}>
                {client.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="client-card-copy">
              <small>Created {shortDate(client.created_at)}</small>
              <small>Updated {shortDate(client.updated_at)}</small>
            </div>

            <div className="client-secret">
              <span>Webhook secret</span>
              <strong>Rotate from detail flow</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ClientManagementView
