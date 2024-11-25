import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, Medal, RotateCcw, Home, Share2 } from 'lucide-react';
import type { GamePlayer } from '../../types';

interface MultiplayerGameOverProps {
  players: GamePlayer[];
  onPlayAgain: () => void;
}

const MultiplayerGameOver: React.FC<MultiplayerGameOverProps> = ({
  players,
  onPlayAgain,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  const handleShare = async () => {
    const text = t('shareMultiplayerScore', { 
      score: winner.score.toLocaleString(),
      name: winner.name,
      playerCount: players.length
    });
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SMARTER®',
          text,
          url: window.location.origin,
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      await navigator.clipboard.writeText(text);
      // You might want to show a toast notification here
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto bg-yellow-100 dark:bg-yellow-900/50 rounded-full 
            flex items-center justify-center mb-4">
            <Trophy className="h-12 w-12 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">{t('gameOver')}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t('winner')}: <span className="font-bold text-indigo-600">{winner.name}</span>
          </p>
        </div>

        {/* Player Rankings */}
        <div className="space-y-4 mb-8">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`relative p-4 rounded-lg transition-all
                ${index === 0 
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                  : 'bg-gray-50 dark:bg-gray-700/50'}`}
            >
              {/* Position Medal */}
              <div className="absolute -left-3 -top-3">
                {index === 0 ? (
                  <Medal className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                ) : index === 1 ? (
                  <Medal className="h-6 w-6 text-gray-400 fill-gray-400" />
                ) : index === 2 ? (
                  <Medal className="h-6 w-6 text-amber-600 fill-amber-600" />
                ) : null}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                  <div>
                    <div className="font-bold text-lg">{player.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t('maxStreak')}: {player.streak}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {player.score.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('points')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onPlayAgain}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white 
              px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 
              flex items-center justify-center space-x-2"
          >
            <RotateCcw className="h-5 w-5" />
            <span>{t('playAgain')}</span>
          </button>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 
                flex items-center justify-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>{t('backToHome')}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 
                flex items-center justify-center space-x-2"
            >
              <Share2 className="h-5 w-5" />
              <span>{t('share')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerGameOver; 