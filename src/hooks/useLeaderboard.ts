import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { GAME_ABI, GAME_CONTRACT_ADDRESS, submitMcpCall } from '../lib/baseMcp';
import { encodeFunctionData, decodeFunctionResult } from 'viem';

export function useLeaderboard(limit: number = 10) {
  const { isConnected } = useAccount();
  const [mcpPlayers, setMcpPlayers] = useState<string[]>([]);
  const [mcpScores, setMcpScores] = useState<number[]>([]);

  // Wagmi read
  const leaderboardRead = useReadContract({
    address: GAME_CONTRACT_ADDRESS as `0x${string}`,
    abi: GAME_ABI,
    functionName: 'getTopPlayers',
    args: [BigInt(limit)],
    query: { enabled: isConnected }
  });

  // MCP read fallback
  const fetchMcpData = async () => {
    if (!isConnected) {
      try {
        const data = encodeFunctionData({ abi: GAME_ABI, functionName: 'getTopPlayers', args: [BigInt(limit)] });
        const res = await submitMcpCall("chain_rpc_request", {
          method: "eth_call",
          params: [{ to: GAME_CONTRACT_ADDRESS, data }, "latest"],
          chain: "base"
        });
        if (res.result) {
          const decoded = decodeFunctionResult({
            abi: GAME_ABI,
            functionName: "getTopPlayers",
            data: res.result
          });
          setMcpPlayers(decoded[0] as `0x${string}`[]);
          setMcpScores((decoded[1] as bigint[]).map(Number));
        }
      } catch (err) {
        console.error("MCP leaderboard failed", err);
      }
    }
  };

  useEffect(() => {
    fetchMcpData();
  }, [isConnected, limit]);

  let players: string[] = [];
  let scores: number[] = [];

  if (isConnected && leaderboardRead.data) {
    players = leaderboardRead.data[0] as string[];
    scores = (leaderboardRead.data[1] as bigint[]).map(Number);
  } else {
    players = mcpPlayers;
    scores = mcpScores;
  }

  return { players, scores, refetch: isConnected ? leaderboardRead.refetch : fetchMcpData, isLoading: isConnected ? leaderboardRead.isLoading : false };
}
