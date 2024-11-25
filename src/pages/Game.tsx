import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../components/PageLayout';
import DifficultySelector from '../components/game/DifficultySelector';
import QuestionCard from '../components/game/QuestionCard';
import ScorePopup from '../components/game/ScorePopup';
import ScoreMultiplier from '../components/game/ScoreMultiplier';
import { useToast } from '../hooks/useToast';
import { QUESTIONS_BY_DIFFICULTY } from '../data/questions';
import type { Question, Difficulty } from '../types';

type GameState = 'selecting' | 'playing' | 'finished';

const Game: React.FC = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [gameState, setGameState] = useState<GameState>('selecting');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastPoints, setLastPoints] = useState<{ points: number; isCorrect: boolean } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayStreak, setDisplayStreak] = useState(0);

  useEffect(() => {
    if (difficulty) {
      const difficultyQuestions = [...QUESTIONS_BY_DIFFICULTY[difficulty]];
      for (let i = difficultyQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [difficultyQuestions[i], difficultyQuestions[j]] = [difficultyQuestions[j], difficultyQuestions[i]];
      }
      setQuestions(difficultyQuestions.slice(0, 10));
    }
  }, [difficulty]);

  const handleDifficultySelect = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setGameState('playing');
    addToast(t('starting Game', { difficulty: selectedDifficulty }), 'info');
  };

  const calculatePoints = (isCorrect: boolean, currentStreak: number, basePoints: number) => {
    if (!isCorrect) return 0;
    
    const streakMultiplier = Math.floor(currentStreak / 3);
    const streakBonus = streakMultiplier > 0 ? streakMultiplier * 50 : 0;
    
    return basePoints + streakBonus;
  };

  const handleAnswer = async (answerIndex: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      const streakMultiplier = Math.floor(newStreak / 3);
      const streakBonus = streakMultiplier > 0 ? streakMultiplier * 50 : 0;
      const totalPoints = currentQuestion.points + streakBonus;
      
      setScore((prev) => prev + totalPoints);
      setLastPoints({ points: totalPoints, isCorrect: true });

      if (streakBonus > 0) {
        addToast(
          t('correctAnswerWithBonus', {
            points: totalPoints,
            base: currentQuestion.points,
            bonus: streakBonus
          }),
          'success'
        );
      } else {
        addToast(t('correctAnswer', { points: totalPoints }), 'success');
      }

      if (newStreak >= 3 && newStreak % 3 === 0) {
        addToast(
          t('streakMilestone', { 
            streak: newStreak,
            multiplier: streakMultiplier
          }),
          'info'
        );
      }
    } else {
      addToast(t('wrongAnswer'), 'error');
      
      setStreak(0);
      setLastPoints({ points: 0, isCorrect: false });
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastPoints(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setGameState('finished');
    }

    setIsTransitioning(false);
  };

  const handlePlayAgain = () => {
    setGameState('selecting');
    setScore(0);
    setStreak(0);
    setCurrentQuestionIndex(0);
    setLastPoints(null);
    setDifficulty(null);
    setQuestions([]);
    setIsTransitioning(false);
  };

  return (
    <PageLayout>
      <AnimatePresence mode="popLayout">
        {gameState === 'selecting' && (
          <motion.div
            key="difficulty-selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <DifficultySelector onSelect={handleDifficultySelect} />
          </motion.div>
        )}

        {gameState === 'playing' && questions[currentQuestionIndex] && (
          <motion.div
            key={`question-${currentQuestionIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="relative"
          >
            <QuestionCard
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              timeLimit={questions[currentQuestionIndex].timeLimit}
              disabled={isTransitioning}
            />
            
            <ScoreMultiplier streak={streak} />
            
            {lastPoints && (
              <ScorePopup
                score={lastPoints.points}
                isCorrect={lastPoints.isCorrect}
              />
            )}

            <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                {t('question')} {currentQuestionIndex + 1}/{questions.length}
              </p>
              <p>
                {t('score')}: {score} | {t('streak')}: {displayStreak}
              </p>
            </div>
          </motion.div>
        )}

        {gameState === 'finished' && (
          <motion.div
            key="game-over"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">{t('gameOver')}</h2>
            <p className="text-xl mb-8">
              {t('finalScore')}: {score}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayAgain}
              className="btn-primary"
            >
              {t('playAgain')}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default Game;