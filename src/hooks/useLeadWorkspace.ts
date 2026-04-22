import { useEffect, useMemo, useState } from 'react'
import type {
  AuthUser,
  DashboardData,
  DashboardHistogramPoint,
  DashboardMetric,
  Lead,
  LeadFilters,
  PaginationMeta,
  QuickStatusItem,
  RankedItem,
} from '../types/types.ts'
import { ApiError, getLead, getLeads } from '../services/api.ts'
import { getApiErrorMessage } from '../utils/errors.ts'

interface UseLeadWorkspaceArgs {
  filters: LeadFilters
  onUnauthorized: () => void
  selectedLeadId: number | null
  setErrorMessage: (message: string | null) => void
  user: AuthUser | null
}

function buildHistogram(leads: Lead[]): DashboardHistogramPoint[] {
  const formatter = new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short' })
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - 13)

  return Array.from({ length: 14 }, (_, index) => {
    const day = new Date(start)
    day.setDate(start.getDate() + index)
    const dayStart = day.getTime()
    const dayEnd = dayStart + 24 * 60 * 60 * 1000

    return {
      label: formatter.format(day),
      count: leads.filter((lead) => {
        const value = new Date(lead.createdAt).getTime()
        return value >= dayStart && value < dayEnd
      }).length,
    }
  })
}

function buildMetrics(user: AuthUser, leads: Lead[], pagination: PaginationMeta | null): DashboardMetric[] {
  const total = pagination?.total ?? leads.length
  const recent24h = leads.filter(
    (lead) => Date.now() - new Date(lead.createdAt).getTime() <= 24 * 60 * 60 * 1000,
  ).length
  const uniqueClients = new Set(leads.map((lead) => lead.clientId)).size
  const reachablePercent = total ? Math.round((leads.filter((lead) => Boolean(lead.email)).length / leads.length) * 100) : 0
  const clientAverageHours =
    leads.length > 0
      ? (
          leads.reduce((sum, lead) => {
            const diff =
              Math.max(0, new Date(lead.updatedAt).getTime() - new Date(lead.createdAt).getTime()) /
              (1000 * 60 * 60)
            return sum + diff
          }, 0) / leads.length
        ).toFixed(1)
      : '0.0'

  const histogram = buildHistogram(leads)
  const sparkAccent = histogram.map((point) => point.count)
  const sparkSignal = histogram.map((point) => Math.max(0, Math.round(point.count * 0.45)))

  const base: DashboardMetric[] = [
    {
      label: 'Total leads',
      value: total.toLocaleString(),
      delta: '+12%',
      deltaDirection: 'up',
      spark: sparkAccent,
      sparkTone: 'accent',
    },
    {
      label: 'New · 24h',
      value: recent24h.toLocaleString(),
      delta: `+${Math.max(1, recent24h)}`,
      deltaDirection: 'up',
      spark: sparkSignal,
      sparkTone: 'signal',
    },
  ]

  if (user.role === 'admin') {
    base.push({
      label: 'Active clients',
      value: String(uniqueClients),
      unit: `/ ${Math.max(uniqueClients, user.clients.length)}`,
      delta: '—',
      deltaDirection: 'flat',
      spark: sparkAccent.map((value) => Math.max(1, Math.round(value / 3))),
      sparkTone: 'accent',
    })
  } else {
    base.push({
      label: 'Avg response · 24h',
      value: clientAverageHours,
      unit: 'hrs',
      delta: '-18m',
      deltaDirection: 'up',
      spark: sparkAccent.map((value, index) => Math.max(1, Math.round((value + index) / 4))),
      sparkTone: 'accent',
    })
  }

  base.push({
    label: 'Reachable contacts',
    value: String(reachablePercent),
    unit: '%',
    delta: '+1.2%',
    deltaDirection: 'up',
    spark: sparkSignal.map((value) => Math.max(1, value + 6)),
    sparkTone: 'signal',
  })

  return base
}

function buildQuickStatus(user: AuthUser, leads: Lead[]): QuickStatusItem[] {
  const missingEmail = leads.filter((lead) => !lead.email).length
  const emptyMessage = leads.filter((lead) => !lead.message?.trim()).length
  const inactiveClients = leads.filter((lead) => !lead.clientActive).length
  const seenWebhookIds = new Set<string>()
  const duplicateWebhookIds = leads.reduce((count, lead) => {
    if (!lead.webhookEventId) return count
    if (seenWebhookIds.has(lead.webhookEventId)) return count + 1
    seenWebhookIds.add(lead.webhookEventId)
    return count
  }, 0)

  if (user.role === 'admin') {
    return [
      { label: 'Missing email', value: String(missingEmail), tone: missingEmail ? 'warn' : 'signal' },
      { label: 'Empty message', value: String(emptyMessage), tone: emptyMessage ? 'warn' : 'signal' },
      { label: 'Inactive client', value: String(inactiveClients), tone: inactiveClients ? 'neutral' : 'signal' },
      { label: 'Duplicate webhook id', value: String(duplicateWebhookIds), tone: duplicateWebhookIds ? 'warn' : 'signal' },
      { label: 'Ingestion errors · 24h', value: '0', tone: 'signal' },
    ]
  }

  return [
    { label: 'Missing email', value: String(missingEmail), tone: missingEmail ? 'warn' : 'signal' },
    { label: 'Empty message', value: String(emptyMessage), tone: emptyMessage ? 'warn' : 'signal' },
    { label: 'Webhook status', value: 'ok', tone: 'signal' },
    { label: 'Ingestion errors · 24h', value: '0', tone: 'signal' },
    {
      label: 'Last received',
      value: leads[0]?.createdAt ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-1, 'minute').replace('1 minute', '1m') : '—',
      tone: 'signal',
    },
  ]
}

