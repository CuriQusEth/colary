import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { GameHub } from './components/game/GameHub';
import { SpeedTap } from './components/game/SpeedTap';

export default function App() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [score, setScore] = useState(1240);

  const handleGameComplete = (gameScore: number) => {
    setScore(prev => prev + gameScore);
    setActiveGame(null);
    // In a real app, we would make a contract call here to save the score and get tokens
  };

  return (
    <Layout>
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
        <div className="flex flex-col items-center justify-center h-[500px] border border-white/10 rounded-3xl bg-white/5">
          <h2 className="text-3xl font-bold mb-4 capitalize">{activeGame.replace('-', ' ')} Game</h2>
          <p className="text-white/50 mb-8">This game is currently under development.</p>
          <button 
            onClick={() => setActiveGame(null)}
            className="px-6 py-2 bg-indigo-500 rounded-lg font-bold"
          >
            Back to Hub
          </button>
        </div>
      )}
    </Layout>
  );
}

