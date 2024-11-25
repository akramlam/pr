import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GameStatusProps {
  currentQuestion: number;
  totalQuestions: number;
  timeLeft?: number;
  playerCount: number;
}

const GameStatus: React.FC<GameStatusProps> = ({
  currentQuestion,
  totalQuestions,
  timeLeft,
  playerCount,
}) => {
  const { t } = useTranslation();

  return (
    <div className="fixed left-4 top-24 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('question')} {currentQuestion + 1}/{totalQuestions}
          </span>
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {playerCount}
          </span>
        </div>
        {timeLeft !== undefined && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <motion.div 
              className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="h-full bg-indigo-600 dark:bg-indigo-500"
                initial={{ width: '100%' }}
                animate={{ width: `${(timeLeft / 30) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameStatus; 