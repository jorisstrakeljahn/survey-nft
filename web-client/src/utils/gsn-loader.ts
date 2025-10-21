let loadPromise: Promise<void> | null = null

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement("script")
    s.src = src
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

export function ensureGsnLoaded(): Promise<void> {
  const w = window as any;
  if (w.Web3 && w.gsn) return Promise.resolve()

  loadPromise ??= (async () => {
    await loadScript("/vendor/web3.min.js")
    await loadScript("/vendor/gsn-umd.js")
  })()
  return loadPromise
}
