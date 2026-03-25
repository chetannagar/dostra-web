import type { UserRole } from '../types/types.ts'

export function currency(value: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function shortDate(value: string) {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function relativeRoleLabel(role: UserRole) {
  return role === 'admin' ? 'Administrator access' : 'Client workspace'
}
