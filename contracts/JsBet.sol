// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Jsbet is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    address public apeCoinToken;
    address public treasury;

    struct BetInfo {
        uint256 betId;
        address player;
        uint256 scheduleId;
        uint256 teamId;
        uint256 amount;
        uint256 timestamp;
        bool fulfill;
    }

    struct ScheduleInfo {
        uint256 scheduleId;
        bool status;
        uint256 teamAId;
        uint256 teamARate;
        uint256 teamBId;
        uint256 teamBRate;
        uint256 teamWin;
    }

    mapping (uint256 => BetInfo) public bets;
    mapping (uint256 => ScheduleInfo) public schedules;
    uint256[] betIds;
    uint256[] scheduleIds;

    address public receiver;
    uint256 public fee = 500;

    constructor(address initialOwner, address _apeCoinToken, address _treasury)
    Ownable(initialOwner)
    {
        apeCoinToken = _apeCoinToken;
        treasury = _treasury;
    }

    function createSchedule(
        uint256 _scheduleId,
        uint256 teamAId,
        uint256 teamARate,
        uint256 teamBId,
        uint256 teamBRate
    ) payable external {
        require(_scheduleId > 0, "Invalid Schedule ID");
        require(schedules[_scheduleId].scheduleId <= 0, "Schedule ID exists");
        require(teamAId > 0, "Invalid Team A");
        require(teamARate > 0, "Invalid Team A Rate");
        require(teamBId > 0, "Invalid Team B");
        require(teamBRate > 0, "Invalid Team B Rate");

        schedules[_scheduleId] = ScheduleInfo(
            _scheduleId,
            false,
            teamAId,
            teamARate,
            teamBId,
            teamBRate,
            0
        );
        scheduleIds.push(_scheduleId);
    }

    function openSchedule(uint256 _scheduleId) payable external onlyOwner {
        ScheduleInfo storage schedule = schedules[_scheduleId];
        schedule.status = true;
    }

    function closeSchedule(uint256 _scheduleId, uint256 _teamWin) payable external onlyOwner {
        ScheduleInfo storage schedule = schedules[_scheduleId];
        schedule.status = false;
        schedule.teamWin = _teamWin;
    }

    function createBet(uint256 _betId,uint256 _scheduleId, uint256 amount,uint256 _teamId) payable external {
        ScheduleInfo storage schedule = schedules[_scheduleId];
        require(schedule.status, "Schedule Closed");

        uint256 balance = IERC20(apeCoinToken).balanceOf(msg.sender);
        require(balance > 0, "Token amount must more than 0");
        require(balance >= amount, "Insufficient Token");

        bets[_betId] = BetInfo(
            _betId,
            msg.sender,
            schedule.scheduleId,
            _teamId,
            amount,
            block.timestamp,
            false
        );
        betIds.push(_betId);
        IERC20(apeCoinToken).transferFrom(msg.sender, treasury, amount * 1000000000000000000);
    }

    function collectPrize(uint256 _betId,uint256 _scheduleId) payable external {
        ScheduleInfo storage schedule = schedules[_scheduleId];
        require(!schedule.status, "Can't Collect With Status Open!");

        BetInfo storage bet = bets[_betId];
        require(msg.sender == bet.player, "bad player");
        require(!bet.fulfill, "Prize Collected");

        uint256 rate = 0;

        if(bet.teamId == schedule.teamAId){
            rate = schedule.teamARate;
        } else {
            rate = schedule.teamBRate;
        }

        if(bet.teamId == schedule.teamWin){
            uint256 prizeAmount = bet.amount.mul(rate).div(100);
            uint256 total = bet.amount.add(prizeAmount);
            IERC20(apeCoinToken).safeTransferFrom(treasury,bet.player, total * 1000000000000000000);
            bet.fulfill = true;
        } else {
            revert("your team select is lose");
        }
    }

    function getBetIds() public view returns (uint256[] memory) {
        return betIds;
    }

    function getScheduleIds() public view returns (uint256[] memory) {
        return scheduleIds;
    }

    receive() external payable {
        revert();
    }
}
