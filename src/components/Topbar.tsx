import { type ReactNode, useEffect, useRef, useState } from 'react'
import Icon from './Icon.tsx'
import type { User, ThemeMode } from '../types/types.ts'

interface TopbarProps {
  clientCount: number | null
  crumbs: string[]
  onLogout: () => void
  onSearch: (query: string) => void
  onThemeToggle: () => void
  right?: ReactNode
  searchQuery: string
  themeMode: ThemeMode
  user: User
}

function Topbar({ clientCount, crumbs, onLogout, onSearch, onThemeToggle, right, searchQuery, themeMode, user }: TopbarProps) {
  const [inputValue, setInputValue] = useState(searchQuery)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  function handleChange(value: string) {
    setInputValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearch(value)
    }, 300)
  }

  return (
    <header className="flex items-center gap-4 h-14 border-b border-(--line) bg-(--surface) px-5">
      <div className="min-w-0 flex items-center gap-2">
        {crumbs.map((crumb, index) => (
          <span key={crumb} className="inline-flex items-center gap-2">
            <span
              className={
                index === crumbs.length - 1
                  ? 'text-[13px] text-(--ink) font-medium'
                  : 'text-[13px] text-(--ink-muted)'
              }
            >
              {crumb}
            </span>
            {index < crumbs.length - 1 ? <Icon name="chevron" size={12} /> : null}
          </span>
        ))}
      </div>

      <div className="flex-1 flex justify-center">
        <label className="w-[min(100%,420px)] flex items-center gap-2 border border-(--line) rounded-md bg-(--surface-2) text-(--ink-faint) px-2.5 py-1.5">
          <Icon name="search" size={14} />
          <input
            ref={inputRef}
            className="min-w-0 flex-1 text-[13px] text-(--ink) placeholder:text-(--ink-faint) focus-visible:shadow-none"
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search leads, clients, payloads…"
            type="search"
            value={inputValue}
          />
          <kbd className="border border-(--line) rounded-[3px] bg-(--surface) text-(--ink-faint) px-1.25 py-px font-mono text-[10.5px]">
            ⌘ + K
          </kbd>
        </label>
      </div>

      <div className="flex items-center gap-2.5">
        {right}
        <div className="inline-flex items-center gap-1.5 border border-(--line) rounded-[20px] px-2 py-1 text-[11.5px] text-(--ink-muted) bg-(--surface)">
          <span className="w-1.5 h-1.5 rounded-full bg-(--signal)" />
          {user.role === 'admin' ? (
            <span>
              All clients ·{' '}
              <span className="font-mono tabular-nums">{clientCount ?? '—'}</span>
            </span>
          ) : (
            <span>
              {user.clients[0]?.name ?? 'Assigned client'}{' '}
              <span className="font-mono tabular-nums text-(--ink-faint)">
                {user.clients[0]?.client_key ?? 'client'}
              </span>
            </span>
          )}
        </div>
        <button
          className="inline-flex items-center justify-center rounded-md border border-(--line) bg-(--surface) text-(--ink-muted) cursor-pointer w-8 h-8 p-0 transition-all duration-180 ease-in-out"
          onClick={onThemeToggle}
          type="button"
        >
          <Icon name={themeMode === 'light' ? 'moon' : 'sun'} size={14} />
        </button>
        <button
          className="inline-flex items-center justify-center rounded-md border border-(--line) bg-(--surface) text-(--ink-muted) cursor-pointer w-8 h-8 p-0 transition-all duration-180 ease-in-out"
          onClick={onLogout}
          type="button"
        >
          <Icon name="logout" size={14} />
        </button>
      </div>
    </header>
  )
}

export default Topbar
