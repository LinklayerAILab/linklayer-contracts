// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Punk is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    // 事件
    event NFTMinted(address indexed to, uint256 tokenId);

    constructor() ERC721("ErbieNFT", "ENFT") Ownable(msg.sender) {}
 
    function mintNFT(
        address recipient,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        _tokenIdCounter++;
        uint256 newItemId = _tokenIdCounter;

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI); // 使用 ERC721URIStorage 提供的方法

        emit NFTMinted(recipient, newItemId);
        return newItemId;
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId); // 使用 ERC721URIStorage 提供的方法
    }

    function contractURI() public view returns (string memory) {
        return "ipfs://QmTNgv3jx2HHfBjQX9RnKtxj2xv2xQDtbVXoRi5rJ3a46e";
    }
}
