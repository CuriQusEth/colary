import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useSaveScore } from "../hooks/useSaveScore";
import { saveScoreViaMcp, readScoreViaMcp } from "../lib/baseMcp";
import { SaveScoreModal } from "./SaveScoreModal";

export function SaveScoreButton({ score }: { score: number }) {
  const { isConnected, address } = useAccount();
  const { saveScore, isPending: wagmiPending, isSuccess: wagmiSuccess } = useSaveScore(address as `0x${string}`);
  const [mcpPending, setMcpPending] = useState(false);
  const [mcpSuccess, setMcpSuccess] = useState(false);
  const [approvalMcp, setApprovalMcp] = useState<{ approvalUrl: string; requestId: string } | null>(null);

  const isPending = wagmiPending || mcpPending;
  const isSuccess = wagmiSuccess || mcpSuccess;

  const handleSave = async () => {
    if (isConnected) {
      saveScore(score);
    } else {
      setMcpPending(true);
      try {
        const result = await saveScoreViaMcp(score);
        setApprovalMcp(result);
      } catch (err) {
        console.error(err);
      } finally {
        setMcpPending(false);
      }
    }
  };

  const handleMcpSuccess = async () => {
    setApprovalMcp(null);
    setMcpSuccess(true);
    // You can also use readScoreViaMcp to re-read the score here
  };

  return (
    <>
      <button
        onClick={handleSave}
        disabled={isPending || isSuccess}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50 transition-colors"
      >
        {isPending ? "Saving..." : isSuccess ? "Score saved onchain ✓" : "Save Score Onchain"}
      </button>

      {approvalMcp && (
        <SaveScoreModal
          approvalUrl={approvalMcp.approvalUrl}
          requestId={approvalMcp.requestId}
          onClose={() => setApprovalMcp(null)}
          onSuccess={handleMcpSuccess}
        />
      )}
    </>
  );
}
