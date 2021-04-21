// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

contract NFP is ERC721URIStorage, Ownable {
    using ECDSA for bytes32;

    address public  minter;

    uint256 public count = 0;

    uint48 public mintingPeriod = 61 days;

    uint256 public mintingStarts;
    
    string public baseURI;

    constructor(address minter_, address owner_, string memory baseURI_) ERC721("NFPeople", "NFP") {
        baseURI = baseURI_;
        minter = minter_;
        mintingStarts = block.timestamp;
        transferOwnership(owner_);
    }

    modifier onlyMintingPeriod() {
        require(block.timestamp < mintingStarts + mintingPeriod, "nfp/minting-period-expired");
        _;
    }

    // -- Admin --
    
    // Set the minter role to a new address 
    function setMinter(address to) public onlyOwner {
        minter = to;
    }

    // Set the base URI for the IPFS cid
    function setBaseURI(string memory str) public onlyOwner {
        baseURI = str;
    }

    // -- End Admin --

    function mint(
        address to,
        string memory handle,
        string memory cid,
        bytes memory sig
    ) public onlyMintingPeriod returns(uint256) {

        // Verify minting authorization 
        address signer = keccak256(abi.encodePacked(to, handle, cid)).toEthSignedMessageHash().recover(sig);
        console.log("signer %s", signer);
        require(signer == minter, "npf/invalid-signature");


        // Mint the NFT 
        count += 1;
        _safeMint(to, count);
        _setTokenURI(count, cid);
        return count;
    }

    // -- Internal --

    // Implement the abstract baseURI getter
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // -- End Internal --
}
