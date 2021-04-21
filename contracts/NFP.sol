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

    // Send the fees collected from the minting
    function collectFees(address to) public onlyOwner {
        uint256 balance = address(this).balance;
        payable(to).transfer(balance);
    }

    // -- End Admin --

    // Mint a NFT with an ECDSA signature
    function mint(
        address to,
        string memory handle,
        string memory cid,
        bytes memory sig
    ) public payable onlyMintingPeriod returns(uint256) {

        // Check payment
        require(msg.value >= currentMintingPrice(), "nfp/insufficient-payment");

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

    function currentMintingPrice() public view returns(uint256) {
        return count * 0.001 ether;        
    }

    // -- Internal --

    // Implement the abstract baseURI getter
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    // -- End Internal --
}
