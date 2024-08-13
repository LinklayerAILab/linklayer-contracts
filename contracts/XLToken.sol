import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
contract XLToken is ERC20Upgradeable, AccessControlUpgradeable {
    
    /*************
     * Constants *
     *************/
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant WHITELISTED_ROLE = keccak256("WHITELISTED_ROLE");

    /**********
     * Errors *
     **********/
    error InvalidZeroAddress();
    error InvalidErbAmt(uint256 erbAmt);
    error InsufficientXLBalance(address from, uint256 balance);
    error FailedTransferERB(address from, address to, uint256 erbAmt);

    /**********
     * Event *
     **********/
    /// @notice The user extracts XL tokens and transfers an erb to the user,
    /// both of which are completed by the whitelist
    /// @param recipient Receive users of XL and erb
    /// @param xlAmt The quantity of XL extracted by the user
    /// @param erbAmt Number of erbs gifted to users
    event Claim(address indexed recipient, uint256 xlAmt, uint256 erbAmt);

    function initialize() public initializer {
        __ERC20_init("XL", "XL");
        __AccessControl_init();

        grantRole(MINTER_ROLE, msg.sender);
        grantRole(BURNER_ROLE, msg.sender);
        grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        _mint(msg.sender, 1000000 * 10 ** uint256(decimals()));
    }

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

    function addWhitelisted(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(WHITELISTED_ROLE, account);
    }

    function removeWhitelisted(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(WHITELISTED_ROLE, account);
    }

    function isWhitelisted(address account) public view returns (bool) {
        return hasRole(WHITELISTED_ROLE, account);
    }

    /// @notice The user extracts XL tokens and transfers an erb to the user,
    /// both of which are completed by the whitelist
    /// @param recipient The address of the account to mint tokens to
    /// @param _xlAmt The amount of tokens to mint
    /// @param _erbAmt The amount of tokens to mint
    function claim(
        address payable recipient,
        uint256 _xlAmt,
        uint256 _erbAmt
    ) external onlyWhitelisted {
        if (_xlAmt > balanceOf(msg.sender)) {
            revert InsufficientXLBalance(msg.sender, balanceOf(msg.sender));
        }

        if (_erbAmt < 0) {
            revert InvalidErbAmt(_erbAmt);
        }

        if (recipient == address(0)) {
            revert InvalidZeroAddress();
        }

        _mint(recipient, _xlAmt);

        (bool success, ) = recipient.call{value: _erbAmt}("");
        if (!success) {
            revert FailedTransferERB(msg.sender, recipient, _erbAmt);
        }

        emit Claim(recipient, _xlAmt, _erbAmt);
    }
}
