import { useEffect } from "react";
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { readContractQueryOptions } from "wagmi/query";
import { base } from "wagmi/chains";
import { config } from "../lib/wagmi.config";
import { SCOREBOARD_ADDRESS, SCOREBOARD_ABI } from "../contracts";

export function useSaveScore(playerAddress: `0x${string}`) {
  const { data: hash, writeContract, isPending: isWriting, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const queryClient = useQueryClient();

  const isPending = isWriting || isConfirming;

  const scoreQueryKey = readContractQueryOptions(config, {
    address: SCOREBOARD_ADDRESS,
    abi: SCOREBOARD_ABI,
    functionName: "getScore",
    args: [playerAddress],
    chainId: base.id,
  }).queryKey;

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: scoreQueryKey });
    }
  }, [isSuccess, queryClient, scoreQueryKey]);

  function saveScore(score: number) {
    writeContract({
      address: SCOREBOARD_ADDRESS,
      abi: SCOREBOARD_ABI,
      functionName: "recordScore",
      args: [BigInt(score)],
      chainId: base.id,
    });
  }

  const { data: onchainScore } = useReadContract({
    address: SCOREBOARD_ADDRESS,
    abi: SCOREBOARD_ABI,
    functionName: "getScore",
    args: [playerAddress],
    chainId: base.id,
  });

  return { saveScore, isPending, isSuccess, error, onchainScore };
}
