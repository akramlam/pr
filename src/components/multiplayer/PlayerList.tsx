import React from 'react';
import { Trophy, Zap } from 'lucide-react';
import type { GamePlayer } from '../../types';

interface PlayerListProps {
  players: GamePlayer[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players }) => {
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl p-4">
      <h3 className="text-lg font-semibold mb-4">Players</h3>
      <div className="space-y-4">
        {players
          .sort((a, b) => b.score - a.score)
          .map((player) => (
            <div
              key={player.id}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <img
                src={player.photoUrl || `https://api.dicebear.com/7.x/avatars/svg?seed=${player.id}`}
                alt={player.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{player.name}</span>
                  {player.isHost && (
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                {player.streak > 2 && (
                  <div className="flex items-center gap-1 text-sm text-orange-500">
                    <Zap className="h-3 w-3" />
                    <span>{player.streak}x</span>
                  </div>
                )}
              </div>
              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {player.score.toLocaleString()}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PlayerList;