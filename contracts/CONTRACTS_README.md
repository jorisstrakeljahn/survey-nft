# Survey NFT – Smart Contracts (Hardhat)

This package contains the smart contracts and deployment scripts for **Survey NFT**. It uses Hardhat (TypeScript + TypeChain + Ethers v6) and ships two on‑chain components:

- **SurveyNFT.sol** – a role‑secured, non‑transferable ERC‑721 used to represent VPP points.
- **SurveyPaymaster.sol** – an OpenGSN (v2) Paymaster that sponsors gas so users can perform **gasless** actions.

> TL;DR: set up your `.env`, compile, deploy NFT + Paymaster to Polygon, fund the Paymaster with MATIC, optionally verify on Polygonscan, and your dapp can relay gasless transactions.

---

## Contents

- `contracts/SurveyNFT.sol` – points NFT (non‑transferable), AccessControl for admin/deleter.
- `contracts/SurveyPaymaster.sol` – GSN v2 Paymaster.
- `scripts/01_deploy_nft.ts` – deploys `SurveyNFT`.
- `scripts/02_deploy_paymaster.ts` – deploys `SurveyPaymaster` (and performs basic wiring if needed).
- Hardhat/TypeScript config & typings.

> If your script or constructor signatures differ, adapt the examples below accordingly.

---

## Prerequisites

- Node.js 18+ and **npm**
- A Polygon RPC endpoint (e.g. `https://polygon-rpc.com` or Alchemy/Infura/QuickNode)
- A deployer **private key** that holds MATIC on the target network (Mainnet needs real MATIC; testnet needs faucet MATIC)
- (Optional) **Polygonscan API key** for verification

---

## Environment configuration (`.env`)

