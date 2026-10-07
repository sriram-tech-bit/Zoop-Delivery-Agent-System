import Icon from './Icon.jsx'

export default function AgentStats({ counts, loading }) {
  return (
    <section className="stats-grid" aria-label="Agent summary">
      <article className="stat-card">
        <div className="stat-top"><span>Total agents</span><span className="stat-icon indigo"><Icon name="users" /></span></div>
        <div className="stat-number">{loading ? '—' : counts.total}</div>
        <div className="stat-foot"><span className="stat-foot-dot indigo-dot" />Across all service areas</div>
      </article>
      <article className="stat-card">
        <div className="stat-top"><span>Active agents</span><span className="stat-icon green"><Icon name="activity" /></span></div>
        <div className="stat-number">{loading ? '—' : counts.active}</div>
        <div className="stat-foot"><span className="stat-foot-dot green-dot" />Ready for deliveries</div>
      </article>
      <article className="stat-card">
        <div className="stat-top"><span>Inactive agents</span><span className="stat-icon amber"><Icon name="users" /></span></div>
        <div className="stat-number">{loading ? '—' : counts.inactive}</div>
        <div className="stat-foot"><span className="stat-foot-dot amber-dot" />Not currently on duty</div>
      </article>
      <article className="stat-card coverage-stat">
        <div className="stat-top"><span>Coverage</span><span className="stat-icon violet"><Icon name="pin" /></span></div>
        <div className="stat-number">{loading ? '—' : counts.areas}</div>
        <div className="stat-foot"><span className="stat-foot-dot violet-dot" />Unique service areas</div>
      </article>
    </section>
  )
}
