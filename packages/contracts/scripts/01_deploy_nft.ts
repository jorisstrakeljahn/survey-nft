// scripts/01_deploy_nft.ts
import * as dotenv from "dotenv";
dotenv.config({ override: true });                 // <- wichtig
import { ethers } from "hardhat";

function req(k: string) {
    const v = process.env[k];
    if (!v || !v.trim()) throw new Error(`Missing ${k} in .env`);
    return v;
}

async function main() {
    const forwarder = ethers.getAddress(req("FORWARDER_POLYGON")); // NICHT *_MAINNET
    const baseURI   = req("BASE_URI");
    console.log({ forwarder, baseURI }); // sanity check

    const NFT = await ethers.getContractFactory("SurveyNFT");
    const nft = await NFT.deploy(forwarder, baseURI);
    await nft.waitForDeployment();
    console.log("SurveyNFT:", await nft.getAddress());
}
main().catch(e => { console.error(e); process.exit(1); });
