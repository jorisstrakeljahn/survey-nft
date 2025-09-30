import { ethers } from "hardhat";

async function main() {
    const forwarder =
        process.env.FORWARDER_SEPOLIA ||
        process.env.FORWARDER_MAINNET ||
        "";
    const baseURI = process.env.BASE_URI || "ipfs://YOUR_CID/"; // z.B. ipfs://bafy.../

    if (!forwarder) throw new Error("FORWARDER_* fehlt in .env");

    const NFT = await ethers.getContractFactory("SurveyNFT");
    const nft = await NFT.deploy(forwarder, baseURI);
    await nft.waitForDeployment();

    console.log("SurveyNFT deployed:", await nft.getAddress());
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
