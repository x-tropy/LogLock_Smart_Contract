// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract LogLock {
    address public immutable owner;
    bytes32[] public proofs;
    event NewLogNotarized(bytes32 indexed proof);

    constructor() {
        owner = msg.sender;
    }

    function notarize(string memory _hashInput) public returns (bytes32) {
        require(msg.sender == owner, "Only the owner can notarize");
        bytes32 proof = getProof(_hashInput);
        storeProof(proof);
        emit NewLogNotarized(proof);
        return proof;
    }

    function verify(string memory _hashInput) public view returns (bool) {
        bytes32 proof = getProof(_hashInput);
        return hasProof(proof);
    }

    function getProof(string memory _hashInput) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_hashInput));
    }

    function storeProof(bytes32 proof) internal {
        proofs.push(proof);
    }

    function hasProof(bytes32 proof) internal view returns (bool) {
        for (uint256 i = 0; i < proofs.length; i++) {
            if (proofs[i] == proof) {
                return true;
            }
        }
        return false;
    }
}