Create a `.env` file in the **contracts/** folder (never commit secrets). The project uses these variables during deploy, verification and console interaction.

> **Sample (.env for Polygon Mainnet)** — **replace** the example addresses/keys with yours:

```ini
# --- RPC + DEPLOYER ---
RPC_URL=https://polygon-rpc.com
PRIVATE_KEY=0x...                    # your deployer private key (hex with 0x)

# --- OpenGSN v2 (Polygon Mainnet) ---
FORWARDER=0xdA78a11FD57aF7be2eDD804840eA7f4c2A38801d
RELAY_HUB=0x6C28AfC105e65782D9Ea6F2cA68df84C9e7d750d
# (aliases, if your code differentiates by network name)
FORWARDER_POLYGON=0xdA78a11FD57aF7be2eDD804840eA7f4c2A38801d
RELAY_HUB_POLYGON=0x6C28AfC105e65782D9Ea6F2cA68df84C9e7d750d

# --- SurveyNFT v2 ---
# Base URI for the JSON metadata (NOT the image URL):
BASE_TOKEN_URI=https://vpstunden.hsbi.de/vpp-metadata/
BASE_URI=https://vpstunden.hsbi.de/vpp-metadata/

# Roles to grant at deploy time (if your deploy script uses them)
ADMIN_ADDR=0x6f9B0eE6bd8E273e6EFfe70D31D8eA3a4DA9be37
DELETER_ADDR=0x6f9B0eE6bd8E273e6EFfe70D31D8eA3a4DA9be37

# --- Already deployed addresses (optional, for scripts/console helpers) ---
NFT_ADDR=0xCE4152002E1c2e2B24C2C594e08F91547b1A001C
PAYMASTER_ADDR=0x1A625131D905F4146cbe2fd3EAffC760cF6Bacbc

# Paymaster funding & relaying hints
PAYMASTER_DEPOSIT=0.4                # how much MATIC to deposit
TIP_GWEI=150                         # target gas price tip in gwei (if your scripts use it)
```

### How these variables are used

- **RPC_URL / PRIVATE_KEY** – Hardhat network config (provider URL + deployer signer).
- **FORWARDER / RELAY_HUB** – OpenGSN v2 infrastructure addresses used by your Paymaster and dapp.
- **BASE_TOKEN_URI / BASE_URI** – NFT base URI(s); the deploy script can pass these as constructor args or set them post‑deploy.
- **ADMIN_ADDR / DELETER_ADDR** – addresses that receive roles right after deploy (if your script grants them).
- **NFT_ADDR / PAYMASTER_ADDR** – helper addresses when interacting post‑deploy (funding, role checks).
- **PAYMASTER_DEPOSIT / TIP_GWEI** – optional script controls (funding amount; gas price hint for relays).

> **Security tip:** keep the deployer wallet separate and funded just for deployments. Never commit `.env`; prefer a secrets manager in CI.

---

## Install & Build

```bash
# from contracts/
npm i
npx hardhat compile
```

Compiles produce typed ABIs under `typechain-types/`.

---

## Hardhat config (example)

Your `hardhat.config.ts` should load `.env` and map networks. Example outline:

```ts
import 'dotenv/config'
import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'

const { RPC_URL, PRIVATE_KEY, POLYGONSCAN_API_KEY } = process.env

const config: HardhatUserConfig = {
  solidity: '0.8.24',
  networks: {
    polygon: {
      url: RPC_URL || 'https://polygon-rpc.com',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    },
    // mumbai/amoy etc. can be added similarly
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY || ''
  }
}
export default config
```

---

## Deploy

> Make sure your deployer wallet (PRIVATE_KEY) has sufficient **MATIC** on the target chain.

### Local (in‑memory node)

```bash
npx hardhat node
# new terminal
npx hardhat run scripts/01_deploy_nft.ts --network localhost
npx hardhat run scripts/02_deploy_paymaster.ts --network localhost
```

### Polygon Mainnet (or Testnet)

```bash
# NFT
npx hardhat run scripts/01_deploy_nft.ts --network polygon

# Paymaster
npx hardhat run scripts/02_deploy_paymaster.ts --network polygon
```

> Keep the printed addresses for your `.env` (`NFT_ADDR`, `PAYMASTER_ADDR`) and for the dapp config.

---

## Verify on Polygonscan

```bash
# NFT (no constructor args example)
npx hardhat verify --network polygon 0xYourNftAddress

# Paymaster (add constructor args if your constructor requires them)
npx hardhat verify --network polygon 0xYourPaymasterAddress <arg1> <arg2> ...
```

> Verification may require a short delay after deployment while the explorer indexes the bytecode.

---

## Gasless (OpenGSN v2) – fund & operate the Paymaster

The Paymaster needs native coin (MATIC) to pay for relayed tx. You can fund it directly or via the RelayHub—depending on your Paymaster implementation.

### A) Fund by sending MATIC directly

```bash
npx hardhat console --network polygon
```

```ts
const { ethers } = require('hardhat')
const [deployer] = await ethers.getSigners()
await deployer.sendTransaction({
  to: process.env.PAYMASTER_ADDR!,                 // your Paymaster
  value: ethers.parseEther(process.env.PAYMASTER_DEPOSIT ?? '0.4')  // e.g. 0.4 MATIC
})
```

### B) Fund via RelayHub (if your Paymaster uses deposits there)

```ts
const { ethers } = require('hardhat')
const rh = await ethers.getContractAt('IRelayHub', process.env.RELAY_HUB!)
await rh.depositFor(process.env.PAYMASTER_ADDR!, {
  value: ethers.parseEther(process.env.PAYMASTER_DEPOSIT ?? '0.4')
})
```

> Use **FORWARDER** and **RELAY_HUB** that match your GSN version/network. Your web client must use the same Forwarder.

---

## Common admin interactions (SurveyNFT)

```bash
npx hardhat console --network polygon
```

```ts
const { ethers } = require('hardhat')
const nft = await ethers.getContractAt('SurveyNFT', process.env.NFT_ADDR!)

// AccessControl roles
const DEFAULT_ADMIN_ROLE = '0x' + '00'.repeat(32)
const DELETER_ROLE = await nft.DELETER_ROLE()

// Grant / revoke
await nft.grantRole(DELETER_ROLE, process.env.DELETER_ADDR!)
await nft.revokeRole(DELETER_ROLE, '0xAddressToRemove')

// Burns
await nft.burnAny(123)                               // single id
await nft.burnAllFor('0xWalletAddress', 50)          // chunked, if exposed by the contract

// Base URI tweaks (if the contract exposes setters)
if (process.env.BASE_URI) {
  await nft.setBaseURI(process.env.BASE_URI)
}
```

---

## Explorer base for your dapp (Polygon)

```ts
const POLYGON_EXPLORERS: Record<number, string> = {
  137:   'https://polygonscan.com',
  80001: 'https://mumbai.polygonscan.com'   // if you still use the old testnet
}
// pick by chainId in your UI; default to mainnet
```

---

## Hardhat tasks & scripts (quick sheet)

```bash
# Clean + compile
npx hardhat clean && npx hardhat compile

# Run local node + deploy
npx hardhat node
npx hardhat run scripts/01_deploy_nft.ts --network localhost
npx hardhat run scripts/02_deploy_paymaster.ts --network localhost

# Verify
npx hardhat verify --network polygon 0xYourAddress <args...>
```

---

## Project layout

```
contracts/
├── contracts/
│   ├── SurveyNFT.sol
│   └── SurveyPaymaster.sol
├── scripts/
│   ├── 01_deploy_nft.ts
│   └── 02_deploy_paymaster.ts
├── typechain-types/            # generated
├── hardhat.config.ts
├── tsconfig.json
└── CONTRACTS_README.md
```

---

## Troubleshooting

- **Verification fails** → wrong network/address/constructor args or explorer indexing delay. Try again after a minute.
- **Paymaster isn’t sponsoring** → ensure it holds MATIC or has RelayHub deposit; check Forwarder and target allow‑list.
- **Out of gas** → when burning many tokens, chunk the calls (UI already does this).
