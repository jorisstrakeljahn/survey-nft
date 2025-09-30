import { expect } from "chai";
import { ethers } from "hardhat";
import { SurveyNFT__factory, SurveyNFT } from "../typechain-types";

describe("SurveyNFT", () => {
    it("mints once per (wallet,survey), stores points, and allows burn by owner", async () => {
        const [owner, user] = await ethers.getSigners();

        const forwarder = ethers.Wallet.createRandom().address; // dummy lokal ok
        const baseURI = "https://cdn.example.com/nfts/";

        const nft: SurveyNFT = await new SurveyNFT__factory(owner).deploy(forwarder, baseURI);
        await nft.waitForDeployment();

        const u = nft.connect(user);
        await (await u.claimNFT(42, 2)).wait();

        expect(await nft.ownerOf(1)).to.eq(await user.getAddress());
        expect(await nft.tokenPoints(1)).to.eq(2);
        expect(await nft.tokenURI(1)).to.eq(baseURI + "42-2.json");

        await expect(u.claimNFT(42, 3)).to.be.revertedWith("already minted");
        await expect(nft.connect(owner).burn(1)).to.be.revertedWith("not owner");
        await (await u.burn(1)).wait();
        await expect(nft.ownerOf(1)).to.be.reverted;
    });
});
