// web3-global-shim.js
const W = (typeof window !== "undefined" && window.Web3) || undefined;
if (!W) {
    throw new Error('Global Web3 not found. Load "/gsn/web3.min.js" BEFORE gsn-umd.js');
}
export default W;
export const Web3 = W;
