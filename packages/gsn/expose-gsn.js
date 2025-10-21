// expose-gsn.js
import { RelayProvider } from '@opengsn/provider';

window.gsn = window.gsn || {};
window.gsn.RelayProvider = RelayProvider;
window.RelayProvider = RelayProvider;
