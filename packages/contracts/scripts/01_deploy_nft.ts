import { ethers } from "hardhat";
import * as dotenv from "dotenv"; dotenv.config();

async function main() {
    const forwarder = process.env.FORWARDER_MAINNET!;
    const baseURI  = process.env.BASE_URI!;
    const NFT = await ethers.getContractFactory("SurveyNFT");
    const nft = await NFT.deploy(forwarder, baseURI);
    await nft.waitForDeployment();
    console.log("SurveyNFT:", await nft.getAddress());
}
main().catch((e)=>{ console.error(e); process.exit(1); });
