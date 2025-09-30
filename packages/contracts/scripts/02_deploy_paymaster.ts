import { ethers } from "hardhat";
import * as dotenv from "dotenv"; dotenv.config();

async function main() {
    const relayHub = process.env.RELAYHUB_MAINNET! || "0xD216153c06e857cd7f72665e0Af1D7D82172F494";
    const forwarder = process.env.FORWARDER_MAINNET!;
    const target = process.env.NFT_ADDR!; // nach Step 1 setzen!

    const Paymaster = await ethers.getContractFactory("SurveyPaymaster");
    const pm = await Paymaster.deploy(relayHub, forwarder, target);
    await pm.waitForDeployment();
    console.log("SurveyPaymaster:", await pm.getAddress());
}
main().catch((e)=>{ console.error(e); process.exit(1); });
