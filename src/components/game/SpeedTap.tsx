import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SpeedTapProps {
  onBack: () => void;
  onComplete: (score: number) => void;
}

type GameState = 'idle' | 'waiting' | 'ready' | 'finished' | 'too-early';

export function SpeedTap({ onBack, onComplete }: SpeedTapProps) {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const startTime = useRef<number>(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setGameState('waiting');
    setReactionTime(null);
    
    // Random wait between 2 to 6 seconds
    const waitTime = Math.random() * 4000 + 2000;
    
    timer.current = setTimeout(() => {
      setGameState('ready');
      startTime.current = Date.now();
    }, waitTime);
  };

  const handleTap = () => {
    if (gameState === 'waiting') {
      if (timer.current) clearTimeout(timer.current);
      setGameState('too-early');
    } else if (gameState === 'ready') {
      const time = Date.now() - startTime.current;
      setReactionTime(time);
      setGameState('finished');
    }
  };

  const handleFinish = () => {
    if (reactionTime) {
      // Base score 1000, drops off as time increases. Max score ~1000 for 150ms.
      const score = Math.max(0, 1000 - (reactionTime - 150) * 2);
      onComplete(Math.floor(score));
    }
  };

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-[600px] border border-slate-800 rounded-3xl overflow-hidden bg-slate-900/60 backdrop-blur-md relative shadow-2xl">
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="text-slate-400 text-xs font-bold tracking-widest uppercase">Speed Tap</div>
        <div className="w-9" /> {/* Spacer */}
      </div>

      <div 
        className={`flex-1 w-full h-full flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
          gameState === 'ready' ? 'bg-emerald-500' :
          gameState === 'waiting' ? 'bg-red-500' :
          gameState === 'too-early' ? 'bg-orange-500' :
          'bg-transparent'
        }`}
        onMouseDown={handleTap}
        onTouchStart={handleTap}
      >
        <AnimatePresence mode="wait">
          {gameState === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <Play className="w-10 h-10 text-blue-400 ml-1" fill="currentColor" />
              </div>
              <h2 className="text-4xl font-black mb-2 text-white">Reflex Test</h2>
              <p className="text-slate-400 mb-8 max-w-xs mx-auto">When the red screen turns green, tap as quickly as you can.</p>
              <button 
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-lg border-b-4 border-blue-800 transition-all active:translate-y-[2px]"
              >
                START GAME
              </button>
            </motion.div>
          )}

          {gameState === 'waiting' && (
            <motion.div 
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white"
            >
              <h2 className="text-5xl font-black mb-2 drop-shadow-md">Wait for green...</h2>
            </motion.div>
          )}

          {gameState === 'ready' && (
            <motion.div 
              key="ready"
              className="text-center text-white"
            >
              <h2 className="text-6xl font-black mb-2 drop-shadow-md">TAP!</h2>
            </motion.div>
          )}

          {gameState === 'too-early' && (
            <motion.div 
              key="too-early"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-white"
            >
              <h2 className="text-4xl font-black mb-4 drop-shadow-md">Too early!</h2>
              <button 
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full font-bold flex items-center gap-2 mx-auto transition-colors backdrop-blur-sm"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
            </motion.div>
          )}

          {gameState === 'finished' && (
            <motion.div 
              key="finished"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-[#020617] absolute inset-0 flex flex-col items-center justify-center z-20"
            >
              <div className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">Reaction Time</div>
              <div className="font-mono text-7xl font-bold text-white mb-2">{reactionTime}<span className="text-3xl text-slate-500 font-normal">ms</span></div>
              
              <div className="mt-12 flex gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); startGame(); }}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold flex items-center gap-2 transition-colors text-white"
                >
                  <RotateCcw className="w-4 h-4" /> Retry
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleFinish(); }}
                  className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-2xl font-black text-slate-900 border-b-4 border-emerald-700 active:translate-y-[2px] transition-all"
                >
                  Save Score
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
