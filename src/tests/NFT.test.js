const {default: userEvent} = require("@testing-library/user-event")
const {ethers} = require("hardhat");
const {expect} = require("chai")

describe("NFT", function () {
    let deployer, addr1, addr2, nft;
    let URI = "SampleURI";
    beforeEach(async function () {
        const NFTContract = await ethers.getContractFactory("NFT");

        [deployer, addr1, addr2] = await ethers.getSigners();

        nft = await NFTContract.deploy();
    });

    describe("Running", function () {
        it("Should track name and symbol of the nft collection", async function () {
            expect(await nft.name()).to.equal("DApp NFT");
            expect(await nft.symbol()).to.equal("DANFT");
        });
    });

    describe("Minting NFTs", function () {
        it("Should track each minted NFT", async function () {

            //addr1 mints an nft
            await nft.connect(addr1).mint(URI);
            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);

            //addr1 mints an nft
            await nft.connect(addr2).mint(URI);
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            expect(await nft.tokenURI(2)).to.equal(URI);
        });
    });

})
