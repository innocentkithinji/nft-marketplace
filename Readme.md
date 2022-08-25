# NFT MarketPlace Smart Contracts
<div align="center" style="font-size: 150px">
    <img src="https://blog.logomyway.com/wp-content/uploads/2021/11/Ethereum-logo.png" alt="ethereum" height="110px">
+
    <img src="https://seeklogo.com/images/H/hardhat-logo-888739EBB4-seeklogo.com.png" alt="ethereum" height="100px">
</div>

***
## About
This is a hardhat project for an nft smart contract following the ERC721 protocol nd also a marketplace smart contract
that can interact with anu ERC721 smart contract.

The smart contracts were written using solidity and can be found in the `src/contracts` directory. They mainly use the 
`openzeppelin` defined standards such as the `ERC721URIStorage` for the nft implementation and the `ReentrancyGuard` to 
secure the marketplace from reentrancy attacks. 

Tests were written using javascript with chai.

## Installing the dependencies
After clonning do install the needed packages by running:
```shell
 npm install
```

After all packages have run next step is to run it on a local network.
***
### Running a local network
You can run your own local network simply by running
```shell
 npm run start-chain
```
This will create a evm node and give you 10 accounts for testings.

***
### Deploying the scripts
To deploy the scripts it can be done by running
```shell
 npm run deploy
```
This deploys the two contracts to the local chain that you started above and prints out the address. 
*Example:*
```shell
Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Balance:  9999997146026690393036
NFT contract addr: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
Marketplace contract addr 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
```
This output shows address doing the deployment and its balance and also the contract address for the two contracts.
***
### Interacting with the smart contacts
Interaction with the smart contracts can be done via the hardhat console by running
```shell
 npm run console
```
***

### Running the tests
Running the tests can simply be done by running
```shell
 npm run test
```
There are a total of 9 tests that should run.

### Deploying the contracts to a remote chain
In this example we are to deploy the smart contracts to a remote chain via an endpoint.
In this case we will use rinkeby network via infura.
You will need the `infura api key` and a rinkeby test account `private key`

One we will modify the `hardhat.config.js` file and add the following lines.
```
    networks: {
        rinkeby: {
            url: "https://rinkeby.infura.io/v3/API_KEY",
            accounts: ["ACCOUNT_PRIVATE_KEY"]
        }
    }
```

The final hardhat network config can look something like this:
```js
require("@nomiclabs/hardhat-waffle")

module.exports = {
    solidity: "0.8.9",
    networks: {
        rinkeby: {
            url: "https://rinkeby.infura.io/v3/API_KEY",
            accounts: ["ACCOUNT_PRIVATE_KEY"] 
        }
    },
    paths: {
        artifacts: "./src/artifacts",
        sources: "./src/contracts",
        cache: "./src/cache",
        tests: "./src/tests"
    }
}
```

Replace the `API_KEY` with the infura api key and the `ACCOUNT_PRIVATE_KEY` with your own account private key.
Then run the following command to deploy to rinkeby:
```shell
 npx hardhat run ./deploy.js --network rinkeby
```