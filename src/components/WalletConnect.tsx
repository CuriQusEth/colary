import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { LogOut, Wallet } from 'lucide-react'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { connectors, connect, isPending, error } = useConnect()

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-2xl border-b-4 border-blue-800 active:translate-y-[2px] transition-all group"
        title="Disconnect"
      >
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse group-hover:bg-red-400"></span>
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    )
  }

  return (
    <div className="flex gap-2 relative">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2 rounded-2xl border-b-4 border-blue-800 active:translate-y-[2px] transition-all disabled:opacity-50"
        >
          <Wallet className="w-4 h-4" />
          {connector.name === 'Coinbase Wallet' ? 'Sign in with Base' : connector.name}
        </button>
      ))}
      {error && <div className="absolute top-full mt-2 text-xs text-red-500 font-bold bg-slate-900 absolute right-0 p-2 rounded">{error.message}</div>}
    </div>
  )
}
