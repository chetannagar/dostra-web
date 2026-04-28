import { useEffect, useMemo, useState } from 'react'
import { buildLeadSearch, defaultFilters, getCurrentLocation, navigateTo, parseLeadFilters, parseSelectedLeadId } from './utils/router.ts'
import { getStoredSidebarCollapsed, getStoredThemeMode, setStoredSidebarCollapsed, setStoredThemeMode } from './utils/storage.ts'
import { useAuthSession } from './hooks/useAuthSession.ts'
import { useLeadWorkspace } from './hooks/useLeadWorkspace.ts'
import { getClients } from './services/api.ts'
import type { LeadFilters, NavKey, ThemeMode } from './types/types.ts'
import Sidebar from './components/Sidebar.tsx'
import Topbar from './components/Topbar.tsx'
import DashboardView from './components/DashboardView.tsx'
import LeadListPanel from './components/LeadListPanel.tsx'
import LeadDetailCard from './components/LeadDetailCard.tsx'
import LoginView from './components/LoginView.tsx'
import Icon from './components/Icon.tsx'

function getRoute(pathname: string) {
  if (pathname === '/login') return { name: 'login' as const }
  if (pathname === '/leads') return { name: 'leads' as const }

  const detailMatch = pathname.match(/^\/leads\/(\d+)$/)
  if (detailMatch) {
    return { name: 'lead-detail' as const, leadId: Number(detailMatch[1]) }
  }

  return { name: 'dashboard' as const }
}

