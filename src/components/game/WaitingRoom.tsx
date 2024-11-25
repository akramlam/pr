import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, Crown } from 'lucide-react';
import type { GamePlayer } from '../../types';

interface WaitingRoomProps {
  players: GamePlayer[];
  isHost: boolean;
  onStart: () => void;
  onReady: (ready: boolean) => void;
  minPlayers?: number;
  maxPlayers?: number;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({
  players,
  isHost,
  onStart,
  onReady,
  minPlayers = 2,
  maxPlayers = 4
}) => {
  const { t } = useTranslation();
  const allPlayersReady = players.every(player => player.isReady);
  const canStart = players.length >= minPlayers && allPlayersReady;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('waitingForPlayers')}
        </h2>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Users className="w-5 h-5" />
          <span>{players.length}/{maxPlayers}</span>
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {players.map((player) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center justify-between p-4 rounded-xl
                ${player.isReady 
                  ? 'bg-green-50 dark:bg-green-900/20' 
                  : 'bg-gray-50 dark:bg-gray-800'}`}
            >
              <div className="flex items-center gap-3">
                {player.isHost && (
                  <Crown className="w-5 h-5 text-yellow-500" />
                )}
                <span className="font-medium text-gray-900 dark:text-white">
                  {player.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {player.isReady ? (
                  <span className="text-green-600 dark:text-green-400 text-sm">
                    {t('ready')}
                  </span>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {t('notReady')}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-4">
        {isHost ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStart()}
            disabled={!canStart}
            className="btn-primary flex items-center gap-2"
          >
            <Clock className="w-5 h-5" />
            {t('startGame')}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onReady(!players.find(p => p.isHost)?.isReady)}
            className="btn-primary flex items-center gap-2"
          >
            {players.find(p => p.isHost)?.isReady ? t('ready') : t('notReady')}
          </motion.button>
        )}
      </div>

      {!canStart && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {players.length < minPlayers
            ? t('needMorePlayers', { count: minPlayers - players.length })
            : !allPlayersReady
            ? t('waitingForReady')
            : ''}
        </p>
      )}
    </div>
  );
};

export default WaitingRoom; 