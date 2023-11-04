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

// Contract address
// https://sepolia.etherscan.io/address/0xd078377970eA26c29FeFa1410018A84ed861cc21
