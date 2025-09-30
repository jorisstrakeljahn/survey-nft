import { ethers } from "hardhat";

async function main() {
    const Fwd = await ethers.getContractFactory("OZERC2771Forwarder");
    const fwd = await Fwd.deploy();
    await fwd.waitForDeployment();
    const forwarder = await fwd.getAddress();

    const baseURI = process.env.BASE_URI || "https://cdn.example.com/nfts/";
    const NFT = await ethers.getContractFactory("SurveyNFT");
    const nft = await NFT.deploy(forwarder, baseURI);
    await nft.waitForDeployment();

    console.log("Forwarder:", forwarder);
    console.log("SurveyNFT:", await nft.getAddress());
}
main().catch((e)=>{ console.error(e); process.exit(1); });
