import React from 'react';
import { motion } from 'framer-motion';
import type { GamePlayer } from '../../types';

interface PlayerListProps {
  players: GamePlayer[];
  currentPlayerId?: string;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, currentPlayerId }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {players.map((player) => (
        <motion.div
          key={player.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-4 rounded-xl border-2 ${
            player.id === currentPlayerId
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {player.photoUrl && (
              <img
                src={player.photoUrl}
                alt={player.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <p className="font-medium">
                {player.name}
                {player.isHost && (
                  <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">
                    (Host)
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Score: {player.score}
              </p>
            </div>
            {player.isReady && (
              <span className="ml-auto text-green-600 dark:text-green-400 text-sm">
                Ready
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PlayerList; 