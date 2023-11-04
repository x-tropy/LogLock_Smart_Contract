// ------------------------------------------------------------
// <!important> Use ethers v5.7.2
// ------------------------------------------------------------

import { ethers } from "ethers"

// Get environment variables
require("dotenv").config()
const address = process.env.CONTRACT_ADDRESS
const abi = require("../artifacts/contracts/LogLock.sol/LogLock.json").abi
const privateKey = process.env.PRIVATE_KEY
const apiUrl = process.env.ALCHEMY_API_URL

// ------------------------------------------------------------
// <!important> Use JsonRpcProvider to connect to a sepolia testnet
// ------------------------------------------------------------

// Step 1. Provider
const alchemyProvider = new ethers.providers.JsonRpcProvider(apiUrl)

// Step 2. Signer
const signer = new ethers.Wallet(privateKey, alchemyProvider)

// Step 3. Contract
const contract = new ethers.Contract(address, abi, signer)

const main = async () => {
	const { hash } = await contract.notarize("genesis log")

	// Look transaction on Etherscan
	console.log("Transaction URL: ", `https://sepolia.etherscan.io/address/${hash}`)

	// false
	console.log(await contract.verify("random log"))

	// true
	console.log(await contract.verify("genesis log"))
}

main()
