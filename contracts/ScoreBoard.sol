// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ScoreBoard {
    mapping(address => uint256) public scores;
    event ScoreRecorded(address indexed player, uint256 score);

    function recordScore(uint256 score) external {
        scores[msg.sender] = score;
        emit ScoreRecorded(msg.sender, score);
    }

    function getScore(address player) external view returns (uint256) {
        return scores[player];
    }
}
