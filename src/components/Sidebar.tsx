import DostraLogo from './DostraLogo.tsx'
import Icon from './Icon.tsx'
import type { AuthUser, NavKey } from '../types/types.ts'
import { initials } from '../utils/format.ts'

interface SidebarProps {
  collapsed: boolean
  current: NavKey
  onNav: (key: 'dashboard' | 'leads') => void
  onToggle: () => void
  user: AuthUser
}

const navItems: Array<{
  key: NavKey
  label: string
  role: 'all' | 'admin'
  soon?: boolean
}> = [
  { key: 'dashboard', label: 'Dashboard', role: 'all' },
  { key: 'leads', label: 'Leads', role: 'all' },
  { key: 'clients', label: 'Clients', role: 'admin', soon: true },
  { key: 'users', label: 'Users', role: 'admin', soon: true },
]

function Sidebar({ collapsed, current, onNav, onToggle, user }: SidebarProps) {
  return (
    <aside
      className={`sidebar flex flex-col shrink-0 border-r border-(--line) bg-(--surface) transition-[width] duration-180 ease-in-out ${collapsed ? 'w-16' : 'w-58'}`}
    >
      <div
        className={`sidebar-brand flex items-center gap-2.5 h-14 border-b border-(--line) ${collapsed ? 'justify-center px-0' : 'px-4.5'}`}
      >
        <DostraLogo size={22} />
        {!collapsed ? (
          <>
            <strong className="sidebar-collapsible text-[16px] font-semibold tracking-[-0.3px]">
              Dostra
            </strong>
            <span className="sidebar-collapsible ml-auto border border-(--line) rounded-[3px] px-1.25 py-px font-mono tabular-nums text-[10.5px] uppercase tracking-[0.8px] text-(--ink-faint)">
              v0.4
            </span>
          </>
        ) : null}
      </div>

      <nav
        className={`sidebar-nav flex flex-1 flex-col gap-px ${collapsed ? 'py-2.5 px-1.5' : 'py-2.5 px-2'}`}
        aria-label="Primary"
      >
        {!collapsed ? (
          <p className="sidebar-collapsible px-2.5 pt-2.5 pb-1.5 text-[11px] text-(--ink-faint)">
            Workspace
          </p>
        ) : null}
        {navItems
          .filter((item) => item.role === 'all' || user.role === 'admin')
          .map((item) => {
            const isActive = current === item.key
            const isDisabled = Boolean(item.soon)

            return (
              <button
                key={item.key}
                className={[
                  'sidebar-link relative flex items-center gap-2.5 w-full border-0 rounded-md bg-transparent cursor-pointer text-left text-[13.5px] transition-all duration-180 ease-in-out',
                  collapsed ? 'justify-center px-0 py-2' : 'px-2.5 py-1.75',
                  isActive ? 'bg-(--surface-2) text-(--ink) font-medium' : 'text-(--ink-muted)',
                  isDisabled ? 'cursor-not-allowed text-(--ink-faint)' : '',
                ].join(' ')}
                disabled={isDisabled}
                onClick={() => {
                  if (!isDisabled && (item.key === 'dashboard' || item.key === 'leads')) {
                    onNav(item.key)
                  }
                }}
                type="button"
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-xs bg-(--accent)" />
                )}
                <Icon name={item.key} size={16} />
                {!collapsed ? (
                  <>
                    <span className="sidebar-collapsible flex-1 text-left">{item.label}</span>
                    {item.key === 'leads' ? (
                      <span className="sidebar-collapsible font-mono tabular-nums text-[11px] text-(--ink-faint)">
                        {user.role === 'admin' ? 'all' : 'scoped'}
                      </span>
                    ) : null}
                    {item.soon ? (
                      <span className="sidebar-collapsible inline-flex items-center gap-1 rounded border border-(--line) px-1.75 py-0.75 font-mono text-[10.5px] uppercase tracking-[0.8px] text-(--ink-faint)">
                        soon
                      </span>
                    ) : null}
                  </>
                ) : null}
              </button>
            )
          })}
      </nav>

      <div
        className={`sidebar-footer flex flex-col gap-1.5 border-t border-(--line) ${collapsed ? 'py-2.5 px-1.5' : 'p-2.5'}`}
      >
        <div
          className={`sidebar-user flex items-center gap-2.5 p-1 ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-7 h-7 grid place-items-center rounded-[14px] bg-(--accent-soft) text-(--accent-ink) text-[11px] font-semibold shrink-0">
            {initials(user.name || 'User')}
          </div>
          {!collapsed ? (
            <div className="sidebar-collapsible min-w-0 flex flex-col gap-0.5">
              <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] font-medium">
                {user.name}
              </strong>
              <span className="inline-flex items-center gap-1.25 text-(--ink-faint) text-[11px]">
                <span
                  className={`w-1.25 h-1.25 rounded-full ${user.role === 'admin' ? 'bg-(--accent)' : 'bg-(--signal)'}`}
                />
                {user.role}
              </span>
            </div>
          ) : null}
        </div>

        <button
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-(--line) bg-(--surface) text-(--ink-muted) cursor-pointer p-1.25 text-[11px] transition-all duration-180 ease-in-out"
          onClick={onToggle}
          type="button"
        >
          <Icon name={collapsed ? 'chevron' : 'chevronL'} size={13} />
          {!collapsed ? <span className="sidebar-collapsible">Collapse</span> : null}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
