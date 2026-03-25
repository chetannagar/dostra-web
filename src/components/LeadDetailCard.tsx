import type { Lead, LeadStatus, User } from '../types/types.ts'
import { statusLabel } from '../constants/app.ts'
import { currency, shortDate } from '../utils/format.ts'
import ClientEditor from './ClientEditor.tsx'

interface LeadDetailCardProps {
  activeUser: User
  lead: Lead
  onDelete: (leadId: number) => void
  onEdit: (lead: Lead) => void
  onClientSave: (leadId: number, status: LeadStatus, notes: string) => void
}

function LeadDetailCard({
  activeUser,
  lead,
  onDelete,
  onEdit,
  onClientSave,
}: LeadDetailCardProps) {
  return (
    <section className="surface-card detail-card">
      <div className="surface-head">
        <div>
          <p className="section-label">Lead detail</p>
          <h3>{lead.name}</h3>
        </div>
        <span className={`status-badge status-${lead.status}`}>{statusLabel[lead.status]}</span>
      </div>

      <div className="detail-grid">
        <div>
          <span>Email</span>
          <strong>{lead.email}</strong>
        </div>
        <div>
          <span>Phone</span>
          <strong>{lead.phone}</strong>
        </div>
        <div>
          <span>Company</span>
          <strong>{lead.company}</strong>
        </div>
        <div>
          <span>Value</span>
          <strong>{currency(lead.value)}</strong>
        </div>
        <div>
          <span>Owner</span>
          <strong>{lead.owner}</strong>
        </div>
        <div>
          <span>Assigned client</span>
          <strong>{lead.assignedClientName ?? 'Unassigned'}</strong>
        </div>
      </div>

      <div className="note-block">
        <span className="section-label">Notes</span>
        <p>{lead.notes}</p>
      </div>

      <div className="meta-line">
        <small>Created {shortDate(lead.createdAt)}</small>
        <small>Updated {shortDate(lead.updatedAt)}</small>
      </div>

      {activeUser.role === 'admin' ? (
        <div className="button-row">
          <button className="secondary-button" onClick={() => onEdit(lead)} type="button">
            Edit lead
          </button>
          <button
            className="ghost-button danger"
            onClick={() => onDelete(lead.id)}
            type="button"
          >
            Delete
          </button>
        </div>
      ) : (
        <ClientEditor
          key={lead.id}
          lead={lead}
          onSave={(status, notes) => onClientSave(lead.id, status, notes)}
        />
      )}
    </section>
  )
}

export default LeadDetailCard
