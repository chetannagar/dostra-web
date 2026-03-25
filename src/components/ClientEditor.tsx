import { useState } from 'react'
import type { Lead, LeadStatus } from '../types/types.ts'
import { statusLabel, statusOrder } from '../constants/app.ts'

interface ClientEditorProps {
  lead: Lead
  onSave: (status: LeadStatus, notes: string) => void
}

function ClientEditor({ lead, onSave }: ClientEditorProps) {
  const [status, setStatus] = useState<LeadStatus>(lead.status)
  const [notes, setNotes] = useState(lead.notes)

  return (
    <form
      className="client-editor"
      onSubmit={(event) => {
        event.preventDefault()
        onSave(status, notes)
      }}
    >
      <div className="surface-head compact">
        <div>
          <p className="section-label">Client update</p>
          <h3>Allowed fields</h3>
        </div>
      </div>

      <label>
        <span>Status</span>
        <select value={status} onChange={(event) => setStatus(event.target.value as LeadStatus)}>
          {statusOrder.map((option) => (
            <option key={option} value={option}>
              {statusLabel[option]}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Notes</span>
        <textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} />
      </label>

      <button className="primary-button" type="submit">
        Save client update
      </button>
    </form>
  )
}

export default ClientEditor
