import type { Lead } from '../types/types.ts'
import { formatDateTime, initials } from '../utils/format.ts'
import '../styles/detail.css'

interface LeadDetailCardProps {
  lead: Lead | null
  isLoading: boolean
}

function LeadDetailCard({ lead, isLoading }: LeadDetailCardProps) {
  if (isLoading) {
    return (
      <section className="surface-card detail-card">
        <div className="empty-state">
          <h4>Loading lead detail...</h4>
          <p>Fetching the latest record from `/api/leads/{'{id}'}`.</p>
        </div>
      </section>
    )
  }

  if (!lead) {
    return (
      <section className="surface-card detail-card">
        <div className="empty-state">
          <h4>Select a lead.</h4>
          <p>Lead details will appear here after you pick a record from the list.</p>
        </div>
      </section>
    )
  }

  const timeline = [
    {
      title: 'Webhook received',
      body: `${lead.source ?? 'Unknown source'} payload accepted for ${lead.clientName}.`,
      time: formatDateTime(lead.createdAt),
    },
    {
      title: 'Lead normalized',
      body: 'Record prepared for CRM review and assignment.',
      time: formatDateTime(lead.updatedAt),
    },
    {
      title: 'Ready for action',
      body: 'Visible in the lead registry and available for downstream review.',
      time: formatDateTime(lead.updatedAt),
    },
  ]

  return (
    <section className="panel-stack">
      <div className="page-intro detail-page-head">
        <div className="lead-header">
          <div className="avatar-pill large">{initials(lead.name ?? lead.email ?? 'Lead')}</div>
          <div>
            <p className="section-label">Lead Detail</p>
            <h2>{lead.name ?? 'Unnamed lead'}</h2>
            <p className="lead-subtitle">
              {lead.email ?? 'No direct email'} · {lead.clientName}
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button className="secondary-button" type="button">
            Edit lead
          </button>
          <button className="primary-button" type="button">
            Review payload
          </button>
        </div>
      </div>

      <div className="detail-layout">
        <div className="details-column">
          <section className="surface-card detail-section">
            <div className="surface-head">
              <div>
                <p className="section-label">Identity details</p>
                <h3>Lead record</h3>
              </div>
            </div>
            <div className="detail-grid">
              <div>
                <span>Email</span>
                <strong>{lead.email ?? 'Not provided'}</strong>
              </div>
              <div>
                <span>Client</span>
                <strong>{lead.clientName}</strong>
              </div>
              <div>
                <span>Client key</span>
                <strong>{lead.clientKey}</strong>
              </div>
              <div>
                <span>Webhook event</span>
                <strong>{lead.webhookEventId ?? 'Not provided'}</strong>
              </div>
            </div>
          </section>

          <section className="surface-card detail-section">
            <div className="surface-head">
              <div>
                <p className="section-label">Message</p>
                <h3>Captured submission</h3>
              </div>
            </div>
            <div className="note-block">
              <p>{lead.message ?? 'No message body was stored for this lead.'}</p>
            </div>
          </section>

          <section className="surface-card detail-section">
            <div className="surface-head">
              <div>
                <p className="section-label">Audit info</p>
                <h3>Timestamps</h3>
              </div>
            </div>
            <div className="detail-grid">
              <div>
                <span>Created</span>
                <strong>{formatDateTime(lead.createdAt)}</strong>
              </div>
              <div>
                <span>Updated</span>
                <strong>{formatDateTime(lead.updatedAt)}</strong>
              </div>
            </div>
          </section>
        </div>

        <div className="details-column">
          <section className="surface-card detail-section">
            <div className="surface-head">
              <div>
                <p className="section-label">Ingestion timeline</p>
                <h3>Processing events</h3>
              </div>
              <span className="pill positive">Visible</span>
            </div>
            <div className="timeline-list">
              {timeline.map((entry) => (
                <div key={entry.title} className="timeline-item static-row">
                  <span className="timeline-dot" />
                  <div className="timeline-copy">
                    <strong>{entry.title}</strong>
                    <p>{entry.body}</p>
                    <small>{entry.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card detail-section">
            <div className="surface-head">
              <div>
                <p className="section-label">Raw webhook payload</p>
                <h3>Payload body</h3>
              </div>
              <button className="ghost-button" type="button">
                Copy JSON
              </button>
            </div>
            <div className="payload-block">
              <pre>{JSON.stringify(lead.rawPayload ?? {}, null, 2)}</pre>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

export default LeadDetailCard
