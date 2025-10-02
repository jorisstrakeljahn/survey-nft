import { RelayProvider } from '@opengsn/provider';

// im Browser global machen:
window.Gsn = window.Gsn || {};
window.Gsn.RelayProvider = RelayProvider;
window.RelayProvider = RelayProvider; // Fallback
