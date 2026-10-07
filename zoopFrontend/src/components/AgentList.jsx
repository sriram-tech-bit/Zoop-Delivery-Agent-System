import Icon from './Icon.jsx'
import { formatDate, initials } from '../utils/agentFormat.js'

function AgentTable({ agents, loading, onOpenAgent }) {
  return (
    <div className="table-scroll">
      <table className="agents-table">
        <thead><tr><th>Agent</th><th>Contact</th><th>Service area</th><th>Status</th><th>Joined</th><th><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>
          {loading ? Array.from({ length: 4 }, (_, index) => (
            <tr className="skeleton-row" key={index}>
              <td><span className="skeleton avatar-skeleton" /><span className="skeleton text-skeleton" /></td>
              <td><span className="skeleton text-skeleton" /><span className="skeleton text-skeleton short" /></td>
              <td><span className="skeleton text-skeleton" /></td>
              <td><span className="skeleton pill-skeleton" /></td>
              <td><span className="skeleton text-skeleton short" /></td>
              <td />
            </tr>
          )) : agents.map((agent, index) => (
            <tr key={agent._id} onClick={() => onOpenAgent(agent)} className="agent-row">
              <td><div className="agent-cell"><div className={`agent-avatar avatar-${index % 5}`}>{initials(agent.fullName)}</div><div><strong>{agent.fullName}</strong><small>AG-{String(agent._id || '').slice(-5).toUpperCase()}</small></div></div></td>
              <td><div className="contact-cell"><span>{agent.email}</span><small>{agent.phone}</small></div></td>
              <td><span className="area-cell"><Icon name="pin" size={15} />{agent.serviceArea}</span></td>
              <td><span className={`status-pill ${agent.status === 'active' ? 'is-active' : 'is-inactive'}`}><span />{agent.status}</span></td>
              <td className="date-cell">{formatDate(agent.createdAt)}</td>
              <td><button className="row-action" aria-label={`View ${agent.fullName}`} onClick={(event) => { event.stopPropagation(); onOpenAgent(agent) }}><Icon name="chevron" size={18} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EmptyState({ query, statusFilter, onAddAgent }) {
  const filtered = Boolean(query || statusFilter !== 'all')
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon name={filtered ? 'search' : 'users'} size={22} /></div>
      <h3>{filtered ? 'No matching agents' : 'Your team starts here'}</h3>
      <p>{filtered ? 'Try another search or change the status filter.' : 'Add your first delivery agent to start building your team.'}</p>
      {!filtered && <button className="button button-primary" onClick={onAddAgent}><Icon name="plus" size={17} /> Add your first agent</button>}
    </div>
  )
}

export default function AgentList({
  agents,
  total,
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  loading,
  error,
  onRefresh,
  onRetry,
  onOpenAgent,
  onAddAgent,
}) {
  return (
    <section className="agents-panel">
      <div className="panel-heading">
        <div><h2>All agents <span className="heading-count">{total}</span></h2><p>A complete directory of your delivery team.</p></div>
        <button className="icon-button refresh-button" onClick={onRefresh} aria-label="Refresh agent list" title="Refresh"><Icon name="refresh" /></button>
      </div>
      <div className="table-toolbar">
        <div className="search-box">
          <Icon name="search" size={18} />
          <input aria-label="Search agents" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search name, email, phone..." />
          {query && <button className="search-clear" onClick={() => onQueryChange('')} aria-label="Clear search"><Icon name="close" size={14} /></button>}
          <kbd>⌘ K</kbd>
        </div>
        <div className="filter-wrap">
          <span className="filter-caption">Status</span>
          <select aria-label="Filter by status" value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value)}>
            <option value="all">All agents</option><option value="active">Active</option><option value="inactive">Inactive</option>
          </select>
          <Icon name="down" size={15} className="filter-chevron" />
        </div>
      </div>
      {error && <div className="page-error" role="alert"><span>{error}</span><button onClick={onRetry} className="button button-secondary">Try again</button></div>}
      <AgentTable agents={agents} loading={loading} onOpenAgent={onOpenAgent} />
      {!loading && !error && agents.length === 0 && <EmptyState query={query} statusFilter={statusFilter} onAddAgent={onAddAgent} />}
      <div className="table-footer">
        <span>Showing <strong>{loading ? '—' : agents.length}</strong> of <strong>{loading ? '—' : total}</strong> agents</span>
        <div className="pagination"><button disabled aria-label="Previous page"><Icon name="chevron" size={16} className="previous-chevron" /></button><button className="page-selected">1</button><button disabled aria-label="Next page"><Icon name="chevron" size={16} /></button></div>
      </div>
    </section>
  )
}
