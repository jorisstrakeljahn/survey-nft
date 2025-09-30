// scripts/deploy-paymaster-mainnet.ts
import { ethers } from "hardhat";

async function main() {
    const RELAY_HUB = "0x8f812FAE28a3Aa634d97659091D6540FABD234F5"; // GSN v3
    const FORWARDER = "0xB2b5841DBeF766d4b521221732F9B618fCf34A87";
    const NFT_ADDR  = process.env.NFT_ADDR!;

    const PM = await ethers.getContractFactory("YourPaymaster"); // dein v3-Paymaster
    const pm = await PM.deploy(RELAY_HUB, FORWARDER, NFT_ADDR /* weitere args falls nötig */);
    await pm.waitForDeployment();
    console.log("Paymaster (mainnet):", await pm.getAddress());
}
main().catch((e)=>{ console.error(e); process.exit(1); });
