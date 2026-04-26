import bcrypt from 'bcryptjs'
import { countUsers, createAdminUser } from '../db.js'

const username = process.env.ADMIN_USERNAME
const password = process.env.ADMIN_PASSWORD

if (!username || !password) {
  console.error('Set ADMIN_USERNAME and ADMIN_PASSWORD before running pnpm init:admin.')
  process.exit(1)
}

if (password.length < 8) {
  console.error('ADMIN_PASSWORD must be at least 8 characters.')
  process.exit(1)
}

if (countUsers() > 0) {
  console.error('An admin user already exists. Refusing to create another one.')
  process.exit(1)
}

const passwordHash = await bcrypt.hash(password, 12)
createAdminUser(username, passwordHash)

console.log(`Created admin user "${username}".`)