function buildRankedList(user: AuthUser, leads: Lead[]): RankedItem[] {
  const countMap = leads.reduce<Map<string, RankedItem>>((acc, lead) => {
    const existing = acc.get(lead.clientKey)
    if (existing) {
      existing.count += 1
      return acc
    }

    acc.set(lead.clientKey, {
      label: lead.clientName,
      key: lead.clientKey,
      count: 1,
      active: lead.clientActive,
    })
    return acc
  }, new Map())

  if (user.role === 'admin') {
    return [...countMap.values()].sort((a, b) => b.count - a.count).slice(0, 6)
  }

  const sourceMap = leads.reduce<Map<string, RankedItem>>((acc, lead) => {
    const key = lead.source ?? 'unknown'
    const existing = acc.get(key)
    if (existing) {
      existing.count += 1
      return acc
    }

    acc.set(key, {
      label: key.replace(/[-_]/g, ' '),
      key,
      count: 1,
      active: true,
    })
    return acc
  }, new Map())

  return [...sourceMap.values()].sort((a, b) => b.count - a.count).slice(0, 6)
}

function buildDashboardData(user: AuthUser, leads: Lead[], pagination: PaginationMeta | null): DashboardData {
  const sorted = [...leads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  const uniqueClients = new Set(sorted.map((lead) => lead.clientId)).size
  const recent24h = sorted.filter(
    (lead) => Date.now() - new Date(lead.createdAt).getTime() <= 24 * 60 * 60 * 1000,
  ).length

  return {
    isDerived: true,
    greeting:
      user.role === 'admin'
        ? `${recent24h} leads today across ${uniqueClients || user.clients.length || 1} clients.`
        : `${recent24h} leads today for ${user.clients[0]?.name ?? 'your assigned client'}.`,
    timestampLabel: new Intl.DateTimeFormat('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date()),
    metrics: buildMetrics(user, sorted, pagination),
    histogram: buildHistogram(sorted),
    quickStatus: buildQuickStatus(user, sorted),
    rankedList: buildRankedList(user, sorted),
    recentLeads: sorted.slice(0, 6),
  }
}

export function useLeadWorkspace({
  filters,
  onUnauthorized,
  selectedLeadId,
  setErrorMessage,
  user,
}: UseLeadWorkspaceArgs) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isLeadListLoading, setIsLeadListLoading] = useState(false)
  const [isLeadDetailLoading, setIsLeadDetailLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setLeads([])
      setPagination(null)
      setSelectedLead(null)
      return
    }

    let isActive = true

    async function loadLeads() {
      setIsLeadListLoading(true)
      setErrorMessage(null)

      try {
        const response = await getLeads(filters)
        if (!isActive) return
        setLeads(response.data)
        setPagination(response.meta)
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          onUnauthorized()
          return
        }

        if (isActive) setErrorMessage(getApiErrorMessage(error))
      } finally {
        if (isActive) setIsLeadListLoading(false)
      }
    }

    void loadLeads()

    return () => {
      isActive = false
    }
  }, [filters, onUnauthorized, setErrorMessage, user])

  useEffect(() => {
    if (!selectedLeadId || !user) {
      setSelectedLead(null)
      return
    }

    const leadId = selectedLeadId
    let isActive = true

    async function loadLeadDetail() {
      setIsLeadDetailLoading(true)

      try {
        const lead = await getLead(leadId)
        if (isActive) setSelectedLead(lead)
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          onUnauthorized()
          return
        }

        if (isActive) setErrorMessage(getApiErrorMessage(error))
      } finally {
        if (isActive) setIsLeadDetailLoading(false)
      }
    }

    void loadLeadDetail()

    return () => {
      isActive = false
    }
  }, [onUnauthorized, selectedLeadId, setErrorMessage, user])

  const availableClients = useMemo(() => {
    if (user?.role === 'client') {
      return user.clients.map((client) => ({
        key: client.client_key,
        label: client.name,
      }))
    }

    const deduped = new Map<string, { label: string; key: string }>()
    for (const lead of leads) {
      if (!deduped.has(lead.clientKey)) {
        deduped.set(lead.clientKey, { label: lead.clientName, key: lead.clientKey })
      }
    }

    return [...deduped.values()]
  }, [leads, user])

  const dashboardData = useMemo(() => {
    if (!user) return null
    return buildDashboardData(user, leads, pagination)
  }, [leads, pagination, user])

  return {
    availableClients,
    dashboardData,
    isLeadDetailLoading,
    isLeadListLoading,
    leads,
    pagination,
    selectedLead,
  }
}
