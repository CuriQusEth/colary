import React, { useState, useEffect } from 'react';
import { pollStatus } from '../lib/baseMcp';

interface McpApprovalModalProps {
  approvalUrl: string;
  requestId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function McpApprovalModal({ approvalUrl, requestId, onClose, onSuccess }: McpApprovalModalProps) {
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-white">Approve Transaction</h3>
        
        {status === "pending" && (
          <div className="space-y-4">
            <p className="text-slate-300 text-sm">
              Please click the link below to review and approve the transaction. Once approved return here and confirm.
            </p>
            <a 
              href={approvalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition-colors"
            >
              Approve Transaction →
            </a>
            <button 
              onClick={handleConfirm}
              className="w-full py-2 px-4 border border-blue-600 text-blue-500 hover:bg-blue-600/10 rounded-lg transition-colors"
            >
              I have approved it
            </button>
          </div>
        )}

        {status === "polling" && (
          <div className="text-center py-4">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-400">Verifying on-chain...</p>
          </div>
        )}

        {status === "completed" && (
          <div className="text-center py-4">
            <div className="text-green-500 text-4xl mb-4">✓</div>
            <p className="text-white font-bold mb-4">Transaction Successful!</p>
            <button 
              onClick={onClose}
              className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {status === "failed" && (
          <div className="text-center py-4">
            <div className="text-red-500 text-4xl mb-4">✕</div>
            <p className="text-white font-bold mb-4">Transaction Failed</p>
            <button 
              onClick={() => setStatus("pending")}
              className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {status === "pending" && (
          <button 
            onClick={onClose}
            className="w-full mt-2 py-2 px-4 text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
