import { useState } from 'react'
import Icon from './Icon.jsx'

export default function AgentForm({ agent, onClose, onSave, saving, error }) {
  const [form, setForm] = useState({
    fullName: agent?.fullName || '',
    phone: agent?.phone || '',
    email: agent?.email || '',
    serviceArea: agent?.serviceArea || '',
    status: agent?.status || 'active',
  })

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  function submit(event) {
    event.preventDefault()
    onSave(form)
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="agent-form-title">
        <div className="modal-heading">
          <div>
            <span className="eyebrow">{agent ? 'AGENT PROFILE' : 'NEW TEAM MEMBER'}</span>
            <h2 id="agent-form-title">{agent ? 'Edit agent' : 'Add delivery agent'}</h2>
            <p>{agent ? 'Update the details for this delivery agent.' : 'Add a new person to your delivery team.'}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close dialog"><Icon name="close" /></button>
        </div>
        {error && <div className="form-error" role="alert">{error}</div>}
        <form onSubmit={submit} className="agent-form">
          <label className="field full-field">
            <span>Full name</span>
            <input autoFocus required minLength={2} maxLength={60} name="fullName" value={form.fullName} onChange={update} placeholder="e.g. Priya Sharma" />
          </label>
          <label className="field">
            <span>Phone number</span>
            <div className="input-with-prefix"><span className="phone-prefix">+91</span><input required inputMode="numeric" name="phone" value={form.phone} onChange={update} placeholder="98765 43210" /></div>
          </label>
          <label className="field">
            <span>Email address</span>
            <input required type="email" name="email" value={form.email} onChange={update} disabled={Boolean(agent)} placeholder="name@example.com" />
            {agent && <small>Email addresses can’t be changed after creation.</small>}
          </label>
          <label className="field full-field">
            <span>Service area</span>
            <input required name="serviceArea" value={form.serviceArea} onChange={update} placeholder="e.g. Indiranagar, Bengaluru" />
          </label>
          <label className="field full-field">
            <span>Agent status</span>
            <select name="status" value={form.status} onChange={update}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <div className="form-actions full-field">
            <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="button button-primary" disabled={saving}>{saving ? 'Saving…' : agent ? 'Save changes' : 'Add agent'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
