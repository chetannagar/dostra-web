import { useEffect, useState } from 'react'
import type { AuthUser, ClientSummary, TabKey, UserRecord } from '../types/types.ts'
import { getClients, getUsers } from '../services/api.ts'
import { getApiErrorMessage } from '../utils/errors.ts'

interface UseAdminResourcesArgs {
  activeTab: TabKey
  setErrorMessage: (message: string | null) => void
  user: AuthUser | null
}

export function useAdminResources({
  activeTab,
  setErrorMessage,
  user,
}: UseAdminResourcesArgs) {
  const [clients, setClients] = useState<ClientSummary[]>([])
  const [users, setUsers] = useState<UserRecord[]>([])
  const [isClientsLoading, setIsClientsLoading] = useState(false)
  const [isUsersLoading, setIsUsersLoading] = useState(false)

  useEffect(() => {
    if (!user || activeTab !== 'clients') {
      return
    }

    async function loadClients() {
      setIsClientsLoading(true)

      try {
        const response = await getClients()
        setClients(response)
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error))
      } finally {
        setIsClientsLoading(false)
      }
    }

    void loadClients()
  }, [activeTab, setErrorMessage, user])

  useEffect(() => {
    if (!user || user.role !== 'admin' || activeTab !== 'users') {
      return
    }

    async function loadUsers() {
      setIsUsersLoading(true)

      try {
        const response = await getUsers()
        setUsers(response)
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error))
      } finally {
        setIsUsersLoading(false)
      }
    }

    void loadUsers()
  }, [activeTab, setErrorMessage, user])

  useEffect(() => {
    if (!user) {
      setClients([])
      setUsers([])
    }
  }, [user])

  return {
    clients,
    isClientsLoading,
    isUsersLoading,
    users,
  }
}
