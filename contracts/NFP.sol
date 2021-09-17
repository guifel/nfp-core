// SPDX-License-Identifier: MIT

pragma solidity >=0.6.2 <0.8.0;
pragma abicoder v2;

import "./ERC721Base.sol";

contract NFP is ERC721Base {

    event CreateERC721Rarible(address owner, string name, string symbol);
    
    constructor() public {
        __ERC721Rarible_init("Non-Fungible People", "NFP", "ipfs:/", "");
    }

    function __ERC721Rarible_init(string memory _name, string memory _symbol, string memory baseURI, string memory contractURI) internal initializer {
        _setBaseURI(baseURI);
        __ERC721Lazy_init_unchained();
        __RoyaltiesV2Upgradeable_init_unchained();
        __Context_init_unchained();
        __ERC165_init_unchained();
        __Ownable_init_unchained();
        __ERC721Burnable_init_unchained();
        __Mint721Validator_init_unchained();
        __HasContractURI_init_unchained(contractURI);
        __ERC721_init_unchained(_name, _symbol);
        emit CreateERC721Rarible(_msgSender(), _name, _symbol);
    }

    function mintAndTransfer(LibERC721LazyMint.Mint721Data memory data, address to) public override virtual {
        require(owner() == data.creators[0].account, "minter is not the owner");
        super.mintAndTransfer(data, to);
    }
    uint256[50] private __gap;
}
