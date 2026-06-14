// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GMGame {
    uint256 public totalGMs;
    mapping(address => uint256) public gmCount;
    mapping(address => uint256) public scores;

    address[] public playersList;
    mapping(address => bool) private hasPlayed;

    event GM(address indexed player, uint256 count);
    event ScoreRecorded(address indexed player, uint256 score);

    function gm() external {
        if (!hasPlayed[msg.sender]) {
            playersList.push(msg.sender);
            hasPlayed[msg.sender] = true;
        }

        gmCount[msg.sender] += 1;
        totalGMs += 1;

        emit GM(msg.sender, gmCount[msg.sender]);
    }

    function recordScore(uint256 _score) external {
        if (!hasPlayed[msg.sender]) {
            playersList.push(msg.sender);
            hasPlayed[msg.sender] = true;
        }

        scores[msg.sender] = _score;
        emit ScoreRecorded(msg.sender, _score);
    }

    function getGMCount(address _player) external view returns (uint256) {
        return gmCount[_player];
    }

    function getScore(address _player) external view returns (uint256) {
        return scores[_player];
    }

    // A simple, unoptimized leaderboard function for simplicity.
    function getTopPlayers(uint256 _limit) external view returns (address[] memory, uint256[] memory) {
        uint256 count = playersList.length;
        if (_limit > count) {
            _limit = count;
        }

        address[] memory topPlayers = new address[](_limit);
        uint256[] memory topScores = new uint256[](_limit);

        // Simple bubble sort for demonstration purposes (do not use for huge arrays)
        address[] memory tempPlayers = playersList;
        for (uint i = 0; i < count; i++) {
            for (uint j = i + 1; j < count; j++) {
                if (scores[tempPlayers[i]] < scores[tempPlayers[j]]) {
                    address temp = tempPlayers[i];
                    tempPlayers[i] = tempPlayers[j];
                    tempPlayers[j] = temp;
                }
            }
        }

        for (uint i = 0; i < _limit; i++) {
            topPlayers[i] = tempPlayers[i];
            topScores[i] = scores[tempPlayers[i]];
        }

        return (topPlayers, topScores);
    }
}
