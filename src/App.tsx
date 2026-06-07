import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { GameHub } from './components/game/GameHub';
import { SpeedTap } from './components/game/SpeedTap';
import { useSaveScore } from './hooks/useSaveScore';
import { useAccount, useSendTransaction } from 'wagmi';
import { stringToHex } from 'viem';
import { Sun } from 'lucide-react';

export default function App() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [score, setScore] = useState(2840); // Base mock score from UI
  const { saveScore } = useSaveScore();
  const [isSaving, setIsSaving] = useState(false);
  
  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const sendGMTransaction = () => {
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      data: stringToHex('gm'),
    });
  };

  const handleGameComplete = async (gameScore: number) => {
    const newScore = score + gameScore;
    setIsSaving(true);
    try {
      await saveScore(newScore);
      setScore(newScore);
    } catch (e) {
      console.error("Failed to sign score", e);
    } finally {
      setIsSaving(false);
      setActiveGame(null);
    }
  };

  return (
    <Layout>
      {isConnected && (
        <div className="flex justify-center mb-8">
          <button 
            onClick={sendGMTransaction}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
          >
            <Sun className="w-4 h-4" />
            Say GM
          </button>
        </div>
      )}

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
    </Layout>
  );
}

