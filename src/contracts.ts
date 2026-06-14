export const SCOREBOARD_ADDRESS = "0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3" as const;

export const SCOREBOARD_ABI = [
  {
    "type": "function",
    "name": "recordScore",
    "inputs": [{ "name": "score", "type": "uint256", "internalType": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getScore",
    "inputs": [{ "name": "player", "type": "address", "internalType": "address" }],
    "outputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "ScoreRecorded",
    "inputs": [
      { "name": "player", "type": "address", "indexed": true, "internalType": "address" },
      { "name": "score", "type": "uint256", "indexed": false, "internalType": "uint256" }
    ],
    "anonymous": false
  }
] as const;

export const GAME_CONTRACT_ADDRESS = "0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3" as const;

export const GAME_ABI = [
  {
    "inputs": [],
    "name": "gm",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_score", "type": "uint256" }
    ],
    "name": "recordScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_player", "type": "address" }
    ],
    "name": "getGMCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_player", "type": "address" }
    ],
    "name": "getScore",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_limit", "type": "uint256" }
    ],
    "name": "getTopPlayers",
    "outputs": [
      { "internalType": "address[]", "name": "", "type": "address[]" },
      { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

