import { ethers } from "hardhat";
import { Contract, Interface } from "ethers";

const FORWARDER_ABI = [
    "function getNonce(address from) view returns (uint256)",
    "function verify((address from,address to,uint256 value,uint256 gas,uint256 nonce,bytes data) req, bytes signature) external view returns (bool)",
    "function execute((address from,address to,uint256 value,uint256 gas,uint256 nonce,bytes data) req, bytes signature) external payable returns (bool,bytes)"
];

async function main() {
    const FORWARDER = process.env.FWD_ADDR!;
    const NFT_ADDR  = process.env.NFT_ADDR!;
    if (!FORWARDER || !NFT_ADDR) throw new Error("Set FWD_ADDR & NFT_ADDR env vars");

    // @ts-ignore
    const [relayer, user] = await ethers.getSigners();
    const relayerAddr = await relayer.getAddress();
    const userAddr    = await user.getAddress();
    console.log("relayer:", relayerAddr);
    console.log("user:   ", userAddr);

    const forwarder = new Contract(FORWARDER, FORWARDER_ABI, relayer);
    const nftIface = new Interface(["function claimNFT(uint256,uint8)"]);
    const data = nftIface.encodeFunctionData("claimNFT", [42, 2]);

    const nonce = await forwarder.getNonce(userAddr);
    // @ts-ignore
    const chain = await ethers.provider.getNetwork();
    const domain = {
        name: "MinimalForwarder",
        version: "0.0.1",
        chainId: chain.chainId,
        verifyingContract: FORWARDER
    };
    const types = {
        ForwardRequest: [
            { name: "from",  type: "address" },
            { name: "to",    type: "address" },
            { name: "value", type: "uint256" },
            { name: "gas",   type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "data",  type: "bytes" }
        ]
    };
    const req = { from: userAddr, to: NFT_ADDR, value: 0n, gas: 250_000n, nonce, data };

    const signature = await user.signTypedData(domain as any, types as any, req);
    console.log("verify:", await forwarder.verify(req, signature));

    const tx = await forwarder.execute(req, signature, { gasLimit: 300_000 });
    const rc = await tx.wait();
    console.log("executed in block", rc?.blockNumber);

    const nft = new Contract(NFT_ADDR, ["function ownerOf(uint256) view returns (address)"], relayer);
    console.log("ownerOf(1):", await nft.ownerOf(1));
}
main().catch((e)=>{ console.error(e); process.exit(1); });
