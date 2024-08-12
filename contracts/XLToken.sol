import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
contract XLToken is ERC20Upgradeable, AccessControlUpgradeable {
    address public owner;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    // TODO 白名单策略（考虑小李）

    /**********
     * Errors *
     **********/

    error InvalidZeroAddress();
    error InvalidErbAmt(uint256 erbAmt);
    error InsufficientXLBalance(address owner, uint256 balance);

    /**********
     * Event *
     **********/

    /// @notice The user extracts XL tokens and transfers an erb to the user,
    /// both of which are completed by the whitelist
    /// @param recipient Receive users of XL and erb
    /// @param xlAmt The quantity of XL extracted by the user
    /// @param erbAmt Number of erbs gifted to users
    event Claim(address indexed recipient, uint256 xlAmt, uint256 erbAmt);

    constructor() {
        __ERC20_init("XL", "XL");
        __AccessControl_init();
        owner = msg.sender;
        grantRole(MINTER_ROLE, msg.sender);
        _mint(msg.sender, 1000000 * 10 ** uint256(decimals()));
    }

    /// @notice Modifier to check if the caller is the owner
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "XL: Only the owner can call this function"
        );
        _;
    }

    /*****************************
     * Public Mutating Functions *
     *****************************/

    /// @notice
    /// @param to The address of the account to mint tokens to
    /// @param amount The amount of tokens to mint
    function mint(
        address to,
        uint256 amount
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _mint(to, amount);
    }

    /// @notice
    /// @param from The address of the account to burn tokens from
    /// @param amount The amount of tokens to burn

    function burn(
        address from,
        uint256 amount
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _burn(from, amount);
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
    ) external onlyOwner {
        if (_xlAmt < balanceOf(owner)) {
            revert InsufficientXLBalance(owner, balanceOf(owner));
        }

        if (_erbAmt < 0) {
            revert InvalidErbAmt(_erbAmt);
        }

        if (recipient == address(0)) {
            revert InvalidZeroAddress();
        }

        _mint(recipient, _xlAmt);
        recipient.transfer(_erbAmt);

        emit Claim(recipient, _xlAmt, _erbAmt);
    }
}
