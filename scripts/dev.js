import { spawn } from 'node:child_process'

const commands = [
  ['api', 'node', ['server/index.js']],
  ['web', 'vite', []]
]

const children = commands.map(([name, command, args]) => {
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: process.env.NODE_ENV || 'development'
    }
  })

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal)
      return
    }

    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`)
      process.exit(code)
    }
  })

  return child
})

function shutdown() {
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM')
  }
}

process.on('SIGINT', () => {
  shutdown()
  process.exit(0)
})

process.on('SIGTERM', () => {
  shutdown()
  process.exit(0)
})
