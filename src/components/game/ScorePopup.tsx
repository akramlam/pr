import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface ScorePopupProps {
  score: number;
  isCorrect: boolean;
}

const ScorePopup: React.FC<ScorePopupProps> = ({ score, isCorrect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: -20, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`absolute top-0 left-1/2 transform -translate-x-1/2 
        flex items-center gap-2 px-4 py-2 rounded-full
        ${isCorrect 
          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
          : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
        }`}
    >
      {isCorrect ? (
        <>
          <CheckCircle className="w-5 h-5" />
          <span className="font-bold">+{score}</span>
        </>
      ) : (
        <>
          <XCircle className="w-5 h-5" />
          <span className="font-bold">0</span>
        </>
      )}
    </motion.div>
  );
};

export default ScorePopup; 