import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { Lead, LeadFormState, LeadStatus, TabKey, User } from './types/types.ts'
import {
  emptyForm,
  initialLeads,
  statusOrder,
  users,
} from './constants/app.ts'
import Sidebar from './components/Sidebar.tsx'
import Topbar from './components/Topbar.tsx'
import DashboardView from './components/DashboardView.tsx'
import LeadListPanel from './components/LeadListPanel.tsx'
import LeadDetailCard from './components/LeadDetailCard.tsx'
import LeadFormCard from './components/LeadFormCard.tsx'
import PipelineView from './components/PipelineView.tsx'
import './App.css'

function App() {
  const [activeUser, setActiveUser] = useState<User>(users[0])
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all')
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [selectedLeadId, setSelectedLeadId] = useState<number>(initialLeads[0].id)
  const [editingLeadId, setEditingLeadId] = useState<number | null>(null)
  const [formState, setFormState] = useState<LeadFormState>(emptyForm)

  const visibleLeads = useMemo(() => {
    const allowedLeads =
      activeUser.role === 'admin'
        ? leads
        : leads.filter((lead) => lead.assignedClientId === activeUser.id)

    return allowedLeads.filter((lead) => {
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
      const haystack = `${lead.name} ${lead.email} ${lead.phone} ${lead.company}`
        .toLowerCase()
        .trim()
      const matchesSearch = haystack.includes(search.toLowerCase().trim())

      return matchesStatus && matchesSearch
    })
  }, [activeUser, leads, search, statusFilter])

  const selectedLead =
    visibleLeads.find((lead) => lead.id === selectedLeadId) ?? visibleLeads[0] ?? null

  const dashboardStats = useMemo(() => {
    const total = visibleLeads.length
    const pipelineValue = visibleLeads.reduce((sum, lead) => sum + lead.value, 0)
    const wonValue = visibleLeads
      .filter((lead) => lead.status === 'won')
      .reduce((sum, lead) => sum + lead.value, 0)
    const urgentCount = visibleLeads.filter(
      (lead) => lead.status === 'new' || lead.status === 'proposal_sent',
    ).length

    return { total, pipelineValue, wonValue, urgentCount }
  }, [visibleLeads])

  const pipelineGroups = statusOrder.map((status) => ({
    status,
    leads: visibleLeads.filter((lead) => lead.status === status),
  }))

  function switchUser(userId: number) {
    const nextUser = users.find((user) => user.id === userId)

    if (!nextUser) {
      return
    }

    setActiveUser(nextUser)
    setActiveTab('dashboard')
    setSearch('')
    setStatusFilter('all')
    setEditingLeadId(null)
  }

  function openCreateLead() {
    setEditingLeadId(null)
    setFormState(emptyForm)
    setActiveTab('leads')
  }

  function openEditLead(lead: Lead) {
    setEditingLeadId(lead.id)
    setFormState({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      value: String(lead.value),
      status: lead.status,
      source: lead.source,
      notes: lead.notes,
      assignedClientId: lead.assignedClientId ? String(lead.assignedClientId) : '',
    })
    setSelectedLeadId(lead.id)
  }

  function resetEditor() {
    setEditingLeadId(null)
    setFormState(emptyForm)
  }

  function saveLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (activeUser.role !== 'admin') {
      return
    }

    const assignedClient = users.find(
      (user) => user.role === 'client' && String(user.id) === formState.assignedClientId,
    )

    const nextLead: Lead = {
      id: editingLeadId ?? Date.now(),
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      company: formState.company,
      value: Number(formState.value) || 0,
      status: formState.status,
      source: formState.source || 'Manual',
      notes: formState.notes,
      assignedClientId: assignedClient?.id ?? null,
      assignedClientName: assignedClient?.name ?? null,
      owner: activeUser.name,
      createdAt:
        leads.find((lead) => lead.id === editingLeadId)?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setLeads((currentLeads) => {
      if (editingLeadId) {
        return currentLeads.map((lead) => (lead.id === editingLeadId ? nextLead : lead))
      }

      return [nextLead, ...currentLeads]
    })
    setSelectedLeadId(nextLead.id)
    resetEditor()
  }

  function deleteLead(leadId: number) {
    if (activeUser.role !== 'admin') {
      return
    }

    setLeads((currentLeads) => currentLeads.filter((lead) => lead.id !== leadId))
    setSelectedLeadId((current) => (current === leadId ? 0 : current))
    resetEditor()
  }

  function updateClientLead(leadId: number, nextStatus: LeadStatus, nextNotes: string) {
    setLeads((currentLeads) =>
      currentLeads.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status: nextStatus,
              notes: nextNotes,
              updatedAt: new Date().toISOString(),
            }
          : lead,
      ),
    )
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        activeUser={activeUser}
        onTabChange={setActiveTab}
        onUserChange={switchUser}
        users={users}
      />

      <main className="workspace">
        <Topbar
          activeUser={activeUser}
          search={search}
          statusFilter={statusFilter}
          onCreateLead={openCreateLead}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
        />

        {activeTab === 'dashboard' ? (
          <DashboardView
            activeUser={activeUser}
            dashboardStats={dashboardStats}
            visibleLeads={visibleLeads}
            onLeadOpen={(leadId, tab = 'leads') => {
              setSelectedLeadId(leadId)
              setActiveTab(tab)
            }}
          />
        ) : null}

        {activeTab === 'leads' ? (
          <section className="lead-layout">
            <LeadListPanel
              selectedLeadId={selectedLead?.id ?? null}
              visibleLeads={visibleLeads}
              onLeadSelect={setSelectedLeadId}
            />

            <div className="details-column">
              {selectedLead ? (
                <LeadDetailCard
                  activeUser={activeUser}
                  lead={selectedLead}
                  onDelete={deleteLead}
                  onEdit={openEditLead}
                  onClientSave={updateClientLead}
                />
              ) : null}

              {activeUser.role === 'admin' ? (
                <LeadFormCard
                  editingLeadId={editingLeadId}
                  formState={formState}
                  users={users}
                  onClear={resetEditor}
                  onFormChange={setFormState}
                  onSubmit={saveLead}
                />
              ) : null}
            </div>
          </section>
        ) : null}

        {activeTab === 'pipeline' ? (
          <PipelineView
            pipelineGroups={pipelineGroups}
            onLeadOpen={(leadId, tab = 'leads') => {
              setSelectedLeadId(leadId)
              setActiveTab(tab)
            }}
          />
        ) : null}
      </main>
    </div>
  )
}

export default App
