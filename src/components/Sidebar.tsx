import type { AuthUser, TabKey } from '../types/types.ts'
import { relativeRoleLabel } from '../utils/format.ts'

interface SidebarProps {
  activeTab: TabKey
  activeUser: AuthUser
  onLogout: () => void
  onTabChange: (tab: TabKey) => void
}

const tabs: Array<{ key: TabKey; label: string; section?: string }> = [
  { key: 'dashboard', label: 'Dashboard', section: 'Main menu' },
  { key: 'leads', label: 'Leads List' },
  { key: 'lead-detail', label: 'Lead Detail' },
]

function Sidebar({ activeTab, activeUser, onLogout, onTabChange }: SidebarProps) {
  return (
    <aside className="sidebar refined-sidebar">
      <div className="sidebar-brand">
        <div className="logo-mark">D</div>
        <strong>Dostra</strong>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {tabs.map((tab, index) => (
          <div key={tab.key} className="nav-group">
            {tab.section ? (
              <p className={index === 0 ? 'nav-heading first' : 'nav-heading'}>{tab.section}</p>
            ) : null}
            <button
              className={activeTab === tab.key ? 'nav-link active' : 'nav-link'}
              onClick={() => onTabChange(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="session-identity footer-user">
          <strong>{activeUser.name}</strong>
          <small>{relativeRoleLabel(activeUser.role)}</small>
          <small>{activeUser.clients.length} assigned clients</small>
        </div>
        <button className="ghost-button sidebar-logout" onClick={onLogout} type="button">
          Sign out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
