// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "./Auth.sol";

contract LToken is ERC20Upgradeable, Auth {
    uint256 public constant MAX_SUPPLY = 100000000000 * 10 ** 18; // 100 billion

    /**********
     * Errors *
     **********/
    error InvalidZeroAddress();
    error InvalidErbAmt(uint256 erbAmt);
    error ExceedsMaxSupply(uint256 totalSupply, uint256 lAmt);
    error InsufficientERBBalance(address from, uint256 balance);

    /**********
     * Event *
     **********/
    /// @notice The user extracts L tokens and transfers an erb to the user,
    /// both of which are completed by the whitelist
    /// @param recipient Receive users of L and erb
    /// @param lAmt The quantity of L extracted by the user
    /// @param erbAmt Number of erbs gifted to users
    event Claim(address indexed recipient, uint256 lAmt, uint256 erbAmt);

    function initialize(address superOwner) public override initializer {
        super.initialize(superOwner); // Auth
        __ERC20_init("L", "L");
    }

    receive() external payable {}

    /********************
     ***** Modifiers ****
     ********************/
    modifier onlyWhitelisted() {
        require(
            hasRole(WHITELISTED_ROLE, msg.sender),
            "L: Caller is not whitelisted"
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

    /// @notice The user extracts L tokens and transfers an erb to the user,
    /// both of which are completed by the whitelist
    /// @param recipient The address of the account to mint tokens to
    /// @param _lAmt The amount of tokens to mint
    function claim(
        address payable recipient,
        uint256 _lAmt
    ) external payable onlyWhitelisted {
        if (msg.value < 0) {
            revert InvalidErbAmt(msg.value);
        }

        if (address(this).balance < msg.value) {
            revert InsufficientERBBalance(address(this), address(this).balance);
        }

        if (recipient == address(0)) {
            revert InvalidZeroAddress();
        }

        if (totalSupply() + _lAmt > MAX_SUPPLY) {
            revert ExceedsMaxSupply(totalSupply(), _lAmt);
        }

        _mint(recipient, _lAmt);

        recipient.transfer(msg.value);

        emit Claim(recipient, _lAmt, msg.value);
    }
}
