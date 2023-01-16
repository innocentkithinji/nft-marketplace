require("@nomiclabs/hardhat-waffle")

module.exports = {
    solidity: "0.8.9",
    networks: {
        goerli: {
            url: "https://goerli.infura.io/v3/d8333abfdb474d67be3ff92625114e81",
            accounts: ["2e8d1ffa7e6acc94bd176434a53a4ae90139a87b601b4b4863aa242449981c61"]
        }
    },
    paths: {
        artifacts: "./src/artifacts",
        sources: "./src/contracts",
        cache: "./src/cache",
        tests: "./src/tests"
    }
}
