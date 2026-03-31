import type { AuthUser, ClientSummary, Lead, LeadFilters, PaginationMeta, UserRecord } from '../types/types.ts'

const AUTH_TOKEN_KEY = 'dostra_auth_token'
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api').replace(
  /\/$/,
  '',
)

interface ApiClientSummary {
  id: number
  name: string
  client_key: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ApiUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'client'
  clients: ApiClientSummary[]
}

interface LoginResponse {
  token: string
  user: ApiUser
}

interface ApiLead {
  id: number
  client_id: number
  name: string | null
  email: string | null
  message: string | null
  source: string | null
  webhook_event_id: string | null
  raw_payload: Record<string, unknown> | null
  client: ApiClientSummary
  created_at: string
  updated_at: string
}

interface LeadListResponse {
  data: ApiLead[]
  meta: {
    current_page: number
    from: number | null
    last_page: number
    path: string
    per_page: number
    to: number | null
    total: number
  }
}

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    return
  }

  localStorage.removeItem(AUTH_TOKEN_KEY)
}

async function request<T>(path: string, options: RequestInit = {}) {
  const token = getStoredToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })

  if (response.status === 204) {
    return null as T
  }

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError('Request failed', response.status, body)
  }

  return body as T
}

function mapUser(user: ApiUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    clients: user.clients,
  }
}

function mapUserRecord(user: ApiUser): UserRecord {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    clients: user.clients,
  }
}

function mapLead(lead: ApiLead): Lead {
  return {
    id: lead.id,
    clientId: lead.client_id,
    clientName: lead.client.name,
    clientKey: lead.client.client_key,
    clientActive: lead.client.is_active,
    name: lead.name,
    email: lead.email,
    message: lead.message,
    source: lead.source,
    webhookEventId: lead.webhook_event_id,
    rawPayload: lead.raw_payload,
    createdAt: lead.created_at,
    updatedAt: lead.updated_at,
  }
}

function buildLeadQuery(filters: LeadFilters) {
  const params = new URLSearchParams()

  if (filters.clientId) params.set('client_id', filters.clientId)
  if (filters.email.trim()) params.set('email', filters.email.trim())
  if (filters.search.trim()) params.set('search', filters.search.trim())
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  params.set('per_page', String(filters.perPage))
  params.set('page', String(filters.page))

  return params.toString()
}

export async function login(email: string, password: string) {
  const response = await request<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  return {
    token: response.token,
    user: mapUser(response.user),
  }
}

export async function getCurrentUser() {
  const response = await request<ApiUser>('/me')
  return mapUser(response)
}

export async function logout() {
  await request('/logout', {
    method: 'POST',
  })
}

export async function getLeads(filters: LeadFilters) {
  const query = buildLeadQuery(filters)
  const response = await request<LeadListResponse>(`/leads${query ? `?${query}` : ''}`)

  return {
    data: response.data.map(mapLead),
    meta: {
      currentPage: response.meta.current_page,
      from: response.meta.from,
      lastPage: response.meta.last_page,
      path: response.meta.path,
      perPage: response.meta.per_page,
      to: response.meta.to,
      total: response.meta.total,
    } satisfies PaginationMeta,
  }
}

export async function getLead(leadId: number) {
  const response = await request<ApiLead>(`/leads/${leadId}`)
  return mapLead(response)
}

export async function getClients() {
  const response = await request<ApiClientSummary[]>('/clients')
  return response satisfies ClientSummary[]
}

export async function getUsers() {
  const response = await request<ApiUser[]>('/users')
  return response.map(mapUserRecord)
}
