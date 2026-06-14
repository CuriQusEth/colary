import React, { useState } from "react";
import { pollStatus } from "../lib/baseMcp";

export function SaveScoreModal({
  approvalUrl,
  requestId,
  onClose,
  onSuccess,
}: {
  approvalUrl: string;
  requestId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [status, setStatus] = useState<"pending" | "polling" | "completed" | "failed">("pending");

  const handleConfirm = async () => {
    setStatus("polling");
    const result = await pollStatus(requestId);
    setStatus(result);
    if (result === "completed") {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold text-white mb-4">Approve Transaction</h2>
        
        {status === "pending" && (
          <div className="flex flex-col gap-4">
            <a
              href={approvalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-center"
            >
              Approve Transaction &rarr;
            </a>
            <button
              onClick={handleConfirm}
              className="text-slate-400 hover:text-white mt-2"
            >
              I have approved it
            </button>
          </div>
        )}

        {status === "polling" && (
          <div className="text-center text-slate-300 py-4">
            Verifying on-chain...
          </div>
        )}

        {status === "completed" && (
          <div className="text-center py-4 flex flex-col items-center">
            <span className="text-green-500 font-bold mb-2">Transaction Successful!</span>
            <button onClick={onClose} className="mt-4 bg-slate-800 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        )}

        {status === "failed" && (
          <div className="text-center py-4 flex flex-col items-center">
            <span className="text-red-500 font-bold mb-2">Transaction Failed</span>
            <button
              onClick={() => setStatus("pending")}
              className="mt-4 bg-slate-800 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        )}

        {(status === "pending" || status === "failed") && (
          <button
            onClick={onClose}
            className="w-full mt-4 py-2 text-slate-500 text-sm hover:text-slate-300"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
