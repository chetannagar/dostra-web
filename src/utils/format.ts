import type { Lead, UserRole } from '../types/types.ts'

export function shortDate(value: string) {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(value))
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function timeAgo(value: string) {
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.max(1, Math.round(diff / (1000 * 60)))

  if (minutes < 60) return `${minutes}m`

  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h`

  const days = Math.round(hours / 24)
  return `${days}d`
}

export function verboseTimeAgo(value: string) {
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.max(1, Math.round(diff / (1000 * 60)))

  if (minutes < 60) return `${minutes} min ago`

  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hr ago`

  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function relativeRoleLabel(role: UserRole) {
  return role === 'admin' ? 'Administrator access' : 'Client workspace'
}

export function isFreshLead(lead: Lead) {
  return Date.now() - new Date(lead.createdAt).getTime() <= 24 * 60 * 60 * 1000
}

export function formatLeadReceived(lead: Lead) {
  return `${timeAgo(lead.createdAt)} ago`
}

export function getPayloadEntries(payload: Record<string, unknown> | null) {
  return Object.entries(payload ?? {})
}

export function stringifyPayload(payload: Record<string, unknown> | null) {
  return JSON.stringify(payload ?? {}, null, 2)
}
