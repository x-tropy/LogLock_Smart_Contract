![loglock logo](https://loglock.pages.dev/images/loglock.svg)

# :chains: Smart contract development

This smart contract is already deployed on Ethereum Sepolia test net. You can check it out using [etherscan](https://sepolia.etherscan.io/address/0xd078377970eA26c29FeFa1410018A84ed861cc21). The contract address is: `0xd078377970eA26c29FeFa1410018A84ed861cc21`

## Usage

LogLock serves to make data usage transparent. This contract has two methods:

1. verify: to verify whether a log item is already notarized by contract owner. Anyone could access to this contract function. The returned result is either `true` or `false`.
2. notarize: only the contract owner can notarize a log item.

### Test the deployed smart contract

In `scripts/interact.js`:

```
import { ethers } from "ethers"

// Get environment variables
require("dotenv").config()
const address = process.env.CONTRACT_ADDRESS
const abi = require("../artifacts/contracts/LogLock.sol/LogLock.json").abi
const privateKey = process.env.PRIVATE_KEY
const apiUrl = process.env.ALCHEMY_API_URL

// 1. Provider
const alchemyProvider = new ethers.providers.JsonRpcProvider(apiUrl)

// 2. Signer
const signer = new ethers.Wallet(privateKey, alchemyProvider)

// 3. Contract
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
```

1. This script is not going to be called by hardhat, we put it here only for easier file organization.
2. We need to import ethers, and also call `require("dotenv").config()` before accessing environment variables.
3. **:warning: Important**: Use `JsonRpcProvider` to connect to a sepolia testnet. AlchemyProvider in ethers v5 doesn't support sepolia.
4. In the `main()` function, we have tried to call the `notarize` function to notarize a `genesis log` and also test it with `verify` function.

## Developer notes

### Preparation

1. Get Alchemy API key: visit [Alchemy dashboard](https://dashboard.alchemy.com), need registration before creating a free API key.
2. Get a crypto wallet: visit [metamask](https://metamask.io/) or other trusted wallets.
3. Get Sepolia ETH from a faucet: visit [infura faucet](https://www.infura.io/faucet/sepolia)

Now we have a wallet that already got some ETHs for deploying and testing smart contract on the Sepolia test net. We also have a functional RPC url will be used later.

### Hardhat

Install hardhat globally:

```
npm install -g hardhat
```

Install other dependencies:

```
npm install --save-dev @nomiclabs/hardhat-ethers "ethers@^5.7.2"
```

Initiate a new hardhat project:

```
npx hardhat
```

> Notice: hardhat is dependent on ethers v5, so stick with the most popular version: [ethers v5.7.2](https://docs.ethers.org/v5/)

### Configuration

The `.env` file looks like this:

```
PRIVATE_KEY='xxxxxxxxxxxxx'
WALLET_ADDRESS='xxxxxxxxxxxxx'
ALCHEMY_API_KEY='xxxxxxxxxxxxx'
ALCHEMY_API_URL='xxxxxxxxxxxxx'
CONTRACT_ADDRESS='xxxxxxxxxxxxx'
```

Replace those `xxxxxx` with right stuff.

The `hardhat.config.cjs` looks like this:

```
// import dependencies
require("dotenv").config()
require("@nomiclabs/hardhat-ethers")

const { ALCHEMY_API_URL, PRIVATE_KEY } = process.env

module.exports = {
  // Solidity version should match with your contract file's declaration
	solidity: "0.8.9",
  // We're using Sepolia here
	defaultNetwork: "sepolia",
	networks: {
		hardhat: {},
		sepolia: {
			url: ALCHEMY_API_URL,
			accounts: [PRIVATE_KEY]
		}
	}
}
```

### Compilation

After defining the smart contract under `contracts/` folder, we can complie it using:

```
npx hardhat compile
```

This will generate an `artifacts/` folder in the root.

### Deployment

In `./deployments/deploy.js`:

```
async function main() {
	const contract = await ethers.getContractFactory("LogLock")
	const deployed = await contract.deploy()
	console.log("Contract Deployed to Address:", deployed.address)
}
main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error)
		process.exit(1)
	})
```

1. While running with hardhat, `ethers` is automatically exposed to the context, so we don't need to manually import `ethers`.
2. `ethers.getContractFactory()` can automatically locate the contract abi under `artifacts` folder according to the given name.

Run this depolyment script with:

```
npx hardhat run deployments/deploy.js --network sepolia
```

1. We are using Sepolia test net. Goerli is going to be discarded by the end of 2023.
2. The `seplolia` parameter points to our previously configured `hardhat.config.cjs` file.
3. All we needed when deploying a smart contract is `ALCHEMY_API_URL` & `PRIVATE_KEY`.
