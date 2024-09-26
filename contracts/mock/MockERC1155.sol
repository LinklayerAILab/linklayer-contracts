// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameItems is ERC1155, Ownable {
    uint256 public constant SWORD = 0;
    uint256 public constant SHIELD = 1;
    uint256 public constant POTION = 2;
    uint256 public constant UNIQUE_HAMMER = 3;

    constructor() ERC1155("https://game.example/api/item/{id}.json")Ownable(msg.sender) {
        _mint(msg.sender, SWORD, 1000, "");
        _mint(msg.sender, SHIELD, 500, "");
        _mint(msg.sender, POTION, 10000, "");
        _mint(msg.sender, UNIQUE_HAMMER, 1, "");
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount
    ) public onlyOwner {
        _mint(account, id, amount, "");
    }

    function batchMint(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, "");
    }
}
