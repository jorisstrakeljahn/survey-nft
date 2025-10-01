import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
    solidity: "0.8.28",
    typechain: { target: "ethers-v6", outDir: "typechain-types" },
    networks: {
        hardhat: {},
        sepolia: {
            url: process.env.ALCHEMY_SEPOLIA || "",
            accounts: process.env.DEPLOYER_KEY ? [process.env.DEPLOYER_KEY] : [],
        },
        mainnet: {
            url: process.env.ALCHEMY_MAINNET || "",
            accounts: process.env.DEPLOYER_KEY ? [process.env.DEPLOYER_KEY] : [],
        },
        polygon: {
            url: process.env.POLYGON_MAINNET!,  // z. B. https://polygon-rpc.com
            accounts: [process.env.DEPLOYER_KEY!],
            chainId: 137,
        },
    },
    etherscan: {
        //apiKey: process.env.ETHERSCAN_API_KEY,
        apiKey: process.env.POLYGONSCAN_API_KEY || "",
    },
};

export default config;
