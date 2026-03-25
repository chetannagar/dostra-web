import type { TabKey, User } from '../types/types.ts'
import { relativeRoleLabel } from '../utils/format.ts'

interface SidebarProps {
  activeTab: TabKey
  activeUser: User
  onTabChange: (tab: TabKey) => void
  onUserChange: (userId: number) => void
  users: User[]
}

function Sidebar({ activeTab, activeUser, onTabChange, onUserChange, users }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand-block">
        <p className="eyebrow">Northstar CRM</p>
        <h1>Sales cockpit for lean teams.</h1>
        <p className="muted">
          Role-aware CRM frontend with an admin command view and a limited client
          workspace.
        </p>
      </div>

      <div className="session-card">
        <p className="section-label">Demo session</p>
        <div className="user-switcher" role="tablist" aria-label="Demo users">
          {users.map((user) => (
            <button
              key={user.id}
              className={user.id === activeUser.id ? 'switch-pill active' : 'switch-pill'}
              onClick={() => onUserChange(user.id)}
              type="button"
            >
              <span>{user.name}</span>
              <small>{relativeRoleLabel(user.role)}</small>
            </button>
          ))}
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        <button
          className={activeTab === 'dashboard' ? 'nav-link active' : 'nav-link'}
          onClick={() => onTabChange('dashboard')}
          type="button"
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'leads' ? 'nav-link active' : 'nav-link'}
          onClick={() => onTabChange('leads')}
          type="button"
        >
          Leads
        </button>
        <button
          className={activeTab === 'pipeline' ? 'nav-link active' : 'nav-link'}
          onClick={() => onTabChange('pipeline')}
          type="button"
        >
          Pipeline
        </button>
      </nav>

      <div className="policy-card">
        <p className="section-label">Permissions</p>
        <ul>
          <li>
            {activeUser.role === 'admin'
              ? 'Create, edit, and delete every lead'
              : 'View only assigned leads'}
          </li>
          <li>
            {activeUser.role === 'admin'
              ? 'Access global metrics and ownership data'
              : 'Edit notes and status only'}
          </li>
          <li>
            {activeUser.role === 'admin'
              ? 'Manage client assignments'
              : 'No delete or protected field access'}
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
