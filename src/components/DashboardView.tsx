import type { Lead, TabKey, User } from '../types/types.ts'
import { statusLabel, statusOrder } from '../constants/app.ts'
import { currency, shortDate } from '../utils/format.ts'

interface DashboardStats {
  total: number
  pipelineValue: number
  wonValue: number
  urgentCount: number
}

interface DashboardViewProps {
  activeUser: User
  dashboardStats: DashboardStats
  visibleLeads: Lead[]
  onLeadOpen: (leadId: number, tab?: TabKey) => void
}

function DashboardView({
  activeUser,
  dashboardStats,
  visibleLeads,
  onLeadOpen,
}: DashboardViewProps) {
  return (
    <section className="panel-stack">
      <div className="hero-panel">
        <div>
          <p className="section-label">Overview</p>
          <h3>
            {activeUser.role === 'admin'
              ? 'Pipeline health across the full book'
              : 'Assigned opportunities and next actions'}
          </h3>
        </div>
        <p className="muted">
          {activeUser.role === 'admin'
            ? 'Track conversion momentum, surface stalled deals, and move account ownership quickly.'
            : 'Review your active leads, update notes, and focus on the deals that need follow-up now.'}
        </p>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span>Total leads</span>
          <strong>{dashboardStats.total}</strong>
          <small>
            {activeUser.role === 'admin' ? 'All visible records' : 'Assigned to your account'}
          </small>
        </article>
        <article className="stat-card">
          <span>Pipeline value</span>
          <strong>{currency(dashboardStats.pipelineValue)}</strong>
          <small>Open and closed opportunities</small>
        </article>
        <article className="stat-card">
          <span>Won revenue</span>
          <strong>{currency(dashboardStats.wonValue)}</strong>
          <small>Closed won in current data set</small>
        </article>
        <article className="stat-card accent">
          <span>Needs action</span>
          <strong>{dashboardStats.urgentCount}</strong>
          <small>New or proposal-stage leads</small>
        </article>
      </div>

      <div className="dashboard-grid">
        <section className="surface-card">
          <div className="surface-head">
            <div>
              <p className="section-label">Recent updates</p>
              <h3>Leads moving this week</h3>
            </div>
          </div>
          <div className="activity-list">
            {visibleLeads.slice(0, 4).map((lead) => (
              <button
                key={lead.id}
                className="activity-item"
                onClick={() => onLeadOpen(lead.id, 'leads')}
                type="button"
              >
                <div>
                  <strong>{lead.name}</strong>
                  <p>
                    {lead.company} · {lead.owner}
                  </p>
                </div>
                <div className="activity-meta">
                  <span className={`status-badge status-${lead.status}`}>
                    {statusLabel[lead.status]}
                  </span>
                  <small>{shortDate(lead.updatedAt)}</small>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="surface-card">
          <div className="surface-head">
            <div>
              <p className="section-label">Distribution</p>
              <h3>Status mix</h3>
            </div>
          </div>
          <div className="status-rows">
            {statusOrder.map((status) => {
              const count = visibleLeads.filter((lead) => lead.status === status).length
              const width = dashboardStats.total ? `${(count / dashboardStats.total) * 100}%` : '0%'

              return (
                <div key={status} className="status-row">
                  <div className="status-row-head">
                    <span>{statusLabel[status]}</span>
                    <strong>{count}</strong>
                  </div>
                  <div className="status-track">
                    <div className={`status-fill status-${status}`} style={{ width }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </section>
  )
}

export default DashboardView
