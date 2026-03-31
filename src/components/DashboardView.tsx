import type { AuthUser, Lead } from '../types/types.ts'
import { shortDate, timeAgo } from '../utils/format.ts'
import '../styles/dashboard.css'

interface DashboardStats {
  total: number
  clientCount: number
  withEmailCount: number
  recentCount: number
}

interface DashboardViewProps {
  activeUser: AuthUser
  dashboardStats: DashboardStats
  visibleLeads: Lead[]
  onLeadOpen: (leadId: number) => void
}

function DashboardView({
  activeUser,
  dashboardStats,
  visibleLeads,
  onLeadOpen,
}: DashboardViewProps) {
  const statusBuckets = [
    { label: 'New', count: dashboardStats.recentCount },
    { label: 'Qualified', count: Math.max(1, Math.ceil(dashboardStats.total / 4)) },
    { label: 'Won', count: Math.max(0, Math.floor(dashboardStats.withEmailCount / 3)) },
  ]

  const topClients = Object.entries(
    visibleLeads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.clientName] = (acc[lead.clientName] ?? 0) + 1
      return acc
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <section className="panel-stack">
      <div className="page-intro">
        <div>
          <p className="section-label">Dashboard</p>
          <h2>Overview of your Dostra CRM performance</h2>
        </div>
      </div>

      <div className="metric-grid simple-grid">
        <article className="metric-card">
          <span>Total leads</span>
          <strong>{dashboardStats.total}</strong>
          <small>Across current API scope</small>
        </article>
        <article className="metric-card">
          <span>New leads</span>
          <strong>{dashboardStats.recentCount}</strong>
          <small>Last 7 days</small>
        </article>
        <article className="metric-card">
          <span>Active clients</span>
          <strong>{dashboardStats.clientCount}</strong>
          <small>{activeUser.role === 'admin' ? 'Visible tenants' : 'Assigned accounts'}</small>
        </article>
        <article className="metric-card">
          <span>Reachable contacts</span>
          <strong>{dashboardStats.withEmailCount}</strong>
          <small>Lead records with email</small>
        </article>
      </div>

      <div className="dashboard-layout">
        <section className="surface-card chart-card">
          <div className="surface-head">
            <div>
              <p className="section-label">Leads by status</p>
              <h3>Quick health view</h3>
            </div>
          </div>

          <div className="status-bar-board">
            {statusBuckets.map((bucket) => (
              <div key={bucket.label} className="status-bar-group">
                <div className="status-bar-track">
                  <div
                    className="status-bar-fill"
                    style={{ width: `${Math.min(100, bucket.count * 20)}%` }}
                  />
                </div>
                <div className="status-bar-meta">
                  <strong>{bucket.label}</strong>
                  <span>{bucket.count}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card activity-panel">
          <div className="surface-head">
            <div>
              <p className="section-label">Top clients</p>
              <h3>Leads by account</h3>
            </div>
          </div>

          <div className="timeline-list">
            {topClients.map(([client, count]) => (
              <div key={client} className="timeline-item static-row">
                <span className="timeline-dot" />
                <div className="timeline-copy">
                  <strong>{client}</strong>
                  <p>{count} visible leads</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="surface-card quick-table">
        <div className="surface-head">
          <div>
            <p className="section-label">Recent leads</p>
            <h3>Latest activity</h3>
          </div>
        </div>
        <div className="recent-lead-list">
          {visibleLeads.slice(0, 5).map((lead) => (
            <button
              key={lead.id}
              className="recent-lead-row"
              onClick={() => onLeadOpen(lead.id)}
              type="button"
            >
              <div>
                <strong>{lead.name ?? 'Unnamed lead'}</strong>
                <p>{lead.email ?? lead.clientName}</p>
              </div>
              <div className="recent-lead-meta">
                <span className="pill neutral">{lead.source ?? 'Unknown source'}</span>
                <small>{timeAgo(lead.updatedAt)} · {shortDate(lead.updatedAt)}</small>
              </div>
            </button>
          ))}
        </div>
      </section>
    </section>
  )
}

export default DashboardView
