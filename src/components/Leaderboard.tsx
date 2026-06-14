import React from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';

export function Leaderboard() {
  const { players, scores, isLoading } = useLeaderboard();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-2xl font-black mb-4 text-white">Top Training Scores</h2>
      
      {isLoading ? (
        <div className="text-slate-400 py-4 text-center">Loading leaderboard...</div>
      ) : players.length === 0 ? (
        <div className="text-slate-500 py-4 text-center italic">No scores recorded yet.</div>
      ) : (
        <div className="space-y-3">
          {players.map((player, index) => (
            <div key={`${player}-${index}`} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-[#E8A020] font-bold w-6">{index + 1}.</span>
                <span className="text-slate-300 font-mono text-sm max-w-[120px] truncate">
                  {player.slice(0, 6)}...{player.slice(-4)}
                </span>
              </div>
              <span className="text-white font-bold">{scores[index]} pts</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
