import type { Lead, PaginationMeta } from '../types/types.ts'
import { initials, shortDate } from '../utils/format.ts'
import '../styles/leads.css'

interface LeadListPanelProps {
  isLoading: boolean
  pagination: PaginationMeta | null
  selectedLeadId: number | null
  visibleLeads: Lead[]
  onLeadSelect: (leadId: number) => void
  onPageChange: (page: number) => void
}

function LeadListPanel({
  isLoading,
  pagination,
  selectedLeadId,
  visibleLeads,
  onLeadSelect,
  onPageChange,
}: LeadListPanelProps) {
  return (
    <section className="panel-stack">
      <div className="page-intro">
        <div>
          <p className="section-label">Leads</p>
          <h2>{pagination?.total ?? visibleLeads.length} total leads</h2>
        </div>
        <div className="header-actions">
          <button className="primary-button" type="button">
            Add Lead
          </button>
        </div>
      </div>

      <div className="surface-card table-card">
        <div className="surface-head">
          <div className="selection-strip wide">
            <span>{selectedLeadId ? '1 selected' : 'Search and review lead records'}</span>
          </div>
          <button className="ghost-button" type="button">
            Filters
          </button>
        </div>

        <div className="table-head leads-grid">
          <span>Name</span>
          <span>Email</span>
          <span>Client</span>
          <span>Source</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        <div className="table-body">
          {visibleLeads.map((lead) => (
            <button
              key={lead.id}
              className={selectedLeadId === lead.id ? 'table-row leads-grid active' : 'table-row leads-grid'}
              onClick={() => onLeadSelect(lead.id)}
              type="button"
            >
              <div className="row-identity">
                <div className="avatar-pill">{initials(lead.name ?? lead.email ?? 'Lead')}</div>
                <strong>{lead.name ?? 'Unnamed lead'}</strong>
              </div>
              <span>{lead.email ?? '-'}</span>
              <span>{lead.clientName}</span>
              <span className="pill neutral">{lead.source ?? 'Unknown'}</span>
              <span>{shortDate(lead.createdAt)}</span>
              <span className="table-link">Open</span>
            </button>
          ))}

          {isLoading ? (
            <div className="empty-state">
              <h4>Loading leads...</h4>
              <p>Waiting for `/api/leads`.</p>
            </div>
          ) : null}

          {!isLoading && !visibleLeads.length ? (
            <div className="empty-state">
              <h4>No leads match this filter.</h4>
              <p>Try clearing the search or changing the API filters.</p>
            </div>
          ) : null}
        </div>

        {pagination ? (
          <div className="pagination-row">
            <button
              className="ghost-button"
              disabled={pagination.currentPage <= 1}
              onClick={() => onPageChange(pagination.currentPage - 1)}
              type="button"
            >
              Previous
            </button>
            <small>
              Page {pagination.currentPage} of {pagination.lastPage || 1}
            </small>
            <button
              className="ghost-button"
              disabled={pagination.currentPage >= pagination.lastPage}
              onClick={() => onPageChange(pagination.currentPage + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default LeadListPanel
