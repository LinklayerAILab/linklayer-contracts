// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./Auth.sol";

contract XLToken is ERC20Upgradeable, Auth {
    using Math for uint256;

    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18;

    uint256 public constant THREE_YEARS = 3 * 365 days;
    uint256 public constant FIVE_YEARS = 5 * 365 days;
    uint256 public constant MONTH = 30 days;
    uint256 public constant QUARTER = 90 days;

    /******************
     * Assign address *
     *****************/
    address public taskIncentiveAddress; // 10% Task and Invitation Incentive Address
    address public ecosystemFundAddress; // 10% Ecosystem Fund Address
    address public strategicFinanceAddress; // 8% Strategic Financing Address
    address public teamAddress; // 5% team address
    address public marketingAddress; // 2% marketing address

    /********************
     * Supply Amounts ***
     ********************/
    uint256 public constant BONDING_SUPPLY = 650_000_000 * 10 ** 18; //65% released through claim
    uint256 public constant TASK_INCENTIVE_SUPPLY = 100_000_000 * 10 ** 18; // 10% pre allocation, fully unlocked
    uint256 public constant ECOSYSTEM_FUND_SUPPLY = 100_000_000 * 10 ** 18; // 10% linear release over 3 years
    uint256 public constant STRATEGIC_FINANCE_SUPPLY = 80_000_000 * 10 ** 18; // 8% linearly released over 3 years
    uint256 public constant TEAM_SUPPLY = 50_000_000 * 10 ** 18; //5% linear release over 5 years
    uint256 public constant MARKETING_SUPPLY = 20_000_000 * 10 ** 18; // 2% pre allocation, fully unlocked

    // Start time
    uint256 public ecosystemStartTime;
    uint256 public strategicFinanceStartTime;
    uint256 public teamStartTime;

    // Released amount
    uint256 public ecosystemReleased;
    uint256 public strategicFinanceReleased;
    uint256 public teamReleased;

    // Total claimed amount
    uint256 public totalClaimed;

    /**********
     * Errors *
     **********/
    error InvalidZeroAddress();
    error ExceedsClaimSupply(uint256 claimed, uint256 lAmt);
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

    function initialize(
        address _superOwner,
        address _taskIncentiveAddress,
        address _ecosystemFundAddress,
        address _strategicFinanceAddress,
        address _teamAddress,
        address _marketingAddress
    ) public initializer {
        super.initializeAuth(_superOwner); // Auth
        __ERC20_init("XL", "XL");
        taskIncentiveAddress = _taskIncentiveAddress;
        ecosystemFundAddress = _ecosystemFundAddress;
        strategicFinanceAddress = _strategicFinanceAddress;
        teamAddress = _teamAddress;
        marketingAddress = _marketingAddress;

        // pre allocated tokens
        _mint(taskIncentiveAddress, TASK_INCENTIVE_SUPPLY);
        _mint(marketingAddress, MARKETING_SUPPLY);

        ecosystemStartTime = block.timestamp;
        strategicFinanceStartTime = block.timestamp;
        teamStartTime = block.timestamp;
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
        if (address(this).balance < msg.value) {
            revert InsufficientERBBalance(address(this), address(this).balance);
        }

        if (recipient == address(0)) {
            revert InvalidZeroAddress();
        }

        if (totalClaimed + _xlAmt > BONDING_SUPPLY) {
            revert ExceedsClaimSupply(totalClaimed, _xlAmt);
        }

        // xl option
        totalClaimed += _xlAmt;
        _mint(recipient, _xlAmt);

        // erb option
        recipient.transfer(msg.value);

        emit Claim(recipient, _xlAmt, msg.value);
    }

    /// @notice Releases tokens to designated addresses based on a linear release schedule.
    /// @dev This function calculates the amount of tokens to be released for each category (ecosystem, strategic finance, and team)
    ///      and mints the corresponding tokens to the respective addresses.
    /// @dev Requires the caller to be the super owner.
    function releaseLinear() external onlySuperOwner {
        uint256 ecosystemToRelease = calculateLinearRelease(
            ECOSYSTEM_FUND_SUPPLY,
            THREE_YEARS,
            ecosystemStartTime,
            ecosystemReleased,
            MONTH
        );
        uint256 strategicToRelease = calculateLinearRelease(
            STRATEGIC_FINANCE_SUPPLY,
            THREE_YEARS,
            strategicFinanceStartTime,
            strategicFinanceReleased,
            MONTH
        );
        uint256 teamToRelease = calculateLinearRelease(
            TEAM_SUPPLY,
            FIVE_YEARS,
            teamStartTime,
            teamReleased,
            QUARTER
        );

        if (ecosystemToRelease > 0) {
            ecosystemReleased = ecosystemReleased + ecosystemToRelease;
            _mint(ecosystemFundAddress, ecosystemToRelease);
        }

        if (strategicToRelease > 0) {
            strategicFinanceReleased =
                strategicFinanceReleased +
                strategicToRelease;
            _mint(strategicFinanceAddress, strategicToRelease);
        }

        if (teamToRelease > 0) {
            teamReleased = teamReleased + teamToRelease;
            _mint(teamAddress, teamToRelease);
        }
    }

    /// @notice Calculates the amount of tokens to be released linearly over time.
    /// @param total The total amount of tokens to be released.
    /// @param duration The total duration of the release period.
    /// @param startTime The timestamp when the release starts.
    /// @param alreadyReleased The amount of tokens already released.
    /// @param releaseInterval The interval at which tokens are released (e.g., monthly, quarterly).
    /// @return The amount of tokens to be released in the current period.
    function calculateLinearRelease(
        uint256 total,
        uint256 duration,
        uint256 startTime,
        uint256 alreadyReleased,
        uint256 releaseInterval
    ) internal view returns (uint256) {
        if (block.timestamp <= startTime) return 0;
        uint256 elapsedTime = block.timestamp - startTime;

        uint256 totalPeriods = duration / releaseInterval;
        uint256 elapsedPeriods = elapsedTime / releaseInterval;

        uint256 totalToRelease = (total * elapsedPeriods) / totalPeriods;

        if (totalToRelease > total) {
            totalToRelease = total;
        }

        uint256 toRelease = totalToRelease - alreadyReleased;
        return toRelease;
    }

    function setAddresses(
        address _taskIncentiveAddress,
        address _ecosystemFundAddress,
        address _strategicFinanceAddress,
        address _teamAddress,
        address _marketingAddress
    ) external onlySuperOwner {
        taskIncentiveAddress = _taskIncentiveAddress;
        ecosystemFundAddress = _ecosystemFundAddress;
        strategicFinanceAddress = _strategicFinanceAddress;
        teamAddress = _teamAddress;
        marketingAddress = _marketingAddress;
    }
}
