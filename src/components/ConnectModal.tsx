import React from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';

interface ConnectModalProps {
  onClose: () => void;
}

export function ConnectModal({ onClose }: ConnectModalProps) {
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { isConnected, isReconnecting, address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          ✕
        </button>
        <h3 className="text-xl font-bold mb-6 text-white text-center">Connect Wallet</h3>
        
        {isReconnecting ? (
          <div className="text-center text-slate-400 py-4">Reconnecting...</div>
        ) : isConnected ? (
          <div className="space-y-4">
            <p className="text-center text-slate-300 break-all bg-slate-800 rounded p-2">
              {address}
            </p>
            <button 
              onClick={() => { disconnect(); onClose(); }}
              className="w-full py-3 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded-xl transition-colors font-bold"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => { connect({ connector }); onClose(); }}
                disabled={isConnecting}
                className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all flex items-center justify-between disabled:opacity-50"
              >
                <span className="font-medium capitalize">{connector.name}</span>
                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">Connect</span>
              </button>
            ))}
            
            <p className="text-xs text-slate-500 mt-4 text-center">
              By using the Base MCP, you agree to the Base Account and Base App Terms of Service. Plugins available in the Base repo are authored by Base, not by the third-party protocols they reference.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
