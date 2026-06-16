import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useSendCalls, useWaitForTransactionReceipt, useWaitForCallsStatus } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { readContractQueryOptions } from 'wagmi/query';
import { encodeFunctionData } from 'viem';
import { base } from 'wagmi/chains';
import { config } from '../lib/wagmi.config';
import { GAME_ABI, GAME_CONTRACT_ADDRESS, sendGMViaMcp, submitScoreViaMcp, sendGMAndScoreViaMcp } from '../lib/baseMcp';
import { useWalletCapabilities } from './useWalletCapabilities';

export function useGM(playerAddress?: string) {
  const { isConnected, address } = useAccount();
  const targetAddress = (playerAddress || address) as `0x${string}`;
  
  const { data: hash, writeContractAsync } = useWriteContract();
  const { data: callsId, sendCallsAsync } = useSendCalls();

  const { isLoading: isConfirmingTx, isSuccess: isSuccessTx } = useWaitForTransactionReceipt({ hash });
  const { isLoading: isConfirmingCalls, isSuccess: isSuccessCalls } = useWaitForCallsStatus({ id: callsId });
  
  const { supportsBatching } = useWalletCapabilities();
  const [isPendingReq, setIsPendingReq] = useState(false);
  const [approvalMcp, setApprovalMcp] = useState<{ approvalUrl: string; requestId: string } | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccessTx || isSuccessCalls) {
      if (targetAddress) {
        queryClient.invalidateQueries({
          queryKey: readContractQueryOptions(config, {
            address: GAME_CONTRACT_ADDRESS,
            abi: GAME_ABI,
            functionName: 'getGMCount',
            args: [targetAddress],
            chainId: base.id,
          }).queryKey,
        });
        queryClient.invalidateQueries({
          queryKey: readContractQueryOptions(config, {
            address: GAME_CONTRACT_ADDRESS,
            abi: GAME_ABI,
            functionName: 'getScore',
            args: [targetAddress],
            chainId: base.id,
          }).queryKey,
        });
      }
    }
  }, [isSuccessTx, isSuccessCalls, queryClient, targetAddress]);

  const sendGM = async () => {
    setIsPendingReq(true);
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
      setIsPendingReq(false);
    }
  };

  const submitScore = async (score: number) => {
    setIsPendingReq(true);
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
      setIsPendingReq(false);
    }
  };

  const sendGMAndScore = async (score: number) => {
    setIsPendingReq(true);
    try {
      if (isConnected) {
        if (supportsBatching) {
          // Wagmi: Batch transactions via EIP-5792
          const gmData = encodeFunctionData({ abi: GAME_ABI, functionName: 'gm' });
          const scoreData = encodeFunctionData({ abi: GAME_ABI, functionName: 'recordScore', args: [BigInt(score)] });
          await sendCallsAsync({
            calls: [
              { to: GAME_CONTRACT_ADDRESS, data: gmData },
              { to: GAME_CONTRACT_ADDRESS, data: scoreData }
            ],
            chainId: base.id
          });
        } else {
          // Wagmi: two separate calls - sequential fallback
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
        }
      } else {
        const result = await sendGMAndScoreViaMcp(score);
        setApprovalMcp(result);
        return result;
      }
    } finally {
      setIsPendingReq(false);
    }
  };

  // Helper method to clear approval state
  const clearApproval = () => setApprovalMcp(null);

  const isPending = isPendingReq || isConfirmingTx || isConfirmingCalls;

  return { sendGM, submitScore, sendGMAndScore, isPending, approvalMcp, clearApproval };
}
