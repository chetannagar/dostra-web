import type { ThemeMode } from '../types/types.ts'

export const STORAGE_KEYS = {
  sidebarCollapsed: 'dostra_sidebar_collapsed',
  themeMode: 'dostra_theme_mode',
} as const

export function getStoredThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEYS.themeMode)
  return stored === 'dark' ? 'dark' : 'light'
}

export function setStoredThemeMode(mode: ThemeMode) {
  window.localStorage.setItem(STORAGE_KEYS.themeMode, mode)
}

export function getStoredSidebarCollapsed() {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === 'true'
}

export function setStoredSidebarCollapsed(collapsed: boolean) {
  window.localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(collapsed))
}
