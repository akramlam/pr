import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import type { Question } from '../../types';
import _ from 'underscore';

interface QuestionCardProps {
  question: Question;
  onAnswer: (index: number) => void;
  timeLimit: number;
  disabled?: boolean;
}

const QuestionCard = memo(({ 
  question, 
  onAnswer, 
  timeLimit,
  disabled = false 
}: QuestionCardProps) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (selectedAnswer === null) {
            onAnswer(-1); // Time's up, no answer selected
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onAnswer, selectedAnswer]);

  useEffect(() => {
    // Reset states when question changes
    setSelectedAnswer(null);
    setShowCorrect(false);
    setTimeLeft(timeLimit);
  }, [question, timeLimit]);

  const handleAnswerClick = (index: number) => {
    if (selectedAnswer !== null || disabled) return;
    
    setSelectedAnswer(index);
    setShowCorrect(true);
    onAnswer(index);
  };

  const getAnswerClassName = (index: number) => {
    if (!showCorrect) {
      return selectedAnswer === index 
        ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-500'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }

    if (index === question.correctAnswer) {
      return 'bg-green-100 dark:bg-green-900/30 border-green-500';
    }

    if (selectedAnswer === index && index !== question.correctAnswer) {
      return 'bg-red-100 dark:bg-red-900/30 border-red-500';
    }

    return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Timer */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Clock className="w-5 h-5" />
          <span>{timeLeft}s</span>
        </div>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {question.points} {t('points')}
        </span>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {question.text}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('category')}: {question.category}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="wait">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={selectedAnswer !== null || disabled}
              className={`p-4 rounded-xl text-left transition-all
                ${selectedAnswer === null && !disabled
                  ? 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20' 
                  : ''
                }
                ${getAnswerClassName(index)}
                border-2
              `}
              whileHover={selectedAnswer === null && !disabled ? { scale: 1.02 } : {}}
              whileTap={selectedAnswer === null && !disabled ? { scale: 0.98 } : {}}
            >
              <span className="font-medium">{option}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-indigo-600 dark:bg-indigo-500"
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / timeLimit) * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return _.isEqual(prevProps.question, nextProps.question);
});

export default QuestionCard;