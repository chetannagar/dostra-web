export type UserRole = 'admin' | 'client'

export type ThemeMode = 'light' | 'dark'

export type NavKey = 'dashboard' | 'leads' | 'clients' | 'users'

export interface ClientSummary {
  id: number
  name: string
  client_key: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserRecord {
  id: number
  name: string
  email: string
  role: UserRole
  clients: ClientSummary[]
}

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
  clients: ClientSummary[]
}

export interface AuthState {
  token: string | null
  user: AuthUser | null
}

export interface Lead {
  id: number
  clientId: number
  clientName: string
  clientKey: string
  clientActive: boolean
  name: string | null
  email: string | null
  message: string | null
  source: string | null
  webhookEventId: string | null
  rawPayload: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export interface LeadFilters {
  clientId: string
  email: string
  search: string
  from: string
  to: string
  perPage: number
  page: number
}

export interface PaginationMeta {
  currentPage: number
  from: number | null
  lastPage: number
  path: string
  perPage: number
  to: number | null
  total: number
}

export interface DashboardMetric {
  label: string
  value: string
  unit?: string
  delta?: string
  deltaDirection?: 'up' | 'down' | 'flat'
  spark: number[]
  sparkTone?: 'accent' | 'signal'
}

export interface DashboardHistogramPoint {
  label: string
  count: number
}

export interface QuickStatusItem {
  label: string
  value: string
  tone: 'neutral' | 'signal' | 'warn'
}

export interface RankedItem {
  label: string
  key: string
  count: number
  active?: boolean
}

export interface DashboardData {
  isDerived: boolean
  greeting: string
  timestampLabel: string
  metrics: DashboardMetric[]
  histogram: DashboardHistogramPoint[]
  quickStatus: QuickStatusItem[]
  rankedList: RankedItem[]
  recentLeads: Lead[]
}
