import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { GAME_ABI, GAME_CONTRACT_ADDRESS, sendGMViaMcp, submitScoreViaMcp, sendGMAndScoreViaMcp } from '../lib/baseMcp';

export function useGM() {
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isPending, setIsPending] = useState(false);
  const [approvalMcp, setApprovalMcp] = useState<{ approvalUrl: string; requestId: string } | null>(null);

  const sendGM = async () => {
    setIsPending(true);
    try {
      if (isConnected) {
        await writeContractAsync({
          address: GAME_CONTRACT_ADDRESS as `0x${string}`,
          abi: GAME_ABI,
          functionName: 'gm',
        });
      } else {
        const result = await sendGMViaMcp();
        setApprovalMcp(result);
        return result;
      }
    } finally {
      setIsPending(false);
    }
  };

  const submitScore = async (score: number) => {
    setIsPending(true);
    try {
      if (isConnected) {
        await writeContractAsync({
          address: GAME_CONTRACT_ADDRESS as `0x${string}`,
          abi: GAME_ABI,
          functionName: 'recordScore',
          args: [BigInt(score)]
        });
      } else {
        const result = await submitScoreViaMcp(score);
        setApprovalMcp(result);
        return result;
      }
    } finally {
      setIsPending(false);
    }
  };

  const sendGMAndScore = async (score: number) => {
    setIsPending(true);
    try {
      if (isConnected) {
        // Wagmi: two separate calls
        await writeContractAsync({
          address: GAME_CONTRACT_ADDRESS as `0x${string}`,
          abi: GAME_ABI,
          functionName: 'gm',
        });
        await writeContractAsync({
          address: GAME_CONTRACT_ADDRESS as `0x${string}`,
          abi: GAME_ABI,
          functionName: 'recordScore',
          args: [BigInt(score)]
        });
      } else {
        const result = await sendGMAndScoreViaMcp(score);
        setApprovalMcp(result);
        return result;
      }
    } finally {
      setIsPending(false);
    }
  };

  // Helper method to clear approval state
  const clearApproval = () => setApprovalMcp(null);

  return { sendGM, submitScore, sendGMAndScore, isPending, approvalMcp, clearApproval };
}
