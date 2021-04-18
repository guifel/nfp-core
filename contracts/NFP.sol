// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

contract NFP is ERC721URIStorage, Ownable {
    using ECDSA for bytes32;

    uint256 public count = 0;

    constructor() ERC721("YOLO Non-fungible people", "NFP") {
        console.log("Deploy NFP");
    }
    
    function mint(address to, bytes memory sig, string memory handle) public {
        address signer = keccak256(abi.encodePacked(to, handle))
        .toEthSignedMessageHash()
        .recover(sig);
        
        console.log("signer %s", signer);

        require(signer == owner(), "npf/invalid-signature");

        count += 1;
        super._safeMint(to, count);
    }
}
