import path from 'node:path'
import { fileURLToPath } from 'node:url'
import 'dotenv/config'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export const config = {
  rootDir,
  dataDir: process.env.DATA_DIR || path.join(rootDir, 'data'),
  databasePath: process.env.DATABASE_URL || path.join(process.env.DATA_DIR || path.join(rootDir, 'data'), 'app.sqlite'),
  port: Number(process.env.PORT || 8787),
  sessionCookieName: 'luxirty_session',
  fallbackGooglePseCx: process.env.VITE_GOOGLE_CSE_CX || '',
  defaultSiteTitle: process.env.SITE_TITLE || 'Luxirty Search',
  nodeEnv: process.env.NODE_ENV || 'development',
  secureCookies: process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === 'true'
    : process.env.NODE_ENV === 'production'
}
