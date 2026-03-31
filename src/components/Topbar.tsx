import type { AuthUser, LeadFilters, TabKey } from '../types/types.ts'

interface TopbarProps {
  activeTab: TabKey
  activeUser: AuthUser
  filters: LeadFilters
  onFilterChange: (nextFilters: LeadFilters) => void
  onRefresh: () => void
  onLogout: () => void
}

const titles: Record<TabKey, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard Overview',
    subtitle: 'Monitor lead ingestion and recent system activity.',
  },
  leads: {
    title: 'Leads Management',
    subtitle: 'Filter and inspect inbound leads from the shared registry.',
  },
  'lead-detail': {
    title: 'Lead Detail',
    subtitle: 'Audit payloads, client attribution, and processing events.',
  },
  clients: {
    title: 'Client Management',
    subtitle: 'Control tenants, client status, and webhook credentials.',
  },
  users: {
    title: 'User Management',
    subtitle: 'Manage roles, assignments, and access scope.',
  },
}

function Topbar({
  activeTab,
  activeUser,
  filters,
  onFilterChange,
  onRefresh,
  onLogout,
}: TopbarProps) {
  const header = titles[activeTab]

  return (
    <header className="topbar refined-topbar">
      <div className="topbar-page">
        <p className="topbar-welcome">Welcome back,</p>
        <h1>{activeUser.name}</h1>
        <p className="muted">{header.subtitle}</p>
      </div>

      <div className="topbar-actions">
        <span className="client-chip">
          {activeUser.role === 'admin'
            ? `${activeUser.clients.length || 'All'} clients`
            : activeUser.clients[0]?.name ?? 'Assigned client'}
        </span>

        <label className="search-field">
          <span className="sr-only">Search leads</span>
          <input
            type="search"
            placeholder="Search leads, clients..."
            value={filters.search}
            onChange={(event) =>
              onFilterChange({ ...filters, search: event.target.value, page: 1 })
            }
          />
        </label>

        <button className="secondary-button" onClick={onRefresh} type="button">
          Refresh
        </button>

        <button className="ghost-button" onClick={onLogout} type="button">
          Sign out
        </button>
      </div>
    </header>
  )
}

export default Topbar
