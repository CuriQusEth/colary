import React, { useState } from 'react';
import { Play, BrainCircuit, Activity, Lock, Award, Flame, ExternalLink, Loader2 } from 'lucide-react';
import { useERC8021Transaction } from '../../lib/erc8021/hooks/useERC8021Transaction';
import { encodeFunctionData, parseEther } from 'viem';

interface GameHubProps {
  onStartGame: (gameId: string) => void;
}

export function GameHub({ onStartGame }: GameHubProps) {
  const { sendTransactionAsync, isPending } = useERC8021Transaction();
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleMintAvatar = async () => {
    try {
      // Mock abi for minting
      const MINT_ABI = [{
        type: 'function',
        name: 'mint',
        inputs: [],
        outputs: [],
        stateMutability: 'payable',
      }] as const;

      // Mock contract address
      const NFT_CONTRACT = '0x0000000000000000000000000000000000000001';

      const data = encodeFunctionData({ abi: MINT_ABI, functionName: 'mint', args: [] });
      console.log('Minting with builder code enabled...');
      
      const hash = await sendTransactionAsync({
        to: NFT_CONTRACT,
        data,
        value: parseEther('0.001'), // 0.001 ETH price
      });
      setTxHash(hash);
    } catch (err: any) {
      if (!err?.message?.includes('User rejected') && !err?.message?.includes('denied transaction')) {
        console.error(err);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      {/* Sidebar Stats */}
      <div className="lg:col-span-4 space-y-4 flex flex-col">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-lg flex-1">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-6">Cognitive Profile</h3>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.5)]">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Global Score</p>
              <h3 className="text-3xl font-black tracking-tight text-white">1,240 <span className="text-sm font-mono text-blue-400">BP</span></h3>
            </div>
          </div>
          
          <div className="space-y-6">
            <StatBar label="Reflex" value={40} color="blue" />
            <StatBar label="Memory" value={70} color="pink" />
            <StatBar label="Focus" value={20} color="amber" />
            <StatBar label="Logic" value={40} color="emerald" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Streak</span>
              </div>
              <div className="font-bold text-lg text-white">5 Days</div>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tokens</span>
              </div>
              <div className="font-bold text-lg text-emerald-400">450 COL</div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-800">
            <button 
              onClick={handleMintAvatar}
              disabled={isPending}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors text-white border-b-4 border-blue-800 active:translate-y-[2px] disabled:opacity-50 shadow-lg shadow-blue-500/20"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Mint Brain Avatar (0.001 ETH)'}
            </button>
            {txHash && (
              <p className="text-xs text-emerald-400 mt-2 text-center flex items-center justify-center gap-1">
                Minted! <a href={`https://sepolia.basescan.org/tx/${txHash}`} target="_blank" rel="noreferrer" className="underline inline-flex items-center font-bold">View <ExternalLink className="w-3 h-3 ml-0.5" /></a>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Games List */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Active Hero Game */}
        <div className="bg-gradient-to-r from-blue-600/90 to-indigo-700/90 rounded-[2rem] p-8 relative overflow-hidden group border border-blue-400/30 shadow-2xl">
          <div className="absolute right-[-20px] bottom-[-20px] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-wider text-white">Daily Training Session</span>
              <div className="text-right">
                <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-1">Time Left</div>
                <div className="font-mono text-xl font-bold text-white">14:23:05</div>
              </div>
            </div>
            <h2 className="text-4xl font-black mb-2 text-white">SPEED<br/>TAP</h2>
            <p className="text-blue-100 max-w-[280px] text-sm mb-6 leading-relaxed">Test your visual agility. Tap the screen as quickly as it turns green.</p>
            <button 
              onClick={() => onStartGame('reaction')}
              className="bg-white text-blue-700 font-black px-8 py-3 rounded-2xl hover:scale-105 active:scale-95 transition-transform shadow-xl flex items-center gap-2"
            >
              <Play className="w-4 h-4" fill="currentColor" /> START TRAINING
            </button>
          </div>
          <div className="absolute top-8 right-8 hidden sm:block">
            <div className="w-32 h-32 border-4 border-white/20 rounded-full flex items-center justify-center border-dashed animate-spin-[20s]">
               <span className="text-xs font-mono font-bold text-white shadow-sm">+500 XP</span>
            </div>
          </div>
        </div>

        {/* Other Games */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          <GameCard 
            id="color-match"
            title="Stroop Effect"
            category="Focus"
            icon="🧠"
            customColor="pink"
            isCompleted={false}
            onStart={() => onStartGame('color-match')}
          />
          <GameCard 
            id="memory"
            title="Sequence Grid"
            category="Memory"
            icon="🔢"
            customColor="amber"
            isCompleted={true}
            onStart={() => onStartGame('memory')}
          />
          <GameCard 
            id="math"
            title="Quick Math"
            category="Logic"
            icon="⚡"
            customColor="emerald"
            locked={true}
            onStart={() => onStartGame('math')}
          />
        </div>
      </div>
    </div>
  );
}

function StatBar({ label, value, color }: { label: string, value: number, color: 'blue' | 'pink' | 'amber' | 'emerald' }) {
  const colorMap = {
    blue: { text: 'text-blue-300', bg: 'bg-blue-500', shadow: 'shadow-[0_0_12px_rgba(59,130,246,0.5)]' },
    pink: { text: 'text-pink-300', bg: 'bg-pink-500', shadow: 'shadow-[0_0_12px_rgba(236,72,153,0.5)]' },
    amber: { text: 'text-amber-300', bg: 'bg-amber-500', shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]' },
    emerald: { text: 'text-emerald-300', bg: 'bg-emerald-500', shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.5)]' }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold">
        <span className={`${colorMap[color].text} uppercase tracking-widest`}>{label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${colorMap[color].bg} rounded-full ${colorMap[color].shadow}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

interface GameCardProps {
  id: string;
  title: string;
  category: string;
  icon: string;
  customColor: 'blue' | 'pink' | 'amber' | 'emerald';
  isCompleted?: boolean;
  locked?: boolean;
  onStart: () => void;
}

function GameCard({ title, category, icon, customColor, isCompleted, locked, onStart }: GameCardProps) {
  const colorMap = {
    blue: 'bg-blue-500/20',
    pink: 'bg-pink-500/20',
    amber: 'bg-amber-500/20',
    emerald: 'bg-emerald-500/20'
  };

  return (
    <div 
      className={`bg-slate-900/60 border border-slate-800 rounded-3xl p-5 flex flex-col items-center justify-center gap-3 transition-colors group relative overflow-hidden ${
        locked ? 'opacity-50 cursor-not-allowed' : isCompleted ? 'border-emerald-500/30 bg-emerald-900/10' : 'hover:bg-slate-800/80 cursor-pointer'
      }`}
      onClick={!locked && !isCompleted ? onStart : undefined}
    >
      <div className={`w-14 h-14 ${colorMap[customColor]} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <span className="text-xs font-bold text-white uppercase tracking-tighter text-center">{title}</span>
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{category}</span>

      {locked && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center rounded-3xl">
          <Lock className="w-6 h-6 text-slate-400" />
        </div>
      )}

      {isCompleted && (
        <div className="absolute top-3 right-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </div>
      )}
    </div>
  );
}
