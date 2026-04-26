const storageKey = 'jkg-search-theme'
const modes = ['system', 'light', 'dark']

function getSystemMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getStoredTheme() {
  const stored = window.localStorage.getItem(storageKey)
  return modes.includes(stored) ? stored : 'system'
}

export function applyTheme(mode) {
  const nextMode = modes.includes(mode) ? mode : 'system'
  const resolved = nextMode === 'system' ? getSystemMode() : nextMode

  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.documentElement.classList.toggle('light', resolved === 'light')
  document.documentElement.dataset.theme = nextMode
  window.localStorage.setItem(storageKey, nextMode)

  return {
    mode: nextMode,
    resolved
  }
}

export function cycleTheme(currentMode) {
  const index = modes.indexOf(currentMode)
  return modes[(index + 1) % modes.length]
}

export function watchSystemTheme(callback) {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const listener = () => callback()
  media.addEventListener('change', listener)
  return () => media.removeEventListener('change', listener)
}

