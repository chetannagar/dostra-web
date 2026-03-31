import { useEffect, useMemo, useState } from 'react'
import type { AuthUser, Lead, LeadFilters, PaginationMeta } from '../types/types.ts'
import { ApiError, getLead, getLeads } from '../services/api.ts'
import { defaultFilters } from '../constants/app.ts'
import { getApiErrorMessage } from '../utils/errors.ts'

interface UseLeadWorkspaceArgs {
  onUnauthorized: () => void
  setErrorMessage: (message: string | null) => void
  user: AuthUser | null
}

export function useLeadWorkspace({
  onUnauthorized,
  setErrorMessage,
  user,
}: UseLeadWorkspaceArgs) {
  const [filters, setFilters] = useState<LeadFilters>(defaultFilters)
  const [leads, setLeads] = useState<Lead[]>([])
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isLeadListLoading, setIsLeadListLoading] = useState(false)
  const [isLeadDetailLoading, setIsLeadDetailLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setFilters(defaultFilters)
      setLeads([])
      setPagination(null)
      setSelectedLeadId(null)
      setSelectedLead(null)
      return
    }

    async function loadLeads() {
      setIsLeadListLoading(true)
      setErrorMessage(null)

      try {
        const response = await getLeads(filters)
        setLeads(response.data)
        setPagination(response.meta)
        setSelectedLeadId((current) => {
          if (current && response.data.some((lead) => lead.id === current)) {
            return current
          }

          return response.data[0]?.id ?? null
        })
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          onUnauthorized()
          return
        }

        setErrorMessage(getApiErrorMessage(error))
      } finally {
        setIsLeadListLoading(false)
      }
    }

    void loadLeads()
  }, [filters, onUnauthorized, setErrorMessage, user])

  useEffect(() => {
    if (!selectedLeadId || !user) {
      setSelectedLead(null)
      return
    }

    const leadId = selectedLeadId

    async function loadLeadDetail() {
      setIsLeadDetailLoading(true)

      try {
        const lead = await getLead(leadId)
        setSelectedLead(lead)
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          onUnauthorized()
          return
        }

        setErrorMessage(getApiErrorMessage(error))
      } finally {
        setIsLeadDetailLoading(false)
      }
    }

    void loadLeadDetail()
  }, [onUnauthorized, selectedLeadId, setErrorMessage, user])

  const dashboardStats = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

    return {
      total: pagination?.total ?? leads.length,
      clientCount: new Set(leads.map((lead) => lead.clientId)).size,
      withEmailCount: leads.filter((lead) => Boolean(lead.email)).length,
      recentCount: leads.filter((lead) => new Date(lead.createdAt).getTime() >= oneWeekAgo).length,
    }
  }, [leads, pagination])

  function resetWorkspace() {
    setFilters(defaultFilters)
    setSelectedLeadId(null)
    setSelectedLead(null)
  }

  return {
    dashboardStats,
    filters,
    isLeadDetailLoading,
    isLeadListLoading,
    leads,
    pagination,
    resetWorkspace,
    selectedLead,
    selectedLeadId,
    setFilters,
    setSelectedLeadId,
  }
}
