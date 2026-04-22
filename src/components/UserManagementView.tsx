import type { UserRecord } from '../types/types.ts'

interface UserManagementViewProps {
  isLoading: boolean
  users: UserRecord[]
}

function UserManagementView({ isLoading, users }: UserManagementViewProps) {
  return (
    <section className="flex flex-col gap-4.5 px-7 pt-5.5 pb-7 min-h-0">
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-muted)">
            Users
          </p>
          <h2 className="text-[22px] font-medium tracking-[-0.5px]">{users.length} visible users</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-(--ink) bg-(--ink) text-(--bg) cursor-pointer px-3.5 py-2.5 transition-all duration-180 ease-in-out"
            type="button"
          >
            Invite User
          </button>
        </div>
      </div>

      <section className="border border-(--line) rounded-lg bg-(--surface)">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(90px,0.8fr)_minmax(90px,0.8fr)_minmax(0,1.2fr)] gap-3 items-center border-b border-(--line) bg-(--surface) text-(--ink-faint) px-5.5 py-2.5 font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] max-[820px]:hidden">
          <span>Name</span>
          <span>Email</span>
          <span>Status</span>
          <span>Role</span>
          <span>Clients</span>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          {users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(90px,0.8fr)_minmax(90px,0.8fr)_minmax(0,1.2fr)] gap-3 items-center border-b border-(--line) px-5.5 py-3.5 text-[13px] max-[820px]:grid-cols-1"
            >
              <strong className="font-medium">{user.name}</strong>
              <span className="text-(--ink-muted)">{user.email}</span>
              <span className="inline-flex items-center gap-1 rounded border border-(--line) bg-(--signal-bg) text-(--signal) px-1.75 py-0.75 text-[10.5px] uppercase tracking-[0.8px] w-fit">
                Active
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-(--line) bg-(--surface-2) text-(--ink-muted) px-1.75 py-0.75 text-[10.5px] uppercase tracking-[0.8px] w-fit">
                {user.role}
              </span>
              <span className="text-(--ink-muted) text-[12.5px]">
                {user.clients.length ? user.clients.map((client) => client.name).join(', ') : 'Global'}
              </span>
            </div>
          ))}

          {isLoading ? (
            <div className="flex flex-col gap-1.5 border border-(--line) rounded-[10px] bg-(--surface) p-6 text-(--ink-muted) m-[18px_22px]">
              <h3 className="text-(--ink) text-lg font-medium">Loading users...</h3>
              <p>Fetching `/api/users`.</p>
            </div>
          ) : null}

          {!isLoading && !users.length ? (
            <div className="flex flex-col gap-1.5 border border-(--line) rounded-[10px] bg-(--surface) p-6 text-(--ink-muted) m-[18px_22px]">
              <h3 className="text-(--ink) text-lg font-medium">No users returned.</h3>
              <p>The current admin session did not receive any visible users from the API.</p>
            </div>
          ) : null}
        </div>
      </section>
    </section>
  )
}

export default UserManagementView
