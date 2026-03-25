export type UserRole = 'admin' | 'client'
export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal_sent'
  | 'won'
  | 'lost'

export type TabKey = 'dashboard' | 'leads' | 'pipeline'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface Lead {
  id: number
  name: string
  email: string
  phone: string
  company: string
  value: number
  status: LeadStatus
  source: string
  notes: string
  assignedClientId: number | null
  assignedClientName: string | null
  owner: string
  updatedAt: string
  createdAt: string
}

export interface LeadFormState {
  name: string
  email: string
  phone: string
  company: string
  value: string
  status: LeadStatus
  source: string
  notes: string
  assignedClientId: string
}