import type { Lead, LeadFormState, LeadStatus, User } from '../types/types.ts'
import LeadData from '../data/leads.json'

export const users: User[] = [
  { id: 1, name: 'Maya Patel', email: 'maya@northstarcrm.com', role: 'admin' },
  { id: 2, name: 'Acme Ventures', email: 'ops@acmeventures.com', role: 'client' },
  { id: 3, name: 'BrightPath Labs', email: 'growth@brightpathlabs.com', role: 'client' },
]

export const initialLeads: Lead[] = LeadData as Lead[]

export const statusOrder: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'proposal_sent',
  'won',
  'lost',
]

export const statusLabel: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal_sent: 'Proposal Sent',
  won: 'Won',
  lost: 'Lost',
}

export const emptyForm: LeadFormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  value: '',
  status: 'new',
  source: '',
  notes: '',
  assignedClientId: '',
}
