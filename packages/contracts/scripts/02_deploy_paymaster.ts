import * as dotenv from "dotenv";
dotenv.config({ override: true });
import { ethers } from "hardhat";

// nimmt den ersten gesetzten ENV-Wert aus der Liste
function reqAny(names: string[]): string {
    for (const n of names) {
        const v = process.env[n];
        if (v && v.trim()) return v.trim();
    }
    throw new Error(`Missing any of: ${names.join(", ")}`);
}

function gweiFormat(v: bigint) {
    return `${ethers.formatUnits(v, "gwei")} gwei`;
}

async function getFees() {
    const latest = await ethers.provider.getBlock("latest");
    const base = latest?.baseFeePerGas ?? 0n;
    const tip = ethers.parseUnits(process.env.TIP_GWEI ?? "150", "gwei"); // ggf. erhöhen
    const maxFee = base * 2n + tip;
    return { base, tip, maxFee };
}

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);

    // ENV lesen (deine .env passt dazu)
    const RELAY_HUB = ethers.getAddress(reqAny(["RELAY_HUB_POLYGON", "RELAY_HUB", "RELAYHUB_POLYGON"]));
    const FORWARDER = ethers.getAddress(reqAny(["FORWARDER_POLYGON", "FORWARDER"]));
    const TARGET    = ethers.getAddress(reqAny(["NFT_ADDR", "NFT_ADDR_POLYGON"]));
    const DEPOSIT   = process.env.PAYMASTER_DEPOSIT ?? "0.2"; // MATIC

    console.log({ RELAY_HUB, FORWARDER, TARGET, DEPOSIT });

    // Fees bestimmen
    const { base, tip, maxFee } = await getFees();
    console.log("Fees:", { base: gweiFormat(base), tip: gweiFormat(tip), maxFee: gweiFormat(maxFee) });

    // ---- Deploy (Konstruktor: relayHub, forwarder, target) ----
    const PM = await ethers.getContractFactory("SurveyPaymaster");
    const pm = await PM.deploy(RELAY_HUB, FORWARDER, TARGET, {
        maxPriorityFeePerGas: tip,
        maxFeePerGas: maxFee,
    });
    const deployTx = pm.deploymentTransaction();
    console.log("Deploy TX:", deployTx?.hash);
    await pm.waitForDeployment();
    const pmAddr = await pm.getAddress();
    console.log("SurveyPaymaster deployed to:", pmAddr);

    // ---- RelayHub-Deposit ----
    const hub = new ethers.Contract(
        RELAY_HUB,
        [
            "function depositFor(address target) external payable",
            "function balanceOf(address) external view returns (uint256)",
        ],
        deployer
    );

    const before = await hub.balanceOf(pmAddr);
    console.log("RelayHub balance BEFORE:", ethers.formatEther(before), "MATIC");

    const depTx = await hub.depositFor(pmAddr, {
        value: ethers.parseEther(DEPOSIT),
        maxPriorityFeePerGas: tip,
        maxFeePerGas: maxFee,
    });
    console.log("Deposit TX:", depTx.hash);
    await depTx.wait();

    const after = await hub.balanceOf(pmAddr);
    console.log("RelayHub balance  AFTER:", ethers.formatEther(after), "MATIC");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
