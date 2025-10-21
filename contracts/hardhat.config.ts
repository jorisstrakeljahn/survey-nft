// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-preprocessor";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
    solidity: "0.8.28",
    typechain: { target: "ethers-v6", outDir: "typechain-types" },
    networks: {
        hardhat: {},
        sepolia: {
            url: process.env.ALCHEMY_SEPOLIA || "",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
        mainnet: {
            url: process.env.ALCHEMY_MAINNET || "",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
        polygon: {
            url: process.env.RPC_URL!,
            accounts: [process.env.PRIVATE_KEY!],
            chainId: 137,
        },
    },
    etherscan: {
        apiKey: process.env.POLYGONSCAN_API_KEY || "",
    },

    // ✅ korrekt typisiert:
    preprocess: {
        eachLine: (_hre) => ({
            transform: (line: string, sourceInfo: { absolutePath: string }) => {
                // Pfad vereinheitlichen (Windows/Linux)
                const abs = sourceInfo.absolutePath.replace(/\\/g, "/");

                // Nur die Dateien von @opengsn/contracts remappen
                if (abs.includes("node_modules/@opengsn/contracts/")) {
                    return line.replace(
                        /@openzeppelin\/contracts\//g,
                        "@opengsn/contracts/node_modules/@openzeppelin/contracts/"
                    );
                }
                return line;
            },
        }),
    },
};

export default config;