function App() {
  const [locationState, setLocationState] = useState(getCurrentLocation)
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredThemeMode)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(getStoredSidebarCollapsed)
  const [totalClientCount, setTotalClientCount] = useState<number | null>(null)
  const {
    authState,
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
  } = useAuthSession()

  useEffect(() => {
    function syncLocation() {
      setLocationState(getCurrentLocation())
    }

    window.addEventListener('popstate', syncLocation)
    return () => window.removeEventListener('popstate', syncLocation)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode
    setStoredThemeMode(themeMode)
  }, [themeMode])

  useEffect(() => {
    setStoredSidebarCollapsed(sidebarCollapsed)
  }, [sidebarCollapsed])

  useEffect(() => {
    if (authState.user?.role !== 'admin') return
    getClients().then((clients) => setTotalClientCount(clients.length)).catch(() => {})
  }, [authState.user])

  const effectivePathname = !authState.user
    ? '/login'
    : locationState.pathname === '/login'
      ? '/'
      : locationState.pathname
  const route = useMemo(() => getRoute(effectivePathname), [effectivePathname])
  const leadFilters = useMemo(
    () => (route.name === 'leads' ? parseLeadFilters(locationState.search) : defaultFilters),
    [locationState.search, route.name],
  )
  const selectedLeadId = useMemo(() => {
    if (route.name === 'lead-detail') return route.leadId
    if (route.name === 'leads') return parseSelectedLeadId(locationState.search)
    return null
  }, [locationState.search, route])

  const {
    availableClients,
    dashboardData,
    isLeadDetailLoading,
    isLeadListLoading,
    leads,
    pagination,
    selectedLead,
  } = useLeadWorkspace({
    filters: leadFilters,
    onUnauthorized: clearSession,
    selectedLeadId,
    setErrorMessage,
    user: authState.user,
  })

  useEffect(() => {
    if (isBootstrapping) return

    if (!authState.user && locationState.pathname !== '/login') {
      navigateTo('/login', undefined, true)
      return
    }

    if (authState.user && locationState.pathname === '/login') {
      navigateTo('/', undefined, true)
    }
  }, [authState.user, isBootstrapping, locationState.pathname])

  function setLeadFilters(nextFilters: LeadFilters, nextSelectedLeadId: number | null = selectedLeadId) {
    const search = buildLeadSearch(nextFilters, nextSelectedLeadId)
    navigateTo('/leads', search)
    setLocationState(getCurrentLocation())
  }

  function goToDashboard() {
    navigateTo('/')
    setLocationState(getCurrentLocation())
  }

  function goToLeads(nextSelectedLeadId: number | null = selectedLeadId) {
    navigateTo('/leads', buildLeadSearch(leadFilters, nextSelectedLeadId))
    setLocationState(getCurrentLocation())
  }

  function goToLeadDetail(leadId: number) {
    navigateTo(`/leads/${leadId}`)
    setLocationState(getCurrentLocation())
  }

  const topbarCrumbs =
    route.name === 'dashboard'
      ? ['Dashboard']
      : route.name === 'leads'
        ? authState.user?.role === 'admin'
          ? ['Leads']
          : ['Leads', authState.user?.clients[0]?.name ?? 'Assigned client']
        : authState.user?.role === 'admin'
          ? ['Leads', `#${selectedLeadId ?? ''} · ${selectedLead?.name ?? 'Lead'}`]
          : ['Leads', authState.user?.clients[0]?.name ?? 'Assigned client', `#${selectedLeadId ?? ''}`]

  const shellAction =
    route.name === 'dashboard' ? (
      <button
        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-(--line) bg-(--surface) text-(--ink-muted) cursor-pointer px-2.75 py-2 text-[12.5px] transition-all duration-180 ease-in-out"
        type="button"
      >
        <Icon name="clock" size={13} />
        Last 14 days
      </button>
    ) : route.name === 'leads' ? (
      <>
        <button
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-(--line) bg-(--surface) text-(--ink-muted) cursor-not-allowed px-2.75 py-2 text-[12.5px] opacity-75 transition-all duration-180 ease-in-out"
          disabled
          type="button"
        >
          <Icon name="filter" size={13} />
          Filters{' '}
          <span className="inline-flex items-center gap-1 rounded border border-(--line) px-1.75 py-0.75 font-mono text-[10.5px] uppercase tracking-[0.8px] text-(--ink-faint)">
            soon
          </span>
        </button>
        <button
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-(--line) bg-(--surface) text-(--ink-muted) cursor-not-allowed px-2.75 py-2 text-[12.5px] opacity-75 transition-all duration-180 ease-in-out"
          disabled
          type="button"
        >
          <Icon name="plus" size={13} />
          Add lead{' '}
          <span className="inline-flex items-center gap-1 rounded border border-(--line) px-1.75 py-0.75 font-mono text-[10.5px] uppercase tracking-[0.8px] text-(--ink-faint)">
            soon
          </span>
        </button>
      </>
    ) : (
      <button
        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-(--line) bg-(--surface) text-(--ink-muted) cursor-not-allowed px-2.75 py-2 text-[12.5px] opacity-75 transition-all duration-180 ease-in-out"
        disabled
        type="button"
      >
        Edit lead{' '}
        <span className="inline-flex items-center gap-1 rounded border border-(--line) px-1.75 py-0.75 font-mono text-[10.5px] uppercase tracking-[0.8px] text-(--ink-faint)">
          soon
        </span>
      </button>
    )

  if (isBootstrapping) {
    return (
      <main className="min-h-screen grid place-items-center p-8 bg-(--bg)">
        <div className="flex flex-col gap-1.5 border border-(--line) rounded-[10px] bg-(--surface) p-6 text-(--ink-muted)">
          <h3 className="text-(--ink) text-lg font-medium">Restoring session…</h3>
          <p>Checking the stored bearer token against `/api/me`.</p>
        </div>
      </main>
    )
  }

  if (!authState.user) {
    return (
      <LoginView
        email={loginEmail}
        errorMessage={errorMessage}
        isSubmitting={isLoginPending}
        onEmailChange={setLoginEmail}
        onPasswordChange={setLoginPassword}
        onSubmit={handleLogin}
        password={loginPassword}
      />
    )
  }

  const currentNav: NavKey = route.name === 'dashboard' ? 'dashboard' : 'leads'

  return (
    <div className="h-screen flex bg-(--bg) text-(--ink)">
      <Sidebar
        collapsed={sidebarCollapsed}
        current={currentNav}
        onNav={(key) => {
          if (key === 'dashboard') goToDashboard()
          if (key === 'leads') goToLeads()
        }}
        onToggle={() => setSidebarCollapsed((current) => !current)}
        user={authState.user}
      />

      <div className="min-w-0 flex-1 flex flex-col min-h-0">
        <Topbar
          clientCount={totalClientCount}
          crumbs={topbarCrumbs}
          onLogout={handleLogout}
          onSearch={(query) => {
            setLeadFilters({ ...leadFilters, search: query, page: 1 })
          }}
          onThemeToggle={() => setThemeMode((current) => (current === 'light' ? 'dark' : 'light'))}
          right={shellAction}
          searchQuery={leadFilters.search}
          themeMode={themeMode}
          user={authState.user}
        />

        {errorMessage ? (
          <p className="mx-7 mt-4.5 border border-[color-mix(in_srgb,var(--danger)_25%,var(--line))] rounded-lg bg-[color-mix(in_srgb,var(--danger)_10%,var(--surface))] text-(--danger) px-3.5 py-3 text-[13px]">
            {errorMessage}
          </p>
        ) : null}

        {route.name === 'dashboard' ? (
          <DashboardView
            activeUser={authState.user}
            dashboardData={dashboardData}
            onLeadOpen={(leadId) => goToLeadDetail(leadId)}
          />
        ) : null}

        {route.name === 'leads' ? (
          <LeadListPanel
            activeUser={authState.user}
            availableClients={availableClients}
            filters={leadFilters}
            isLoading={isLeadListLoading}
            onFilterChange={(next) => setLeadFilters(next)}
            onLeadOpen={goToLeadDetail}
            onLeadSelect={(leadId) => setLeadFilters(leadFilters, leadId)}
            onPageChange={(page) => setLeadFilters({ ...leadFilters, page })}
            pagination={pagination}
            previewLead={selectedLead}
            selectedLeadId={selectedLeadId}
            visibleLeads={leads}
          />
        ) : null}

        {route.name === 'lead-detail' ? (
          <LeadDetailCard
            isLoading={isLeadDetailLoading}
            lead={selectedLead}
            onBack={() => goToLeads(selectedLeadId)}
          />
        ) : null}
      </div>
    </div>
  )
}

export default App
