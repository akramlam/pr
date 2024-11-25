import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, RotateCcw, Home, Share2 } from 'lucide-react';

interface GameOverProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({
  score,
  correctAnswers,
  totalQuestions,
  onRestart
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const isWin = percentage >= 60; // Win if 60% or more correct

  const handleShare = async () => {
    const text = t('shareScore', { score: score.toLocaleString() });
    
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
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4
            ${isWin ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
            <Trophy className={`h-10 w-10 ${isWin ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {isWin ? t('victory') : t('gameOver')}
          </h2>
          <p className="text-2xl mb-4">
            {t('finalScore')}: <span className="font-bold text-indigo-600">{score.toLocaleString()}</span>
          </p>
          <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4">
            <p className="text-lg">
              {t('correctAnswers')}: <span className="font-bold">{correctAnswers}</span> / {totalQuestions}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {percentage}%
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onRestart}
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

export default GameOver;