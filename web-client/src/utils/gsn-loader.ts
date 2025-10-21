let loadPromise: Promise<void> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

/** Lädt Web3 + GSN nur einmalig und erst beim Bedarf. */
export function ensureGsnLoaded(): Promise<void> {
  // Falls schon global vorhanden (z.B. nach erster Nutzung)
  const w = window as any;
  if (w.Web3 && w.gsn) return Promise.resolve();

  loadPromise ??= (async () => {
    // Von DEINER Domain laden (liegt in public/vendor)
    await loadScript("/vendor/web3.min.js");
    await loadScript("/vendor/gsn-umd.js");
  })();
  return loadPromise;
}
