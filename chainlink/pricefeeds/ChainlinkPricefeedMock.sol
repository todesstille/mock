// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./interface/AggregatorV2V3Interface.sol";

contract ChainlinkPricefeedMock is AggregatorV2V3Interface {

    struct RoundInfo {
      uint80 roundId;
      int256 answer;
      uint256 startedAt;
      uint256 updatedAt;
      uint80 answeredInRound;
    }
    
    address private owner;
    uint8 private _decimals;
    string private _description;
    uint256 private _version;
    uint80 private _round;
    RoundInfo[] private _roundInfo;

    modifier onlyOwner {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }

    constructor (uint8 decimals_, string memory description_, uint256 version_, int256 price_) {
        owner = msg.sender;
        _decimals = decimals_;
        _description = description_;
        _version = version_;
        _updateOracle(price_);
    }

    function _updateOracle(int256 answer_) internal {
        _round += 1;
        RoundInfo memory newInfo;
        newInfo.roundId = _round;
        newInfo.answer = answer_;
        newInfo.startedAt = block.timestamp;
        newInfo.updatedAt = block.timestamp;
        newInfo.answeredInRound = _round;
        _roundInfo.push(newInfo);
    }

    function updateOracle(int256 answer_) external onlyOwner {
        _updateOracle(answer_);
    }

    function decimals() external view override returns (uint8){
        return _decimals;
    }

    function description() external view override returns (string memory) {
        return _description;
    }

    function version() external view override returns (uint256) {
        return _version;
    }

    function getRoundData(uint80 _roundId)
    public
    view
    override
    returns (
      uint80 roundId,
      int256 answer,
      uint256 startedAt,
      uint256 updatedAt,
      uint80 answeredInRound
    ) {
        require(_roundId > 0, "RoundId cant be zero");
        RoundInfo memory data = _roundInfo[_roundId - 1];
        return(data.roundId, data.answer, data.startedAt, data.updatedAt, data.answeredInRound);
    }

    function latestRoundData()
    public
    view
    override
    returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        RoundInfo memory data = _roundInfo[_roundInfo.length - 1];
        return(data.roundId, data.answer, data.startedAt, data.updatedAt, data.answeredInRound);
    }

    function latestAnswer() external view returns (int256) {
        (,int256 answer,,,) = latestRoundData();
        return answer;
    }

    function latestTimestamp() external view returns (uint256) {
        (,,,uint256 updatedAt,) = latestRoundData();
        return updatedAt;
    }

    function latestRound() external view returns (uint256){
        (uint80 roundId,,,,) = latestRoundData();
        return uint256(roundId);
    }

    function getAnswer(uint256 roundId) external view returns (int256) {
        (,int256 answer,,,) = getRoundData(uint80(roundId));
        return answer;
    }

    function getTimestamp(uint256 roundId) external view returns (uint256) {
        (,,,uint256 updatedAt,) = getRoundData(uint80(roundId));
        return updatedAt;
    }
}