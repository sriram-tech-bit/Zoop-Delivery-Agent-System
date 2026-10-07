import { useCallback, useEffect, useMemo, useState } from 'react'
import AgentDetails from './components/AgentDetails.jsx'
import AgentForm from './components/AgentForm.jsx'
import AgentList from './components/AgentList.jsx'
import AgentStats from './components/AgentStats.jsx'
import DashboardShell from './components/DashboardShell.jsx'
import Icon from './components/Icon.jsx'
import { createAgent, deleteAgent, getAgents, updateAgent } from './services/agents.js'

function App() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dialog, setDialog] = useState(null)
  const [saving, setSaving] = useState(false)
  const [dialogError, setDialogError] = useState('')
  const [toast, setToast] = useState('')

  const loadAgents = useCallback(async () => {
    try {
      setAgents(await getAgents())
      setPageError('')
    } catch (error) {
      setPageError(error.message || 'Could not connect to the server.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    getAgents().then((data) => {
      if (!cancelled) {
        setAgents(data)
        setPageError('')
      }
    }).catch((error) => {
      if (!cancelled) setPageError(error.message || 'Could not connect to the server.')
    }).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const counts = useMemo(() => ({
    total: agents.length,
    active: agents.filter((agent) => agent.status === 'active').length,
    inactive: agents.filter((agent) => agent.status === 'inactive').length,
    areas: new Set(agents.map((agent) => agent.serviceArea?.trim().toLowerCase()).filter(Boolean)).size,
  }), [agents])

  const visibleAgents = useMemo(() => agents.filter((agent) => {
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter
    const search = query.trim().toLowerCase()
    const matchesQuery = !search || [agent.fullName, agent.email, agent.phone, agent.serviceArea].some((value) => value?.toLowerCase().includes(search))
    return matchesStatus && matchesQuery
  }), [agents, query, statusFilter])

  function refreshAgents() {
    setLoading(true)
    loadAgents()
  }

  function openDialog(nextDialog) {
    setDialogError('')
    setDialog(nextDialog)
  }

  function startEdit(agent) {
    openDialog({ type: 'edit', agent })
  }

  async function saveAgent(form) {
    setSaving(true)
    setDialogError('')
    try {
      const editing = dialog.type === 'edit'
      if (editing) {
        const { fullName, phone, serviceArea, status } = form
        await updateAgent(dialog.agent._id, { fullName, phone, serviceArea, status })
      } else {
        await createAgent(form)
      }
      setDialog(null)
      setToast(editing ? 'Agent details updated.' : 'Agent added to your team.')
      await loadAgents()
    } catch (error) {
      setDialogError(error.message || 'Something went wrong while saving.')
    } finally {
      setSaving(false)
    }
  }

  async function removeAgent(agent) {
    if (!window.confirm(`Delete ${agent.fullName} from your delivery team? This action can’t be undone.`)) return
    try {
      await deleteAgent(agent._id)
      setDialog(null)
      setToast('Agent deleted.')
      await loadAgents()
    } catch (error) {
      setPageError(error.message || 'Could not delete agent.')
    }
  }

  return (
    <DashboardShell agentCount={counts.total} toast={toast}>
      <div className="page-heading">
        <div>
          <div className="eyebrow">PEOPLE &amp; OPERATIONS</div>
          <h1>Delivery agents</h1>
          <p>Manage your delivery team and keep your operations moving.</p>
        </div>
        <button className="button button-primary add-button" onClick={() => openDialog({ type: 'create' })}>
          <Icon name="plus" size={19} /> Add agent
        </button>
      </div>

      <AgentStats counts={counts} loading={loading} />
      <AgentList
        agents={visibleAgents}
        total={counts.total}
        query={query}
        onQueryChange={setQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        loading={loading}
        error={pageError}
        onRefresh={refreshAgents}
        onRetry={refreshAgents}
        onOpenAgent={(agent) => openDialog({ type: 'details', agent })}
        onAddAgent={() => openDialog({ type: 'create' })}
      />

      {dialog?.type === 'create' && (
        <AgentForm onClose={() => setDialog(null)} onSave={saveAgent} saving={saving} error={dialogError} />
      )}
      {dialog?.type === 'edit' && (
        <AgentForm agent={dialog.agent} onClose={() => setDialog(null)} onSave={saveAgent} saving={saving} error={dialogError} />
      )}
      {dialog?.type === 'details' && (
        <AgentDetails agent={dialog.agent} onClose={() => setDialog(null)} onEdit={startEdit} onDelete={removeAgent} />
      )}
    </DashboardShell>
  )
}

export default App
