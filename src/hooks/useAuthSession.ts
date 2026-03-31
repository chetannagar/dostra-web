import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { AuthState, UserRole } from '../types/types.ts'
import { getPresetCredentials } from '../constants/app.ts'
import { getCurrentUser, getStoredToken, login, logout, setStoredToken } from '../services/api.ts'
import { getApiErrorMessage } from '../utils/errors.ts'

interface UseAuthSessionResult {
  authState: AuthState
  errorMessage: string | null
  isBootstrapping: boolean
  isLoginPending: boolean
  loginEmail: string
  loginPassword: string
  clearError: () => void
  clearSession: () => void
  handleLogin: (event: FormEvent<HTMLFormElement>) => Promise<void>
  handleLogout: () => Promise<void>
  setErrorMessage: (message: string | null) => void
  setLoginEmail: (value: string) => void
  setLoginPassword: (value: string) => void
  setPresetRole: (role: UserRole) => void
}

export function useAuthSession(): UseAuthSessionResult {
  const [authState, setAuthState] = useState<AuthState>({
    token: getStoredToken(),
    user: null,
  })
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [isLoginPending, setIsLoginPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loginEmail, setLoginEmail] = useState('admin@example.com')
  const [loginPassword, setLoginPassword] = useState('password')

  const clearError = useCallback(() => {
    setErrorMessage(null)
  }, [])

  const clearSession = useCallback(() => {
    setStoredToken(null)
    setAuthState({ token: null, user: null })
  }, [])

  const setPresetRole = useCallback((role: UserRole) => {
    const preset = getPresetCredentials(role)
    setLoginEmail(preset.email)
    setLoginPassword(preset.password)
  }, [])

  const handleLogin = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setIsLoginPending(true)
      clearError()

      try {
        const response = await login(loginEmail, loginPassword)
        setStoredToken(response.token)
        setAuthState({ token: response.token, user: response.user })
      } catch (error) {
        clearSession()
        setErrorMessage(getApiErrorMessage(error))
      } finally {
        setIsLoginPending(false)
      }
    },
    [clearError, clearSession, loginEmail, loginPassword],
  )

  const handleLogout = useCallback(async () => {
    try {
      await logout()
    } catch {
      // Local session clearing is still the priority.
    } finally {
      clearSession()
    }
  }, [clearSession])

  useEffect(() => {
    async function bootstrap() {
      if (!authState.token) {
        setIsBootstrapping(false)
        return
      }

      try {
        const user = await getCurrentUser()
        setAuthState({ token: authState.token, user })
      } catch (error) {
        clearSession()
        setErrorMessage(getApiErrorMessage(error))
      } finally {
        setIsBootstrapping(false)
      }
    }

    void bootstrap()
  }, [authState.token, clearSession])

  return {
    authState,
    clearError,
    clearSession,
    errorMessage,
    handleLogin,
    handleLogout,
    isBootstrapping,
    isLoginPending,
    loginEmail,
    loginPassword,
    setErrorMessage,
    setLoginEmail,
    setLoginPassword,
    setPresetRole,
  }
}
