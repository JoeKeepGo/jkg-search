async function parseJson(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }
  return data
}

export async function getCurrentUser() {
  const response = await fetch('/api/auth/me', {
    credentials: 'include'
  })
  return parseJson(response)
}

export async function login(username, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  })
  return parseJson(response)
}

export async function logout() {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  })
  return parseJson(response)
}

export async function getSettings() {
  const response = await fetch('/api/settings', {
    credentials: 'include'
  })
  return parseJson(response)
}

export async function saveSettings(settings) {
  const response = await fetch('/api/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(settings)
  })
  return parseJson(response)
}

