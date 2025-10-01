import * as dotenv from "dotenv";
dotenv.config({ override: true });
import { ethers } from "hardhat";

function req(name: string): string {
    const v = process.env[name];
    if (!v || !v.trim()) throw new Error(`Missing ${name} in .env`);
    return v;
}

async function main() {
    const relayHub  = ethers.getAddress(req("RELAYHUB_POLYGON"));   // <- POLYGON
    const forwarder = ethers.getAddress(req("FORWARDER_POLYGON"));  // <- POLYGON
    const target    = ethers.getAddress(req("NFT_ADDR_POLYGON"));   // <- nach NFT-Deploy setzen
    const deleter   = ethers.getAddress(req("DELETER_ADDR"));

    console.log({ relayHub, forwarder, target, deleter });

    const PM = await ethers.getContractFactory("SurveyPaymaster");
    const pm = await PM.deploy(relayHub, forwarder, target, deleter);
    await pm.waitForDeployment();
    console.log("SurveyPaymaster:", await pm.getAddress());
}

main().catch((e)=>{ console.error(e); process.exit(1); });
