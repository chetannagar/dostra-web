import type { Lead } from '../types/types.ts'
import { statusLabel } from '../constants/app.ts'
import { currency } from '../utils/format.ts'

interface LeadListPanelProps {
  selectedLeadId: number | null
  visibleLeads: Lead[]
  onLeadSelect: (leadId: number) => void
}

function LeadListPanel({ selectedLeadId, visibleLeads, onLeadSelect }: LeadListPanelProps) {
  return (
    <div className="surface-card table-card">
      <div className="surface-head">
        <div>
          <p className="section-label">Lead registry</p>
          <h3>{visibleLeads.length} matching leads</h3>
        </div>
      </div>

      <div className="lead-list">
        {visibleLeads.map((lead) => (
          <button
            key={lead.id}
            className={selectedLeadId === lead.id ? 'lead-row active' : 'lead-row'}
            onClick={() => onLeadSelect(lead.id)}
            type="button"
          >
            <div className="lead-row-main">
              <strong>{lead.name}</strong>
              <p>
                {lead.company} · {lead.email}
              </p>
            </div>
            <div className="lead-row-meta">
              <span className={`status-badge status-${lead.status}`}>
                {statusLabel[lead.status]}
              </span>
              <small>{currency(lead.value)}</small>
            </div>
          </button>
        ))}

        {!visibleLeads.length ? (
          <div className="empty-state">
            <h4>No leads match this filter.</h4>
            <p>Try clearing the search or switching status filters.</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default LeadListPanel
