import type { Lead, LeadStatus, TabKey } from '../types/types.ts'
import { statusLabel } from '../constants/app.ts'
import { currency } from '../utils/format.ts'

interface PipelineGroup {
  status: LeadStatus
  leads: Lead[]
}

interface PipelineViewProps {
  pipelineGroups: PipelineGroup[]
  onLeadOpen: (leadId: number, tab?: TabKey) => void
}

function PipelineView({ pipelineGroups, onLeadOpen }: PipelineViewProps) {
  return (
    <section className="surface-card pipeline-board">
      <div className="surface-head">
        <div>
          <p className="section-label">Pipeline board</p>
          <h3>Stage-by-stage opportunity flow</h3>
        </div>
      </div>

      <div className="kanban-grid">
        {pipelineGroups.map((group) => (
          <article key={group.status} className="kanban-column">
            <div className="kanban-head">
              <h4>{statusLabel[group.status]}</h4>
              <span>{group.leads.length}</span>
            </div>
            <div className="kanban-cards">
              {group.leads.map((lead) => (
                <button
                  key={lead.id}
                  className="kanban-card"
                  onClick={() => onLeadOpen(lead.id, 'leads')}
                  type="button"
                >
                  <strong>{lead.name}</strong>
                  <p>{lead.company}</p>
                  <small>{currency(lead.value)}</small>
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PipelineView
