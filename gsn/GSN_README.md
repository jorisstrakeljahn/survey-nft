# GSN Bundle – UMD build for gasless operations

This folder contains a tiny build setup to ship a **browser‑ready UMD bundle** of the OpenGSN provider.  
Goal: keep a **stable, local** copy for minting and other gasless actions, so your web app does **not** load GSN from the internet.

---

## What gets built

- **`gsn-umd.js`** – an IIFE/UMD bundle that exposes the GSN provider on the **global window**:
  - `window.gsn.RelayProvider`
  - `window.RelayProvider` (alias)

The bundle expects a **global Web3** to be present (`window.Web3`). If it’s not, the shim throws a clear error:

> `Global Web3 not found. Load "/gsn/web3.min.js" BEFORE gsn-umd.js`

---

## Files in this folder

- `build-gsn.mjs` – esbuild config. It bundles `expose-gsn.js`, polyfills Node globals/modules for the browser, targets `es2018`, and forces `global` → `window`. It also replaces `import 'web3'` with a **shim** that reads `window.Web3`
- `expose-gsn.js` – registers `RelayProvider` on the `window` object (see above)
- `web3-global-shim.js` – checks for `window.Web3` and errors if missing
- `package.json` – `scripts.build:gsn` and pinned deps (`web3@1.2.11`, `@opengsn/provider@2.2.6`)

---

## Build

```bash
# inside the gsn/ folder
npm i
npm run build:gsn
# -> outputs gsn-umd.js next to the scripts
```

> The build uses **esbuild** with `@esbuild-plugins/node-globals-polyfill` and `@esbuild-plugins/node-modules-polyfill` to emulate Node APIs in the browser

---

## How to use in your web app

### A) Static include (simplest)

Place the built files somewhere under your domain (e.g. `/gsn/`) and include them **in order**:

```html
<!-- 1) Provide a global Web3 (required by the shim) -->
<script src="/gsn/web3.min.js"></script>

<!-- 2) Provide the GSN UMD bundle -->
<script src="/gsn/gsn-umd.js"></script>
```

Then you can access the provider globally:

```html
<script>
  // window.gsn is now available
  const { RelayProvider } = window.gsn;
  // Example (adjust addresses to your env):
  (async () => {
    const rp = await RelayProvider.newProvider({
      provider: window.ethereum,
      config: {
        paymasterAddress: '0xYourPaymaster',
        forwarderAddress: '0xYourForwarder'
      }
    }).init();
    // if you use web3 1.x:
    const web3 = new Web3(rp);
  })();
</script>
```

### B) Lazy load (recommended for performance)

```js
function loadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.async = true;
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

async function ensureGsn() {
  if (!window.Web3) await loadScript('/gsn/web3.min.js');
  if (!window.gsn?.RelayProvider) await loadScript('/gsn/gsn-umd.js');
}

async function setupGsn(paymaster, forwarder) {
  await ensureGsn();
  const { RelayProvider } = window.gsn;
  return RelayProvider.newProvider({
    provider: window.ethereum,
    config: { paymasterAddress: paymaster, forwarderAddress: forwarder }
  }).init();
}
```

---

## Why bundle locally?

- **Stability**: you control the exact versions (`web3@1.2.11`, GSN v2)
- **Privacy/Compliance**: no third‑party script loads from CDNs
- **Performance**: you can **lazy‑load** GSN only when a gasless action is triggered

---

## Troubleshooting

- **“Global Web3 not found…”** → include `/gsn/web3.min.js` **before** `/gsn/gsn-umd.js`
- **`window.gsn` is undefined** → the UMD wasn’t loaded (or build failed). Rebuild with `npm run build:gsn`
- **Type errors during bundling** → ensure `build-gsn.mjs` runs in Node ESM mode and that `esbuild` + plugins are installed

---

## Notes

- The bundle format is **IIFE/UMD** and defines `global` as `window` for browser contexts
- If you change Web3 major versions or switch to Ethers‑only flows, update the shim and entry as needed

