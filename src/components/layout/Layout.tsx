import React from 'react';
import { WalletConnect } from '../WalletConnect';
import { Brain, Trophy, Activity, Zap, Loader2 } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ERC8021Demo } from '../../lib/erc8021/components/ERC8021Demo';
import { useSayGM } from '../../hooks/useSayGM';

function SayGMButton() {
  const { sayGM, isPending } = useSayGM();
  
  return (
    <button 
      onClick={sayGM} 
      disabled={isPending}
      className="flex px-3 py-2 md:px-4 bg-orange-500 hover:bg-orange-400 text-white font-black rounded-2xl border-b-4 border-orange-700 transition-all active:translate-y-[2px] disabled:opacity-50 items-center justify-center min-w-[100px] md:min-w-[120px] text-sm md:text-base"
    >
      {isPending ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : "GM! ☀️"}
    </button>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden flex flex-col font-sans selection:bg-blue-500/30">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative flex flex-col md:flex-row md:justify-between items-center gap-4 z-10 max-w-7xl mx-auto w-full px-4 pt-6 md:pt-8 pb-4">
        <div className="flex w-full md:w-auto justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-xl md:text-2xl font-bold italic tracking-tighter text-white">C</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase leading-tight">
                Colary <span className="text-blue-400">Brain</span>
              </h1>
              <p className="text-[10px] md:text-xs text-slate-400 font-mono">v2.0 // Orchestrator</p>
            </div>
          </div>
          
          <div className="md:hidden">
            <WalletConnect />
          </div>
        </div>
        
        <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-3 max-w-full overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {isConnected && <SayGMButton />}
          {isConnected && (
            <div className="flex flex-1 md:flex-none justify-between items-center gap-3 bg-slate-900/80 border border-slate-700/50 rounded-2xl px-3 py-2 backdrop-blur-md whitespace-nowrap">
              <div className="flex flex-col items-start md:items-end">
                <span className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-widest">Brain Score</span>
                <span className="text-sm md:text-lg font-mono text-blue-400 font-bold">2,840 BP</span>
              </div>
              <div className="w-[1px] h-6 md:h-8 bg-slate-700 mx-1 md:mx-0" />
              <div className="flex flex-col items-start md:items-end">
                <span className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-widest">Token</span>
                <span className="text-sm md:text-lg font-mono text-emerald-400 font-bold underline decoration-emerald-400/30">1,420 COLARY</span>
              </div>
            </div>
          )}

          <div className="hidden md:block">
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 pt-4 pb-12 relative z-10 flex flex-col">
        {!isConnected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 flex items-center justify-center mb-4 border border-blue-500/30">
              <Brain className="w-12 h-12 text-blue-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Earn Crypto While <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Train Your Brain</span>
            </h2>
            <p className="text-lg text-slate-400">
              Complete daily mini-games, improve your cognitive skills, and earn $COLARY tokens on Base.
            </p>
            <div className="mt-8">
              <ERC8021Demo />
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      {isConnected && (
        <footer className="relative z-10 flex justify-center pb-8">
          <nav className="flex gap-2 p-1 bg-slate-900/80 border border-slate-700/50 rounded-[1.5rem] backdrop-blur-xl">
            <NavItem label="Training" active />
            <NavItem label="Staking" />
            <NavItem label="NFT Frens" />
            <NavItem label="Quests" />
          </nav>
        </footer>
      )}
    </div>
  );
}

function NavItem({ label, active = false }: { label: string, active?: boolean }) {
  return (
    <button className={`px-6 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors ${
      active ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
    }`}>
      {label}
    </button>
  );
}

