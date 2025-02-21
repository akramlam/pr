import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ReadyButtonProps {
  isReady: boolean;
  onToggleReady: (ready: boolean) => void;
  disabled?: boolean;
}

const ReadyButton: React.FC<ReadyButtonProps> = ({
  isReady,
  onToggleReady,
  disabled = false
}) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={() => onToggleReady(!isReady)}
      disabled={disabled}
      className={`
        w-full py-3 px-6 rounded-xl font-medium
        flex items-center justify-center gap-2
        transition-colors
        ${
          isReady
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {isReady && <Check className="w-5 h-5" />}
      {isReady ? 'Ready' : 'Click when ready'}
    </motion.button>
  );
};

export default ReadyButton; 