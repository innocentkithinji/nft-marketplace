const { default: userEvent } = require("@testing-library/user-event")
const {ethers} = require("hardhat");
const {expect} = require("chai")

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)


describe("Marketplace", function () {
    let deployer, addr1, addr2, nft, marketplace;
    let feepercent = 1;
    let URI = "SampleURI";

    beforeEach(async function(){
        const NFT =  await ethers.getContractFactory("NFT");
        const Marketplace =  await ethers.getContractFactory("Marketplace");

        [deployer, addr1, addr2] = await ethers.getSigners()

        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy(feepercent);
    });

    describe("Deployment", function(){
        it("Should track feeAccount and feePercent of the marketplace", async function(){
            expect(await marketplace.feeAccount()).to.equal(deployer.address);
            expect(await marketplace.feePercent()).to.equal(feepercent);
        });
    });

    describe("Making marketplace item", function() {
        let price = 1;
        beforeEach(async function(){
            await nft.connect(addr1).mint(URI)
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
        });

        it("Should track newly created item, transfer NFT from seller to marketplace and emit Offered event", async function () {
            await expect(marketplace.connect(addr1).makeItem(nft.address, 1 , toWei(1)))
                .to.emit(marketplace, "Offered")
                .withArgs(
                    1,
                    nft.address,
                    1,
                    toWei(1),
                    addr1.address
                )

            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
            expect(await marketplace.itemCount()).to.equal(1)

            const item = await marketplace.items(1)
            expect(item.itemId).to.equal(1)
            expect(item.nft).to.equal(nft.address)
            expect(item.tokenId).to.equal(1)
            expect(item.price).to.equal(toWei(1))
            expect(item.sold).to.equal(false)
        });

        it("Should fail if price is 0", function(){
            expect(marketplace.connect(addr1).makeItem(nft.address, 1, 0))
                .to.revertedWith("Price must be greater than zero!")
        });
    });


    describe("Purchasing marketplace Item", function(){
        let price = 1;
        beforeEach(async function(){
            await nft.connect(addr1).mint(URI)
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true)
            await marketplace.connect(addr1).makeItem(nft.address, 1, toWei(price))
        });

        it("Should track purchases of Item, transfer nft from marketplace to buyer and emit Bought event", async function(){

            const sellerInitialBalance = await addr1.getBalance()
            const feeAccountInitialBalalnce = await deployer.getBalance()

            let totalItemPrice = await marketplace.getTotalPrice(1);

            await expect(marketplace.connect(addr2).purchaseItem(1, {value: totalItemPrice}))
                .to.emit(marketplace, "Bought")
                .withArgs(
                    1,
                    nft.address,
                    1,
                    toWei(price),
                    addr1.address,
                    addr2.address
                );

            const item = await marketplace.items(1)
            expect(item.sold).to.equal(true)

            const sellerFinalEthBal = await addr1.getBalance()
            const feeAccountFinalBalance = await deployer.getBalance()

            expect(+ fromWei(sellerFinalEthBal)).to.equal(+price + +fromWei(sellerInitialBalance))

            const fee = (feepercent / 100) * price

            expect(+fromWei(feeAccountFinalBalance)).to.equal(+fee + +fromWei(feeAccountInitialBalalnce))
            expect(await nft.ownerOf(1)).to.equal(addr2.address)
        });


        it("Should not purchase non existing Items", async function(){

            let totalItemPrice = await marketplace.getTotalPrice(1);

            await expect(marketplace.connect(addr2).purchaseItem(3, {value: totalItemPrice}))
                .to.revertedWith("Item doesn't exist!")
        });

        it("Should not purchase with less ether than price plus market fee ", async function(){

            await expect(marketplace.connect(addr2).purchaseItem(1, {value: toWei(0.8)}))
                .to.revertedWith("Not enough Ether to cover item price and market fee")
        });

        it("Should not be able to resell already sold items", async function(){
            let totalItemPrice = await marketplace.getTotalPrice(1);

            await marketplace.connect(addr2).purchaseItem(1, {value: totalItemPrice})

            await expect(marketplace.connect(deployer).purchaseItem(1, {value: totalItemPrice}))
                .to.revertedWith("item already sold")
        });
    });
});