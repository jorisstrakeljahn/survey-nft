export const CHAIN_ID = 137
export const POLYGON_HEX = '0x89'

export const NFT_ADDRESS       = '0xCE4152002E1c2e2B24C2C594e08F91547b1A001C'
export const PAYMASTER_ADDRESS = '0x1A625131D905F4146cbe2fd3EAffC760cF6Bacbc'
export const FORWARDER_ADDRESS = '0xdA78a11FD57aF7be2eDD804840eA7f4c2A38801d'
export const RELAY_HUB_ADDRESS = '0x6C28AfC105e65782D9Ea6F2cA68df84C9e7d750d'

export const PREFERRED_RELAYS = ['https://relay-polygon.enzyme.finance/gsn1']

export const SURVEY_NFT_DEPLOY_BLOCK = 77168989

export const READ_RPCS = [
  import.meta.env.VITE_POLYGON_RPC || 'https://polygon-rpc.com',
  'https://rpc.ankr.com/polygon',
  'https://1rpc.io/matic',
]

export const LOGS_PAGE_BLOCKS = 20_000
export const RPC_PAUSE_MS = 200
export const RPC_MAX_BACKOFF = 4000
