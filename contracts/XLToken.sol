// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "./Auth.sol";

contract XLToken is ERC20Upgradeable, Auth {
    /**********
     * Errors *
     **********/
    error InvalidZeroAddress();
    error InvalidErbAmt(uint256 erbAmt);
    error InsufficientXLBalance(address from, uint256 balance);
    error InsufficientERBBalance(address from, uint256 balance);

    /**********
     * Event *
     **********/
    /// @notice The user extracts XL tokens and transfers an erb to the user,
    /// both of which are completed by the whitelist
    /// @param recipient Receive users of XL and erb
    /// @param xlAmt The quantity of XL extracted by the user
    /// @param erbAmt Number of erbs gifted to users
    event Claim(address indexed recipient, uint256 xlAmt, uint256 erbAmt);

    function initialize(address superOwner) public override initializer {
        super.initialize(superOwner); // Auth
        __ERC20_init("XL", "XL");
        _mint(msg.sender, 1000000);
    }

    receive() external payable {}

    /********************
     ***** Modifiers ****
     ********************/
    modifier onlyWhitelisted() {
        require(
            hasRole(WHITELISTED_ROLE, msg.sender),
            "XL: Caller is not whitelisted"
        );
        _;
    }

    /*****************************
     * Public Mutating Functions *
     *****************************/

    /// @notice
    /// @param to The address of the account to mint tokens to
    /// @param amount The amount of tokens to mint
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    /// @notice
    /// @param from The address of the account to burn tokens from
    /// @param amount The amount of tokens to burn

    function burn(address from, uint256 amount) public onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }

    /// @notice The user extracts XL tokens and transfers an erb to the user,
    /// both of which are completed by the whitelist
    /// @param recipient The address of the account to mint tokens to
    /// @param _xlAmt The amount of tokens to mint
    function claim(
        address payable recipient,
        uint256 _xlAmt
    ) external payable onlyWhitelisted {
        if (_xlAmt > balanceOf(msg.sender)) {
            revert InsufficientXLBalance(msg.sender, balanceOf(msg.sender));
        }

        if (msg.value < 0) {
            revert InvalidErbAmt(msg.value);
        }

        if (address(this).balance < msg.value) {
            revert InsufficientERBBalance(address(this), address(this).balance);
        }

        if (recipient == address(0)) {
            revert InvalidZeroAddress();
        }

        _transfer(msg.sender, recipient, _xlAmt);

        recipient.transfer(msg.value);

        emit Claim(recipient, _xlAmt, msg.value);
    }

    /// @notice test upgrade
    function testUpgrade() public pure returns (uint256) {
        return 50;
    }
}
