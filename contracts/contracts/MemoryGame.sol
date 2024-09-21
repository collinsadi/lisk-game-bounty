// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MemoryGameRewards {
    using SafeERC20 for IERC20;
    address owner;

    IERC20 public liskToken;

    uint256 public constant REWARD_AMOUNT = 0.05 * 10 ** 18;
    uint256 public constant MAX_DAILY_CLAIMS = 3;
    uint256 public constant DAY_IN_SECONDS = 86400;

    struct ClaimInfo {
        uint256 lastClaimTimestamp;
        uint256 claimCount;
    }

    mapping(address => ClaimInfo) public userClaims;

    event RewardTokenSet(address indexed tokenAddress);
    event RewardClaimed(address indexed user, uint256 amount);
    event TokensDeposited(address indexed sender, uint256 amount);
    event TokensWithdrawn(address indexed receiver, uint256 amount);
    event DailyLimitUpdated(uint256 newLimit);
    event RewardAmountUpdated(uint256 newAmount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner");
        _;
    }

    function setRewardToken(address _token) external {
        require(_token != address(0), "Invalid token address");
        liskToken = IERC20(_token);
        emit RewardTokenSet(_token);
    }

    function claimReward() external {
        require(address(liskToken) != address(0), "Reward token not set");

        ClaimInfo storage claim = userClaims[msg.sender];
        uint256 currentTime = block.timestamp;

        if (currentTime >= claim.lastClaimTimestamp + DAY_IN_SECONDS) {
            claim.claimCount = 0;
            claim.lastClaimTimestamp = currentTime;
        }

        require(
            claim.claimCount < MAX_DAILY_CLAIMS,
            "Daily claim limit reached"
        );

        claim.claimCount += 1;
        liskToken.safeTransfer(msg.sender, REWARD_AMOUNT);

        emit RewardClaimed(msg.sender, REWARD_AMOUNT);
    }

    function depositTokens(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Must deposit a positive amount");
        require(address(liskToken) != address(0), "Reward token not set");

        liskToken.safeTransferFrom(msg.sender, address(this), _amount);

        emit TokensDeposited(msg.sender, _amount);
    }

    function withdrawTokens(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Must withdraw a positive amount");
        require(
            liskToken.balanceOf(address(this)) >= _amount,
            "Insufficient balance"
        );

        liskToken.safeTransfer(msg.sender, _amount);

        emit TokensWithdrawn(msg.sender, _amount);
    }

    function updateDailyLimit(uint256 _newLimit) external onlyOwner {
        require(_newLimit > 0, "Limit must be greater than zero");
        emit DailyLimitUpdated(_newLimit);
    }

    function updateRewardAmount(uint256 _newAmount) external onlyOwner {
        require(_newAmount > 0, "Reward amount must be positive");
        emit RewardAmountUpdated(_newAmount);
    }

    function getRemainingClaims(address _user) external view returns (uint256) {
        ClaimInfo storage claim = userClaims[_user];
        uint256 currentTime = block.timestamp;

        if (currentTime >= claim.lastClaimTimestamp + DAY_IN_SECONDS) {
            return MAX_DAILY_CLAIMS;
        } else {
            if (claim.claimCount >= MAX_DAILY_CLAIMS) {
                return 0;
            } else {
                return MAX_DAILY_CLAIMS - claim.claimCount;
            }
        }
    }
}