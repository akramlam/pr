import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../hooks/useLocalStorage';

const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useLocalStorage('dark-mode', false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 
        hover:bg-gray-200 dark:hover:bg-gray-600 
        transition-colors duration-200"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
      ) : (
        <Sun className="w-5 h-5 text-gray-800 dark:text-gray-200" />
      )}
    </motion.button>
  );
};

export default DarkModeToggle; 