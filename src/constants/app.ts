import type { LeadFilters, TabKey, UserRole } from '../types/types.ts'

export const defaultFilters: LeadFilters = {
  clientId: '',
  email: '',
  search: '',
  from: '',
  to: '',
  perPage: 10,
  page: 1,
}

export const routeToTab: Record<string, TabKey> = {
  dashboard: 'dashboard',
  leads: 'leads',
  'lead-detail': 'lead-detail',
  clients: 'clients',
  users: 'users',
}

export function getInitialTab() {
  const hash = window.location.hash.replace(/^#\/?/, '')
  return routeToTab[hash] ?? 'dashboard'
}

export function syncHash(tab: TabKey) {
  window.history.replaceState(null, '', `#/${tab}`)
}

export function isAdminOnlyTab(tab: TabKey) {
  return tab === 'clients' || tab === 'users'
}

export function getPresetCredentials(role: UserRole) {
  return {
    email: role === 'admin' ? 'admin@example.com' : 'client@example.com',
    password: 'password',
  }
}
