import type { UserRecord } from '../types/types.ts'
import '../styles/admin.css'

interface UserManagementViewProps {
  isLoading: boolean
  users: UserRecord[]
}

function UserManagementView({ isLoading, users }: UserManagementViewProps) {
  return (
    <section className="panel-stack">
      <div className="page-intro">
        <div>
          <p className="section-label">Users</p>
          <h2>{users.length} visible users</h2>
        </div>
        <div className="header-actions">
          <button className="primary-button" type="button">
            Invite User
          </button>
        </div>
      </div>

      <section className="surface-card">
        <div className="table-head users-grid">
          <span>Name</span>
          <span>Email</span>
          <span>Status</span>
          <span>Role</span>
          <span>Clients</span>
        </div>

        <div className="table-body">
          {users.map((user) => (
            <div key={user.id} className="table-row users-grid static-row">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
              <span className="pill positive">Active</span>
              <span className="pill neutral">{user.role}</span>
              <span>{user.clients.length ? user.clients.map((client) => client.name).join(', ') : 'Global'}</span>
            </div>
          ))}

          {isLoading ? (
            <div className="empty-state">
              <h4>Loading users...</h4>
              <p>Fetching `/api/users`.</p>
            </div>
          ) : null}

          {!isLoading && !users.length ? (
            <div className="empty-state">
              <h4>No users returned.</h4>
              <p>The current admin session did not receive any visible users from the API.</p>
            </div>
          ) : null}
        </div>
      </section>
    </section>
  )
}

export default UserManagementView
