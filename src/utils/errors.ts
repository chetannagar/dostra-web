import { ApiError } from '../services/api.ts'

export function getApiErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'The session is not valid. Sign in again.'
    if (error.status === 403) return 'This account is not allowed to access that resource.'
    if (error.status === 422) return 'The submitted credentials were rejected.'
    if (error.status === 429) return 'Too many requests. Wait and retry.'
  }

  return 'The API request failed. Check that the backend is running and VITE_API_BASE_URL is correct.'
}
