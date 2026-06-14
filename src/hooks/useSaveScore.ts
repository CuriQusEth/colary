import { useWriteContract, useReadContract } from "wagmi";
import { SCOREBOARD_ADDRESS, SCOREBOARD_ABI } from "../contracts";

export function useSaveScore(playerAddress: `0x${string}`) {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  function saveScore(score: number) {
    writeContract({
      address: SCOREBOARD_ADDRESS,
      abi: SCOREBOARD_ABI,
      functionName: "recordScore",
      args: [BigInt(score)],
    });
  }

  const { data: onchainScore } = useReadContract({
    address: SCOREBOARD_ADDRESS,
    abi: SCOREBOARD_ABI,
    functionName: "getScore",
    args: [playerAddress],
  });

  return { saveScore, isPending, isSuccess, error, onchainScore };
}
