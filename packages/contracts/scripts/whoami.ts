import { ethers } from "hardhat";

async function main() {
    // @ts-ignore
    const [deployer] = await ethers.getSigners();
    const addr = await deployer.getAddress();
    // @ts-ignore
    const bal  = await ethers.provider.getBalance(addr);
    console.log("Deployer:", addr);
    console.log("Balance:", ethers.formatEther(bal), "ETH");
}
main().catch((e)=>{ console.error(e); process.exit(1); });
