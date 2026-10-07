import Icon from './Icon.jsx'

const TODAY_LABEL = new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())

function Sidebar({ agentCount }) {
  return (
    <aside className="sidebar">
      <a href="#" className="brand" aria-label="Zoop home">
        <span className="brand-mark"><span /></span><span className="brand-name">zoop<span>.</span></span>
      </a>
      <div className="workspace-label">WORKSPACE</div>
      <button className="workspace-switch"><span className="workspace-avatar">Z</span><span><strong>Zoop Logistics</strong><small>Operations team</small></span><Icon name="down" size={15} /></button>
      <div className="nav-label">OVERVIEW</div>
      <nav className="side-nav" aria-label="Main navigation">
        <a href="#" className="nav-item"><Icon name="grid" /> Overview</a>
        <a href="#agents" className="nav-item active"><Icon name="users" /> Delivery agents<span className="nav-count">{agentCount}</span></a>
        <a href="#agents" className="nav-item"><Icon name="pin" /> Service areas</a>
        <a href="#agents" className="nav-item"><Icon name="activity" /> Activity</a>
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card"><span className="help-icon">?</span><strong>Need a hand?</strong><p>Visit our help center to get started.</p><a href="mailto:support@zoop.com">Get support <Icon name="arrow" size={14} /></a></div>
        <div className="profile-row"><div className="profile-avatar">AK</div><span><strong>Alex Kim</strong><small>Administrator</small></span><Icon name="more" className="profile-more" /></div>
      </div>
    </aside>
  )
}

function Header() {
  return (
    <header className="topbar">
      <div className="breadcrumb">Workspace <Icon name="chevron" size={14} /><span>Delivery agents</span></div>
      <div className="topbar-right">
        <span className="online-indicator"><i /> All systems operational</span>
        <span className="topbar-divider" />
        <span className="today-label">{TODAY_LABEL}</span>
        <div className="profile-avatar top-avatar">AK</div>
      </div>
    </header>
  )
}

export default function DashboardShell({ agentCount, toast, children }) {
  return (
    <div className="app-shell">
      <Sidebar agentCount={agentCount} />
      <main className="main-content" id="agents">
        <Header />
        <div className="page-wrap">
          {children}
          <footer className="page-footer"><span>© 2025 Zoop Logistics</span><span>Made for smoother deliveries <span className="footer-heart">♥</span></span></footer>
        </div>
      </main>
      {toast && <div className="toast" role="status"><span className="toast-check">✓</span>{toast}</div>}
    </div>
  )
}
