import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { GAME_ABI, GAME_CONTRACT_ADDRESS, readGMCountViaMcp, readScoreViaMcp } from '../lib/baseMcp';

export function useScore(playerAddress?: string) {
  const { isConnected, address } = useAccount();
  const targetAddress = playerAddress || address;
  const [mcpGMCount, setMcpGMCount] = useState<number>(0);
  const [mcpScore, setMcpScore] = useState<number>(0);

  // Wagmi reads
  const gmCountRead = useReadContract({
    address: GAME_CONTRACT_ADDRESS as `0x${string}`,
    abi: GAME_ABI,
    functionName: 'getGMCount',
    args: targetAddress ? [targetAddress as `0x${string}`] : undefined,
    query: { enabled: isConnected && !!targetAddress }
  });

  const scoreRead = useReadContract({
    address: GAME_CONTRACT_ADDRESS as `0x${string}`,
    abi: GAME_ABI,
    functionName: 'getScore',
    args: targetAddress ? [targetAddress as `0x${string}`] : undefined,
    query: { enabled: isConnected && !!targetAddress }
  });

  // MCP fallback reads
  const fetchMcpData = async () => {
    if (!isConnected && targetAddress) {
      try {
        const gmRes = await readGMCountViaMcp(targetAddress);
        if (gmRes) setMcpGMCount(parseInt(gmRes, 16));
        const scoreRes = await readScoreViaMcp(targetAddress);
        if (scoreRes) setMcpScore(parseInt(scoreRes, 16));
      } catch (err) {
        console.error("MCP read failed", err);
      }
    }
  };

  useEffect(() => {
    fetchMcpData();
  }, [isConnected, targetAddress]);

  const gmCount = isConnected ? Number(gmCountRead.data || 0) : mcpGMCount;
  const score = isConnected ? Number(scoreRead.data || 0) : mcpScore;

  return { gmCount, score, refetch: isConnected ? () => { gmCountRead.refetch(); scoreRead.refetch(); } : fetchMcpData };
}
