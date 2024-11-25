import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

interface ScoreMultiplierProps {
  streak: number;
}

const ScoreMultiplier: React.FC<ScoreMultiplierProps> = ({ streak }) => {
  const multiplier = Math.floor(streak / 3) + 1;
  const isActive = streak > 0;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 
            rounded-full bg-orange-100 dark:bg-orange-900/30 
            text-orange-600 dark:text-orange-400`}
        >
          <Flame className="w-4 h-4" />
          <span className="font-bold text-sm">
            {multiplier}x
          </span>
          <motion.div
            className="absolute inset-0 rounded-full bg-orange-500/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScoreMultiplier;