// scripts/deploy-nft-mainnet.ts
import { ethers } from "hardhat";

async function main() {
    const FORWARDER_MAINNET = "0xB2b5841DBeF766d4b521221732F9B618fCf34A87"; // GSN v3
    const baseURI = process.env.BASE_URI!; // z.B. https://cdn.example.com/nfts/

    const NFT = await ethers.getContractFactory("SurveyNFT");
    const nft = await NFT.deploy(FORWARDER_MAINNET, baseURI);
    await nft.waitForDeployment();

    console.log("SurveyNFT (mainnet):", await nft.getAddress());
}
main().catch((e)=>{ console.error(e); process.exit(1); });
