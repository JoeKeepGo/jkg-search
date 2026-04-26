const fallbackGooglePseCx = import.meta.env.VITE_GOOGLE_CSE_CX || ''

export async function getGooglePseSettings() {
  try {
    const response = await fetch('/api/settings/google-pse')
    if (!response.ok) throw new Error('Failed to load Google PSE settings')
    const settings = await response.json()

    return {
      cx: settings.cx || fallbackGooglePseCx,
      siteTitle: settings.site_title || 'Luxirty Search'
    }
  } catch (error) {
    console.warn(error)
    return {
      cx: fallbackGooglePseCx,
      siteTitle: 'Luxirty Search'
    }
  }
}

