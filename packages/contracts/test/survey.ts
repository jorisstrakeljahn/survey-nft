import { expect } from "chai";
import { ethers } from "hardhat";
import { SurveyNFT__factory, SurveyNFT } from "../typechain-types";

describe("SurveyNFT (slim)", () => {
    it("mints once per (wallet,survey), stores points & survey, blocks second, allows burn", async () => {
        // @ts-ignore
        const [owner, user] = await ethers.getSigners();

        const forwarder = ethers.Wallet.createRandom().address; // dummy fuer lokal
        const baseURI = "https://cdn.example.com/nfts/";

        const nft: SurveyNFT = await new SurveyNFT__factory(owner).deploy(forwarder, baseURI);
        await nft.waitForDeployment();

        // user mintet 1x für surveyId=42, points=2
        const asUser = nft.connect(user);
        await (await asUser.claimNFT(42, 2)).wait();

        // Checks
        expect(await nft.ownerOf(1)).to.eq(await user.getAddress());
        expect(await nft.tokenPoints(1)).to.eq(2);
        expect(await nft.tokenSurveyId(1)).to.eq(42);
        expect(await nft.tokenURI(1)).to.eq(baseURI + "42-2.json");

        // zweiter Claim für gleiche survey -> revert
        await expect(asUser.claimNFT(42, 3)).to.be.revertedWith("already minted");

        // burn nur owner
        await expect(nft.connect(owner).burn(1)).to.be.revertedWith("not owner");
        await (await asUser.burn(1)).wait();
        await expect(nft.ownerOf(1)).to.be.reverted; // burned
    });
});
