import { useEffect, useState } from 'react'
import type { TabKey } from './types/types.ts'
import { getInitialTab, syncHash } from './constants/app.ts'
import { useAuthSession } from './hooks/useAuthSession.ts'
import { useLeadWorkspace } from './hooks/useLeadWorkspace.ts'
import Sidebar from './components/Sidebar.tsx'
import Topbar from './components/Topbar.tsx'
import DashboardView from './components/DashboardView.tsx'
import LeadListPanel from './components/LeadListPanel.tsx'
import LeadDetailCard from './components/LeadDetailCard.tsx'
import LoginView from './components/LoginView.tsx'
import './styles/shared.css'
import './styles/layout.css'

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>(getInitialTab())
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
    setPresetRole,
  } = useAuthSession()
  const safeActiveTab = activeTab === 'clients' || activeTab === 'users' ? 'dashboard' : activeTab
  const {
    dashboardStats,
    filters,
    isLeadDetailLoading,
    isLeadListLoading,
    leads,
    pagination,
    selectedLead,
    selectedLeadId,
    setFilters,
    setSelectedLeadId,
  } = useLeadWorkspace({
    onUnauthorized: clearSession,
    setErrorMessage,
    user: authState.user,
  })
  useEffect(() => {
    syncHash(safeActiveTab)
  }, [safeActiveTab])

  if (isBootstrapping) {
    return (
      <main className="auth-shell">
        <section className="auth-panel surface-card">
          <div className="empty-state">
            <h4>Restoring session...</h4>
            <p>Checking the stored bearer token against `/api/me`.</p>
          </div>
        </section>
      </main>
    )
  }

  if (!authState.user) {
    return (
      <LoginView
        email={loginEmail}
        errorMessage={errorMessage}
        isSubmitting={isLoginPending}
        password={loginPassword}
        onEmailChange={setLoginEmail}
        onPasswordChange={setLoginPassword}
        onPresetSelect={setPresetRole}
        onSubmit={handleLogin}
      />
    )
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={safeActiveTab}
        activeUser={authState.user}
        onLogout={handleLogout}
        onTabChange={setActiveTab}
      />

      <main className="workspace">
        <Topbar
          activeTab={safeActiveTab}
          activeUser={authState.user}
          filters={filters}
          onFilterChange={setFilters}
          onLogout={handleLogout}
          onRefresh={() => setFilters((current) => ({ ...current }))}
        />

        {errorMessage ? <p className="error-banner surface-card">{errorMessage}</p> : null}

        {safeActiveTab === 'dashboard' ? (
          <DashboardView
            activeUser={authState.user}
            dashboardStats={dashboardStats}
            visibleLeads={leads}
            onLeadOpen={(leadId) => {
              setSelectedLeadId(leadId)
              setActiveTab('lead-detail')
            }}
          />
        ) : null}

        {safeActiveTab === 'leads' ? (
          <LeadListPanel
            isLoading={isLeadListLoading}
            pagination={pagination}
            selectedLeadId={selectedLeadId}
            visibleLeads={leads}
            onLeadSelect={(leadId) => {
              setSelectedLeadId(leadId)
              setActiveTab('lead-detail')
            }}
            onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
          />
        ) : null}

        {safeActiveTab === 'lead-detail' ? (
          <LeadDetailCard isLoading={isLeadDetailLoading} lead={selectedLead} />
        ) : null}

      </main>
    </div>
  )
}

export default App
