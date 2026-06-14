import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { GameHub } from './components/game/GameHub';
import { SpeedTap } from './components/game/SpeedTap';
import { useGM } from './hooks/useGM';
import { useScore } from './hooks/useScore';
import { Sun } from 'lucide-react';
import { McpApprovalModal } from './components/McpApprovalModal';

export default function App() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  
  // Use onchain hooks instead
  const { score, gmCount, refetch } = useScore();
  const { sendGM, sendGMAndScore, isPending, approvalMcp, clearApproval } = useGM();

  const handleGameComplete = async (gameScore: number) => {
    const newScore = score + gameScore;
    try {
      await sendGMAndScore(newScore);
      refetch(); // Only refetch if running without MCP, or just refetch anyways
    } catch (e: any) {
      if (!e?.message?.includes('User rejected') && !e?.message?.includes('denied transaction')) {
        console.error("Failed to sign score", e);
      }
    } finally {
      setActiveGame(null);
    }
  };

  const handleGMSync = async () => {
    try {
      await sendGM();
      refetch();
    } catch(e: any) {
      if (!e?.message?.includes('User rejected') && !e?.message?.includes('denied transaction')) {
        console.error("GM on-chain transaction failed:", e);
      }
    }
  }

  return (
    <Layout>
      <div className="flex justify-center mb-8 gap-4">
        <button 
          onClick={handleGMSync}
          disabled={isPending}
          className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold disabled:opacity-50"
        >
          <Sun className="w-4 h-4" />
          Say GM ({gmCount})
        </button>
      </div>

      {activeGame === null && (
        <GameHub onStartGame={setActiveGame} />
      )}
      
      {activeGame === 'reaction' && (
        <SpeedTap 
          onBack={() => setActiveGame(null)} 
          onComplete={handleGameComplete} 
        />
      )}
      
      {/* Mocking other games for now */}
      {(activeGame === 'color-match' || activeGame === 'memory' || activeGame === 'math') && (
        <div className="flex flex-col items-center justify-center h-[500px] border border-slate-800 rounded-[2rem] bg-slate-900/60 backdrop-blur-md shadow-2xl relative">
          <div className="absolute right-[-20%] top-[-20%] w-64 h-64 bg-pink-500/10 rounded-full blur-3xl mix-blend-screen" />
          <h2 className="text-4xl font-black mb-4 capitalize text-white drop-shadow-md z-10">{activeGame.replace('-', ' ')} Game</h2>
          <p className="text-slate-400 mb-8 z-10 text-center max-w-sm">This game is currently under development. Pick another module to continue training.</p>
          <button 
            onClick={() => setActiveGame(null)}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl border-b-4 border-slate-900 transition-all active:translate-y-[2px] z-10"
          >
            BACK TO HUB
          </button>
        </div>
      )}

      {approvalMcp && (
        <McpApprovalModal 
          approvalUrl={approvalMcp.approvalUrl}
          requestId={approvalMcp.requestId}
          onClose={clearApproval}
          onSuccess={() => { clearApproval(); refetch(); }}
        />
      )}
    </Layout>
  );
}

