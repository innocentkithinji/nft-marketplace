require("@nomiclabs/hardhat-waffle")

module.exports = {
    solidity: "0.8.9",
    // networks: {
    //     rinkeby: {
    //         url: "https://rinkeby.infura.io/v3/API_KEY",
    //         accounts: ["ACCOUNT_PRIVATE_KEY"]
    //     }
    // },
    paths: {
        artifacts: "./src/artifacts",
        sources: "./src/contracts",
        cache: "./src/cache",
        tests: "./src/tests"
    }
}