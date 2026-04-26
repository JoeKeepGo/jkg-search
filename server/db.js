import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import { config } from './config.js'

fs.mkdirSync(path.dirname(config.databasePath), { recursive: true })

export const db = new Database(config.databasePath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS search_providers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    enabled INTEGER NOT NULL DEFAULT 1,
    config_json TEXT NOT NULL DEFAULT '{}',
    priority INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`)

const defaultSettings = {
  google_pse_cx: config.fallbackGooglePseCx,
  site_title: config.defaultSiteTitle,
  duckduckgo_enabled: 'false'
}

const insertSetting = db.prepare(`
  INSERT OR IGNORE INTO settings (key, value)
  VALUES (@key, @value)
`)

for (const [key, value] of Object.entries(defaultSettings)) {
  insertSetting.run({ key, value })
}

db.prepare(`
  INSERT OR IGNORE INTO search_providers (name, enabled, config_json, priority)
  VALUES ('google_pse', 1, '{}', 10)
`).run()

db.prepare(`
  INSERT OR IGNORE INTO search_providers (name, enabled, config_json, priority)
  VALUES ('duckduckgo', 0, '{}', 20)
`).run()

export function getSetting(key) {
  return db.prepare('SELECT key, value, updated_at FROM settings WHERE key = ?').get(key)
}

export function setSetting(key, value) {
  db.prepare(`
    INSERT INTO settings (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      updated_at = CURRENT_TIMESTAMP
  `).run(key, value)
}

export function getSettings() {
  const rows = db.prepare('SELECT key, value, updated_at FROM settings ORDER BY key').all()
  return Object.fromEntries(rows.map((row) => [row.key, row.value]))
}

export function getPublicSettings() {
  const settings = getSettings()
  return {
    google_pse_cx: settings.google_pse_cx || config.fallbackGooglePseCx,
    site_title: settings.site_title || config.defaultSiteTitle,
    duckduckgo_enabled: settings.duckduckgo_enabled === 'true'
  }
}

export function getAdminUserByUsername(username) {
  return db.prepare('SELECT * FROM users WHERE username = ? AND role = ?').get(username, 'admin')
}

export function getUserById(id) {
  return db.prepare('SELECT id, username, role, created_at, updated_at FROM users WHERE id = ?').get(id)
}

export function countUsers() {
  return db.prepare('SELECT COUNT(*) AS count FROM users').get().count
}

export function createAdminUser(username, passwordHash) {
  return db.prepare(`
    INSERT INTO users (username, password_hash, role)
    VALUES (?, ?, 'admin')
  `).run(username, passwordHash)
}

export function createSession(id, userId, expiresAt) {
  db.prepare(`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (?, ?, ?)
  `).run(id, userId, expiresAt)
}

export function getSession(id) {
  return db.prepare(`
    SELECT sessions.id, sessions.user_id, sessions.expires_at, users.username, users.role
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.id = ?
  `).get(id)
}

export function deleteSession(id) {
  db.prepare('DELETE FROM sessions WHERE id = ?').run(id)
}

export function deleteExpiredSessions(now = Date.now()) {
  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now)
}

