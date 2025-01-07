// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Punk is ERC721, Ownable {
    uint256 public constant MAX_SUPPLY = 10_000_000; 
    uint256 private _currentTokenId = 1; 
    string private _baseTokenURI;

    event NFTMinted(address indexed to, uint256 tokenId);

    constructor(
        string memory baseURI_,
        string memory name_,
        string memory symbol_
    ) ERC721(name_,symbol_) Ownable(msg.sender) {
        _baseTokenURI = baseURI_;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        _requireOwned(tokenId);

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(
                    abi.encodePacked(baseURI, "/", Strings.toString(tokenId))
                )
                : "";
    }

    function mint(address recipient) public onlyOwner {
        require(_currentTokenId <= MAX_SUPPLY, "Max supply reached");

        _mint(recipient, _currentTokenId);

        emit NFTMinted(recipient, _currentTokenId);
        
        _currentTokenId++;
    }

    function currentTokenId() public view returns (uint256) {
        return _currentTokenId;
    }
}
