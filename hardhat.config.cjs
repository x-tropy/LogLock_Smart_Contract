require("dotenv").config()
require("@nomiclabs/hardhat-ethers")

const { ALCHEMY_API_URL, PRIVATE_KEY } = process.env

module.exports = {
	solidity: "0.8.9",
	defaultNetwork: "sepolia",
	networks: {
		hardhat: {},
		sepolia: {
			url: ALCHEMY_API_URL,
			accounts: [PRIVATE_KEY]
		}
	}
}
