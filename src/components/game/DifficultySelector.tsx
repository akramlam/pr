import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Brain, Zap, Star } from 'lucide-react';

interface DifficultySelectorProps {
  onSelect: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelect }) => {
  const { t } = useTranslation();

  const difficulties = [
    {
      id: 'easy',
      title: t('easy'),
      description: t('easyDescription'),
      icon: Brain,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    {
      id: 'medium',
      title: t('medium'),
      description: t('mediumDescription'),
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
    },
    {
      id: 'hard',
      title: t('hard'),
      description: t('hardDescription'),
      icon: Zap,
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {difficulties.map(({ id, title, description, icon: Icon, color, bgColor, borderColor }) => (
        <motion.button
          key={id}
          onClick={() => onSelect(id as 'easy' | 'medium' | 'hard')}
          className={`p-6 rounded-xl border ${borderColor} ${bgColor} 
            transition-all duration-200 hover:scale-105`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className={`w-12 h-12 mx-auto mb-4 ${color}`} />
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </motion.button>
      ))}
    </div>
  );
};

export default DifficultySelector;