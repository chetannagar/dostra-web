import type { LeadFilters, ThemeMode, UserRole } from '../types/types.ts'

export const STORAGE_KEYS = {
  sidebarCollapsed: 'dostra_sidebar_collapsed',
  themeMode: 'dostra_theme_mode',
} as const

export const defaultFilters: LeadFilters = {
  clientId: '',
  email: '',
  search: '',
  from: '',
  to: '',
  perPage: 50,
  page: 1,
}

export function getPresetCredentials(role: UserRole) {
  return {
    email: role === 'admin' ? 'admin@example.com' : 'client@example.com',
    password: 'password',
  }
}

export function getStoredThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEYS.themeMode)
  return stored === 'dark' ? 'dark' : 'light'
}

export function setStoredThemeMode(mode: ThemeMode) {
  window.localStorage.setItem(STORAGE_KEYS.themeMode, mode)
}

export function getStoredSidebarCollapsed() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === 'true'
}

export function setStoredSidebarCollapsed(collapsed: boolean) {
  window.localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(collapsed))
}

export function getCurrentLocation() {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
  }
}

export function navigateTo(pathname: string, search?: URLSearchParams, replace = false) {
  const suffix = search && search.toString() ? `?${search.toString()}` : ''
  const nextUrl = `${pathname}${suffix}`
  window.history[replace ? 'replaceState' : 'pushState'](null, '', nextUrl)
}

export function parseLeadFilters(search: string): LeadFilters {
  const params = new URLSearchParams(search)

  return {
    clientId: params.get('client') ?? '',
    email: params.get('email') ?? '',
    search: params.get('search') ?? '',
    from: params.get('from') ?? '',
    to: params.get('to') ?? '',
    perPage: Number(params.get('per_page') ?? defaultFilters.perPage) || defaultFilters.perPage,
    page: Math.max(1, Number(params.get('page') ?? defaultFilters.page) || defaultFilters.page),
  }
}

export function parseSelectedLeadId(search: string) {
  const selected = new URLSearchParams(search).get('selected')
  if (!selected) return null

  const id = Number(selected)
  return Number.isFinite(id) ? id : null
}

export function buildLeadSearch(filters: LeadFilters, selectedLeadId: number | null) {
  const params = new URLSearchParams()

  if (filters.clientId) params.set('client', filters.clientId)
  if (filters.email.trim()) params.set('email', filters.email.trim())
  if (filters.search.trim()) params.set('search', filters.search.trim())
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  if (filters.page > 1) params.set('page', String(filters.page))
  if (filters.perPage !== defaultFilters.perPage) params.set('per_page', String(filters.perPage))
  if (selectedLeadId) params.set('selected', String(selectedLeadId))

  return params
}
