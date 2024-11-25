import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, User, Zap } from 'lucide-react';
import type { GamePlayer } from '../../types';

interface PlayerListProps {
  players: GamePlayer[];
  currentPlayerId?: string;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, currentPlayerId }) => {
  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed right-4 top-24 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Players</h3>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {sortedPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`flex items-center justify-between p-3 rounded-lg
                ${player.id === currentPlayerId ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}
                ${player.isReady ? 'border-l-4 border-green-500' : ''}`}
            >
              <div className="flex items-center gap-2">
                {index === 0 && <Crown className="w-4 h-4 text-yellow-500" />}
                {player.isHost && <User className="w-4 h-4 text-indigo-500" />}
                <span className="font-medium text-gray-900 dark:text-white">
                  {player.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {player.score}
                </span>
                {player.streak >= 3 && (
                  <div className="relative">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span className="absolute -top-1 -right-1 text-xs font-bold">
                      {Math.floor(player.streak / 3)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlayerList; 