import fs from 'node:fs'
import path from 'node:path'
import { serve } from '@hono/node-server'
import bcrypt from 'bcryptjs'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { config } from './config.js'
import {
  countUsers,
  createSession,
  deleteSession,
  getAdminUserByUsername,
  getPublicSettings,
  setSetting
} from './db.js'
import {
  createSessionId,
  getSessionExpiresAt,
  getRequestSession,
  parseCookie,
  requireAuth,
  serializeCookie
} from './auth.js'

const app = new Hono()
const sessionCookieOptions = {
  path: '/',
  httpOnly: true,
  sameSite: 'Lax',
  secure: config.secureCookies
}

function jsonError(c, message, status = 400) {
  return c.json({ error: message }, status)
}

function normalizeSettingsPayload(payload) {
  const googlePseCx = typeof payload.google_pse_cx === 'string' ? payload.google_pse_cx.trim() : ''
  const siteTitle = typeof payload.site_title === 'string' ? payload.site_title.trim() : ''
  const duckduckgoEnabled = Boolean(payload.duckduckgo_enabled)

  if (siteTitle.length === 0) {
    throw new Error('Site title is required')
  }

  return {
    google_pse_cx: googlePseCx,
    site_title: siteTitle,
    duckduckgo_enabled: duckduckgoEnabled
  }
}

app.get('/api/health', (c) => c.json({ ok: true }))

app.get('/api/settings/google-pse', (c) => {
  const settings = getPublicSettings()
  return c.json({
    cx: settings.google_pse_cx,
    site_title: settings.site_title
  })
})

app.get('/api/settings', requireAuth(config.sessionCookieName), (c) => {
  const settings = getPublicSettings()
  return c.json(settings)
})

app.put('/api/settings', requireAuth(config.sessionCookieName), async (c) => {
  let payload
  try {
    payload = await c.req.json()
  } catch {
    return jsonError(c, 'Invalid JSON')
  }

  let settings
  try {
    settings = normalizeSettingsPayload(payload)
  } catch (error) {
    return jsonError(c, error.message)
  }

  setSetting('google_pse_cx', settings.google_pse_cx)
  setSetting('site_title', settings.site_title)
  setSetting('duckduckgo_enabled', String(settings.duckduckgo_enabled))

  return c.json(getPublicSettings())
})

app.put('/api/settings/google-pse', requireAuth(config.sessionCookieName), async (c) => {
  let payload
  try {
    payload = await c.req.json()
  } catch {
    return jsonError(c, 'Invalid JSON')
  }

  const cx = typeof payload.cx === 'string' ? payload.cx.trim() : ''
  setSetting('google_pse_cx', cx)

  return c.json({ cx })
})

app.post('/api/auth/login', async (c) => {
  let payload
  try {
    payload = await c.req.json()
  } catch {
    return jsonError(c, 'Invalid JSON')
  }

  const username = typeof payload.username === 'string' ? payload.username.trim() : ''
  const password = typeof payload.password === 'string' ? payload.password : ''

  if (!username || !password) {
    return jsonError(c, 'Username and password are required')
  }

  const user = getAdminUserByUsername(username)
  const valid = user ? await bcrypt.compare(password, user.password_hash) : false

  if (!valid) {
    return jsonError(c, 'Invalid username or password', 401)
  }

  const sessionId = createSessionId()
  const expiresAt = getSessionExpiresAt()
  createSession(sessionId, user.id, expiresAt)

  c.header(
    'Set-Cookie',
    serializeCookie(config.sessionCookieName, sessionId, {
      ...sessionCookieOptions,
      expires: new Date(expiresAt)
    })
  )

  return c.json({ user: { id: user.id, username: user.username, role: user.role } })
})

app.post('/api/auth/logout', (c) => {
  const cookies = parseCookie(c.req.header('Cookie'))
  const sessionId = cookies[config.sessionCookieName]
  if (sessionId) deleteSession(sessionId)

  c.header(
    'Set-Cookie',
    serializeCookie(config.sessionCookieName, '', {
      ...sessionCookieOptions,
      maxAge: 0,
      expires: new Date(0)
    })
  )

  return c.json({ ok: true })
})

app.get('/api/auth/me', (c) => {
  const session = getRequestSession(c, config.sessionCookieName)
  if (!session) {
    return c.json({ user: null, needs_setup: countUsers() === 0 }, 401)
  }

  return c.json({
    user: {
      id: session.user_id,
      username: session.username,
      role: session.role
    }
  })
})

app.get('/api/ddg', async (c) => {
  const settings = getPublicSettings()
  if (!settings.duckduckgo_enabled) {
    return jsonError(c, 'DuckDuckGo supplement is disabled', 404)
  }

  const q = c.req.query('q')?.trim()
  if (!q) {
    return jsonError(c, 'Query is required')
  }

  const url = new URL('https://api.duckduckgo.com/')
  url.searchParams.set('q', q)
  url.searchParams.set('format', 'json')
  url.searchParams.set('no_html', '1')
  url.searchParams.set('skip_disambig', '1')

  const response = await fetch(url)
  if (!response.ok) {
    return jsonError(c, 'DuckDuckGo Instant Answer request failed', 502)
  }

  const data = await response.json()
  return c.json(data)
})

const distDir = path.join(config.rootDir, 'dist')
if (fs.existsSync(distDir)) {
  app.use('/assets/*', serveStatic({ root: distDir }))
  app.use('/*', serveStatic({ root: distDir }))
  app.use('/favicon.ico', serveStatic({ path: path.join(distDir, 'favicon.ico') }))
  app.use('/opensearch.xml', serveStatic({ path: path.join(distDir, 'opensearch.xml') }))
  app.use('/service-worker.js', serveStatic({ path: path.join(distDir, 'service-worker.js') }))
  app.get('*', serveStatic({ path: path.join(distDir, 'index.html') }))
}

serve({
  fetch: app.fetch,
  port: config.port
})

console.log(`Luxirty Search API listening on http://localhost:${config.port}`)
