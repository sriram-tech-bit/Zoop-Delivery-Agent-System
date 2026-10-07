const API_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options)
  const payload = await response.json()
  if (!response.ok) throw new Error(payload.message || 'The request could not be completed.')
  return payload
}

export async function getAgents() {
  const payload = await request('/agents')
  return Array.isArray(payload.data) ? payload.data : []
}

export function createAgent(agent) {
  return request('/agents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agent),
  })
}

export function updateAgent(id, agent) {
  return request(`/agents/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agent),
  })
}

export function deleteAgent(id) {
  return request(`/agents/${id}`, { method: 'DELETE' })
}
