const { ethers, artifacts} = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Balance: ", (await deployer.getBalance()).toString());

    // Contracts definition and deployment
    const NFTContract = await  ethers.getContractFactory("NFT");
    const nft = await NFTContract.deploy();

    const MarketplaceContract = await ethers.getContractFactory("Marketplace")
    const marketplace = await MarketplaceContract.deploy(1)

    console.log("NFT contract addr: "+ nft.address)
    console.log("Marketplace contract addr "+ marketplace.address)

    saveDetails(nft, "NFT")
    saveDetails(marketplace, "Marketplace")
}

function saveDetails(contract, name) {
    const fs = require("fs")
    const contractDir = __dirname + "/src/contractData";

    if (!fs.existsSync(contractDir)){
        fs.mkdirSync(contractDir)
    }

    fs.writeFileSync(
        contractDir + `/${name}-addr.json`,
        JSON.stringify({address: contract.address}, undefined, 2)
    )

    const contractArtifact = artifacts.readArtifactSync(name)

    fs.writeFileSync(
        contractDir+`/${name}.json`,
        JSON.stringify(contractArtifact, null, 2)
    )
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err)
        process.exit(1)
    })