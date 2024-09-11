// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract Auth is AccessControlUpgradeable {
    /*************
     * Constants *
     *************/
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant WHITELISTED_ROLE = keccak256("WHITELISTED_ROLE");

    address public owner;

    /*************
     * Modifiers *
     *************/

    modifier onlySuperOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    function initializeAuth(address superOwner) public initializer {
        __AccessControl_init();

        owner = superOwner;

        // admin
        _grantRole(DEFAULT_ADMIN_ROLE, superOwner);

        // minter
        _grantRole(MINTER_ROLE, superOwner);

        // burner
        _grantRole(BURNER_ROLE, superOwner);

        // whitelisted
        _grantRole(WHITELISTED_ROLE, superOwner);
    }

    /*****************************
     * Public Mutating Functions *
     *****************************/

    /**
     *  @notice Add whitelist
     *  @param account  Added address
     */
    function addWhitelisted(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(WHITELISTED_ROLE, account);
    }

    /**
     *  @notice Remove whitelist
     *  @param account  Removed address
     */
    function removeWhitelisted(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(WHITELISTED_ROLE, account);
    }

    /**
     *  @notice  Check whether the address is whitelisted
     *  @param account  address
     */
    function isWhitelisted(address account) public view returns (bool) {
        return hasRole(WHITELISTED_ROLE, account);
    }

    /**
     *  @notice dynamically add roles through multi-signature contract addresses
     *  @param role       role
     *  @param account    the address corresponding to the role
     */
    function addRole(bytes32 role, address account) external onlySuperOwner {
        _grantRole(role, account);
    }

    /**
     *  @notice cancel the authorization to assign a role to a certain address through the multi-signature contract address
     *  @param role       role
     *  @param account    deauthorized  address
     */
    function revokeRole(
        bytes32 role,
        address account
    ) public override onlySuperOwner {
        _revokeRole(role, account);
    }
}
