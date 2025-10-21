// web3-global-shim.js
// Macht den Modul-Import "web3" zu einem Proxy auf das globale Web3,
// das du per <script src="/gsn/web3.min.js"> lädst.
const W = (typeof window !== "undefined" && window.Web3) || undefined;
if (!W) {
    throw new Error('Global Web3 not found. Load "/gsn/web3.min.js" BEFORE gsn-umd.js');
}
export default W;
export const Web3 = W;
