import Icon from './Icon.jsx'
import { formatDate, initials } from '../utils/agentFormat.js'

export default function AgentDetails({ agent, onClose, onEdit, onDelete }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-card details-card" role="dialog" aria-modal="true" aria-labelledby="agent-details-title">
        <div className="details-cover">
          <button className="icon-button detail-close" onClick={onClose} aria-label="Close details"><Icon name="close" /></button>
          <div className="detail-avatar">{initials(agent.fullName)}</div>
          <span className={`status-pill ${agent.status === 'active' ? 'is-active' : 'is-inactive'}`}><span />{agent.status}</span>
          <h2 id="agent-details-title">{agent.fullName}</h2>
          <p><Icon name="pin" size={15} /> {agent.serviceArea}</p>
        </div>
        <div className="details-body">
          <span className="eyebrow">CONTACT INFORMATION</span>
          <div className="detail-id"><small>Agent ID</small><code>{agent._id}</code></div>
          <div className="detail-line"><span className="detail-icon"><Icon name="mail" /></span><div><small>Email address</small><strong>{agent.email}</strong></div></div>
          <div className="detail-line"><span className="detail-icon"><Icon name="phone" /></span><div><small>Phone number</small><strong>{agent.phone}</strong></div></div>
          <div className="detail-dates"><div><small>Joined on</small><strong>{formatDate(agent.createdAt)}</strong></div><div><small>Last updated</small><strong>{formatDate(agent.updatedAt)}</strong></div></div>
          <div className="form-actions">
            <button className="button button-danger-outline" onClick={() => onDelete(agent)}><Icon name="trash" size={16} /> Delete</button>
            <button className="button button-primary" onClick={() => onEdit(agent)}><Icon name="edit" size={16} /> Edit agent</button>
          </div>
        </div>
      </section>
    </div>
  )
}
