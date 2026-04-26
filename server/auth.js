import crypto from 'node:crypto'
import { deleteExpiredSessions, getSession } from './db.js'

const sessionTtlMs = 1000 * 60 * 60 * 24 * 7

export function createSessionId() {
  return crypto.randomBytes(32).toString('base64url')
}

export function getSessionExpiresAt() {
  return Date.now() + sessionTtlMs
}

export function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${value}`]

  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`)
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`)
  if (options.path) parts.push(`Path=${options.path}`)
  if (options.httpOnly) parts.push('HttpOnly')
  if (options.secure) parts.push('Secure')
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`)

  return parts.join('; ')
}

export function parseCookie(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=')
        if (index === -1) return [part, '']
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))]
      })
  )
}

export function getRequestSession(c, cookieName) {
  deleteExpiredSessions()
  const cookies = parseCookie(c.req.header('Cookie'))
  const sessionId = cookies[cookieName]
  if (!sessionId) return null

  const session = getSession(sessionId)
  if (!session || session.expires_at <= Date.now()) return null

  return session
}

export function requireAuth(cookieName) {
  return async (c, next) => {
    const session = getRequestSession(c, cookieName)
    if (!session) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    c.set('session', session)
    await next()
  }
}

