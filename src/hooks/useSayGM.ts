import { useState } from 'react';
import { useERC8021Transaction } from '../lib/erc8021/hooks/useERC8021Transaction';
import { parseAbi, encodeFunctionData } from 'viem';

const GM_CONTRACT = '0xBaF9ABFB60795C1827aeb23aE0a0Bf97211f40bC';

export function useSayGM() {
  const { sendTransactionAsync } = useERC8021Transaction();
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const sayGM = async () => {
    setIsPending(true);
    setTxHash(null);
    try {
      // Mock abi for sayGM or similar basic interaction
      const abi = parseAbi(['function sayGM() external']);
      const data = encodeFunctionData({ abi, functionName: 'sayGM' });
      
      const hash = await sendTransactionAsync({
        to: GM_CONTRACT as `0x${string}`,
        data,
      });
      setTxHash(hash);
      return hash;
    } catch (err) {
      console.error("GM on-chain transaction failed:", err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { sayGM, isPending, txHash };
}
