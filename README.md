# Warp Racing Orchestrator

A high-performance Web3 gaming experience and AI-driven ecosystem built on **Base**. This project serves as an orchestration engine specialized in warp racing mechanics, real-time automation, competitive optimization, and multi-track management.

## Features

- **Warp Racing Mechanics**: Real-time racing logic with high-speed transaction capability.
- **Web3 Integration**: Secure login, SIWE (Sign-In With Ethereum), and Smart Wallet support powered by Coinbase Wallet & Wagmi.
- **On-chain Operations**: Leaderboards, state management, and competitive tracking seamlessly integrated on the Base blockchain.
- **AI Ecosystem Coordination**: Built-in ERC-8004 compatible Agent using the Model Context Protocol (MCP) to automate and optimize racing sessions.
- **Mobile First**: PWA-ready design offering a completely responsive UX across devices.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Web3**: Wagmi v2, Viem, Base Account
- **Agent Interoperability**: ERC-8004 compliant A2A metadata & full MCP (JSON-RPC 2.0) interface
- **Deployment**: Vercel & Node.js Serverless capabilities

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Agent Integration (EIP-8004 & MCP)

This project acts as an EIP-8004 orchestrator agent for warp racing ecosystem coordination. 

- **A2A Metadata**: Hosted at `/.well-known/agent-card.json`.
- **MCP Endpoint**: The Model Context Protocol (MCP) JSON-RPC 2.0 server runs at `/api/mcp`.

### Connecting via MCP
You can use the `/api/mcp` endpoint to communicate with the Agent via HTTP POST requests using the standard MCP JSON-RPC format. Available tools include:
- `get_race_status`: Returns the current warp race state.
- `start_race`: Initiates a new warp race session.
- `get_leaderboard`: Fetches competitive rankings.
- `optimize_speed`: Triggers in-race performance optimization.
- `get_track_info`: Returns track metadata for a given track ID.

*Note: There are no private keys, registries, or secret environments committed to this repository. Provide your own Base RPC and agent wallets via environment variables when hosting.*

## License

MIT
