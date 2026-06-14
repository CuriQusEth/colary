import { useState } from 'react';
import { useAccount } from 'wagmi';
import { encodeFunctionData } from 'viem';
import { COLARY_ABI, COLARY_CONTRACT_ADDRESS } from '../lib/builderCode';
import { useERC8021Transaction } from '../lib/erc8021/hooks/useERC8021Transaction';

export function useRewards() {
  const { sendTransactionAsync } = useERC8021Transaction();
  const { isConnected } = useAccount();
  const [isClaiming, setIsClaiming] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const claimRewards = async (score: number) => {
    if (!isConnected) throw new Error("Wallet not connected");
    
    setIsClaiming(true);
    setTxHash(null);
    try {
      const mockSignature = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      
      const dataWithoutSuffix = encodeFunctionData({
        abi: COLARY_ABI,
        functionName: 'claimRewards',
        args: [BigInt(score), mockSignature as `0x${string}`]
      });

      const hash = await sendTransactionAsync({
        to: COLARY_CONTRACT_ADDRESS as `0x${string}`,
        data: dataWithoutSuffix,
      });

      setTxHash(hash);
      return hash;
    } catch (err: any) {
      if (!err?.message?.includes('User rejected') && !err?.message?.includes('denied transaction')) {
        console.error("Failed to claim rewards:", err);
      }
      throw err;
    } finally {
      setIsClaiming(false);
    }
  };

  return { claimRewards, isClaiming, txHash };
}
