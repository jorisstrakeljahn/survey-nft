import { ethers } from "hardhat";

function req(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing ${name} in .env`);
    return v;
}

async function main() {
    const NAME     = process.env.NAME   ?? "SurveyNFT";
    const SYMBOL   = process.env.SYMBOL ?? "SVY";

    // von dir in der .env
    const FORWARDER = req("FORWARDER_POLYGON");   // 0xdA78...
    const BASE_URI  = req("BASE_URI");            // https://vpstunden...
    const ADMIN     = req("ADMIN_ADDR");          // 0x6f9B...
    const DELETER   = req("DELETER_ADDR");        // 0x6f9B...

    console.log({
        name: NAME,
        symbol: SYMBOL,
        forwarder: FORWARDER,
        baseURI: BASE_URI,
        admin: ADMIN,
        deleter: DELETER,
    });

    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);

    const SurveyNFT = await ethers.getContractFactory("SurveyNFT");
    const nft = await SurveyNFT.deploy(
        NAME,
        SYMBOL,
        FORWARDER,
        BASE_URI,
        ADMIN,
        DELETER
    );

    await nft.waitForDeployment();
    console.log("SurveyNFT deployed to:", await nft.getAddress());
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
