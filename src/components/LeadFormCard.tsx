import type { FormEvent } from 'react'
import type { LeadFormState, LeadStatus, User } from '../types/types.ts'
import { statusLabel, statusOrder } from '../constants/app.ts'

interface LeadFormCardProps {
  editingLeadId: number | null
  formState: LeadFormState
  users: User[]
  onClear: () => void
  onFormChange: (nextFormState: LeadFormState) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

function LeadFormCard({
  editingLeadId,
  formState,
  users,
  onClear,
  onFormChange,
  onSubmit,
}: LeadFormCardProps) {
  return (
    <section className="surface-card form-card">
      <div className="surface-head">
        <div>
          <p className="section-label">{editingLeadId ? 'Edit lead' : 'Create lead'}</p>
          <h3>
            {editingLeadId ? 'Update lead profile and ownership' : 'Add a fresh opportunity'}
          </h3>
        </div>
      </div>

      <form className="lead-form" onSubmit={onSubmit}>
        <label>
          <span>Name</span>
          <input
            required
            value={formState.name}
            onChange={(event) => onFormChange({ ...formState, name: event.target.value })}
          />
        </label>
        <label>
          <span>Email</span>
          <input
            required
            type="email"
            value={formState.email}
            onChange={(event) => onFormChange({ ...formState, email: event.target.value })}
          />
        </label>
        <label>
          <span>Phone</span>
          <input
            required
            value={formState.phone}
            onChange={(event) => onFormChange({ ...formState, phone: event.target.value })}
          />
        </label>
        <label>
          <span>Company</span>
          <input
            required
            value={formState.company}
            onChange={(event) => onFormChange({ ...formState, company: event.target.value })}
          />
        </label>
        <label>
          <span>Value</span>
          <input
            required
            min="0"
            type="number"
            value={formState.value}
            onChange={(event) => onFormChange({ ...formState, value: event.target.value })}
          />
        </label>
        <label>
          <span>Status</span>
          <select
            value={formState.status}
            onChange={(event) =>
              onFormChange({ ...formState, status: event.target.value as LeadStatus })
            }
          >
            {statusOrder.map((status) => (
              <option key={status} value={status}>
                {statusLabel[status]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Source</span>
          <input
            value={formState.source}
            onChange={(event) => onFormChange({ ...formState, source: event.target.value })}
          />
        </label>
        <label>
          <span>Assigned client</span>
          <select
            value={formState.assignedClientId}
            onChange={(event) =>
              onFormChange({ ...formState, assignedClientId: event.target.value })
            }
          >
            <option value="">Unassigned</option>
            {users
              .filter((user) => user.role === 'client')
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
          </select>
        </label>
        <label className="full-width">
          <span>Notes</span>
          <textarea
            rows={5}
            value={formState.notes}
            onChange={(event) => onFormChange({ ...formState, notes: event.target.value })}
          />
        </label>

        <div className="button-row">
          <button className="primary-button" type="submit">
            {editingLeadId ? 'Save changes' : 'Create lead'}
          </button>
          <button className="ghost-button" onClick={onClear} type="button">
            Clear
          </button>
        </div>
      </form>
    </section>
  )
}

export default LeadFormCard
