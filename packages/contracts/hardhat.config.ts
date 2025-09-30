import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
    solidity: "0.8.28",
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
    },
};

export default config;
