import { RelayProvider } from '@opengsn/provider';
import Web3 from 'web3';

console.log('[GSN-UMD] expose start', typeof RelayProvider);
window.Gsn = window.Gsn || {};
window.Gsn.RelayProvider = RelayProvider;
window.RelayProvider = RelayProvider;
window.Web3 = window.Web3 || Web3;
console.log('[GSN-UMD] expose done', typeof window.Gsn, typeof window.Gsn?.RelayProvider, typeof window.Web3);
