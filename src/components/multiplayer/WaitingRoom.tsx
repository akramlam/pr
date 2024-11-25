import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Play, Crown, CheckCircle } from 'lucide-react';
import type { GameSession, GamePlayer } from '../../types';

interface WaitingRoomProps {
  session: GameSession;
  players: GamePlayer[];
  isHost: boolean;
  onReady: () => void;
  onStart: () => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({
  session,
  players,
  isHost,
  onReady,
  onStart,
}) => {
  const { t } = useTranslation();
  const allPlayersReady = players.every((p) => p.isReady);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{session.name}</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t('waitingForPlayers')}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <img
                src={player.photoUrl || `https://api.dicebear.com/7.x/avatars/svg?seed=${player.id}`}
                alt={player.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{player.name}</span>
                  {player.isHost && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
              {player.isReady ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <div className="text-sm text-gray-500">{t('notReady')}</div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          {!isHost ? (
            <button
              onClick={onReady}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 
              rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 
              flex items-center gap-2"
            >
              <CheckCircle className="h-5 w-5" />
              {t('ready')}
            </button>
          ) : (
            <button
              onClick={onStart}
              disabled={!allPlayersReady}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2
              ${
                allPlayersReady
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Play className="h-5 w-5" />
              {t('startGame')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;