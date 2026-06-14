import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Wallet } from 'lucide-react';
import { ConnectModal } from './ConnectModal';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-2xl border-b-4 border-blue-800 active:translate-y-[2px] transition-all group"
      >
        {isConnected && address ? (
          <>
            <span className="w-2 h-2 bg-emerald-400 rounded-full group-hover:bg-red-400"></span>
            {address.slice(0, 6)}...{address.slice(-4)}
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            Connect
          </>
        )}
      </button>
      
      {showModal && <ConnectModal onClose={() => setShowModal(false)} />}
    </>
  );
}
