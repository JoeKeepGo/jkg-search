let loadedCx = ''
let loadingPromise = null

function removeGoogleCseScript() {
  document.querySelectorAll('script[data-luxirty-google-cse="true"]').forEach((script) => {
    script.remove()
  })
}

function resetGoogleCseGlobals() {
  delete window.__gcse
  delete window.google
}

export function resetGoogleCse() {
  loadedCx = ''
  loadingPromise = null
  removeGoogleCseScript()
  resetGoogleCseGlobals()
}

export function renderGoogleCse() {
  if (window.google?.search?.cse?.element) {
    window.google.search.cse.element.go()
  }
}

export function loadGoogleCse(cx, callbackConfig = {}) {
  if (!cx) {
    return Promise.reject(new Error('Google PSE cx is not configured'))
  }

  window.__gcse = {
    ...(window.__gcse || {}),
    ...callbackConfig
  }

  if (loadedCx === cx && window.google?.search?.cse?.element) {
    renderGoogleCse()
    return Promise.resolve()
  }

  if (loadedCx && loadedCx !== cx) {
    resetGoogleCse()
  }

  if (loadingPromise) return loadingPromise

  loadedCx = cx
  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://cse.google.com/cse.js?cx=${encodeURIComponent(cx)}`
    script.async = true
    script.dataset.luxirtyGoogleCse = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google CSE script'))
    document.head.appendChild(script)
  })

  return loadingPromise
}
