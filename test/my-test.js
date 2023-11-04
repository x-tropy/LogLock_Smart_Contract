import { expect } from "chai"

// describe("HelloWorld", function () {
// it("Hey! equals Hey!", async function () {
// 	const contract = await ethers.deployContract("HelloWorld", ["Hey!"])
// 	console.log("1st test: message", await contract.get())
// 	expect(await contract.get()).to.equal("Hey!")
// })

// it("Hey! should not equals Hello!", async function () {
// 	const contract = await ethers.deployContract("HelloWorld", ["Hey!"])
// 	console.log("2nd test: message", await contract.get())
// 	expect(await contract.get()).to.equal("Hello!")
// })

// 	it("Should return the new message once it's changed", async function () {
// 		const contract = await ethers.deployContract("HelloWorld", ["Hello World!"])
// 		await contract.update("Hello World!")
// 		console.log("3rd test: message", await contract.get())
// 		expect(await contract.get()).to.equal("Hello World!")
// 	})
// })

describe("LogLock", function () {
	it("verify a message does not exists", async function () {
		const LogLock = await ethers.getContractFactory("LogLock")
		const loglock = await LogLock.deploy()
		await loglock.deployed()
		console.log("Contract deployed to address:", loglock.address)
		expect(await loglock.verify("Hello World!")).to.equal(false)
	})

	it("verify a message exists", async function () {
		const LogLock = await ethers.getContractFactory("LogLock")
		const loglock = await LogLock.deploy()
		await loglock.deployed()
		console.log("Contract deployed to address:", loglock.address)
		await loglock.notarize("Hello World!")
		expect(await loglock.verify("Hello World!")).to.equal(true)
	})
})
