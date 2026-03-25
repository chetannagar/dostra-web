import type { LeadStatus, User } from '../types/types.ts'
import { statusLabel, statusOrder } from '../constants/app.ts'

interface TopbarProps {
  activeUser: User
  search: string
  statusFilter: 'all' | LeadStatus
  onCreateLead: () => void
  onSearchChange: (value: string) => void
  onStatusFilterChange: (value: 'all' | LeadStatus) => void
}

function Topbar({
  activeUser,
  search,
  statusFilter,
  onCreateLead,
  onSearchChange,
  onStatusFilterChange,
}: TopbarProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Signed in as {activeUser.role}</p>
        <h2>{activeUser.name}</h2>
      </div>

      <div className="topbar-actions">
        <label className="search-field">
          <span className="sr-only">Search leads</span>
          <input
            type="search"
            placeholder="Search by name, email, phone, company"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </label>

        <select
          aria-label="Filter by lead status"
          className="status-select"
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value as 'all' | LeadStatus)}
        >
          <option value="all">All statuses</option>
          {statusOrder.map((status) => (
            <option key={status} value={status}>
              {statusLabel[status]}
            </option>
          ))}
        </select>

        {activeUser.role === 'admin' ? (
          <button className="primary-button" onClick={onCreateLead} type="button">
            New lead
          </button>
        ) : null}
      </div>
    </header>
  )
}

export default Topbar
