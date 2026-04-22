import { useMemo } from 'react'
import type { ClientSummary, UserRecord } from '../types/types.ts'

export function useAdminResources() {
  return useMemo(
    () => ({
      clients: [] as ClientSummary[],
      isClientsLoading: false,
      isUsersLoading: false,
      users: [] as UserRecord[],
    }),
    [],
  )
}
