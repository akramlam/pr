import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../contexts/PlayerContext';
import { questionService } from '../services/QuestionService';
import type { Question } from '../types';
import PageLayout from '../components/PageLayout';

interface GameSetup {
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timePerQuestion: number;
}

interface GameState {
  currentQuestion: Question | null;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  timeRemaining: number;
  streak: number;
  multiplier: number;
  isGameOver: boolean;
  correctAnswers: number;
  incorrectAnswers: number;
  selectedAnswer: number | null;
  isAnswerRevealed: boolean;
}

const SinglePlayerGame: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, updateProfile, updateStats } = usePlayer();
  const [isSetupScreen, setIsSetupScreen] = useState(true);
  const [setup, setSetup] = useState<GameSetup>({
    difficulty: profile?.preferences?.difficulty || 'medium',
    questionCount: profile?.preferences?.questionCount || 10,
    timePerQuestion: profile?.preferences?.timePerQuestion || 30
  });
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: null,
    questionNumber: 0,
    totalQuestions: 0,
    score: 0,
    timeRemaining: 0,
    streak: 0,
    multiplier: 1,
    isGameOver: false,
    correctAnswers: 0,
    incorrectAnswers: 0,
    selectedAnswer: null,
    isAnswerRevealed: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const startGame = async () => {
    setIsLoading(true);
    try {
      // Save preferences
      if (profile) {
        updateProfile({
          ...profile,
          preferences: {
            ...profile.preferences,
            difficulty: setup.difficulty,
            questionCount: setup.questionCount,
            timePerQuestion: setup.timePerQuestion
          }
        });
      }

      const loadedQuestions = await questionService.fetchQuestions({
        difficulty: setup.difficulty,
        count: setup.questionCount
      });

      if (loadedQuestions.length === 0) {
        throw new Error('No questions available for selected difficulty');
      }

      setQuestions(loadedQuestions);
      setGameState(prev => ({
        ...prev,
        currentQuestion: loadedQuestions[0],
        totalQuestions: loadedQuestions.length,
        timeRemaining: setup.timePerQuestion,
        questionNumber: 0
      }));
      setIsSetupScreen(false);
    } catch (error) {
      console.error('Failed to load questions:', error);
      // TODO: Show error message to user
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (gameState.currentQuestion && !gameState.isAnswerRevealed && !gameState.isGameOver) {
      const newTimer = setInterval(() => {
        setGameState(prev => {
          if (prev.timeRemaining <= 1) {
            clearInterval(newTimer);
            return {
              ...prev,
              timeRemaining: 0,
              isAnswerRevealed: true,
              incorrectAnswers: prev.incorrectAnswers + 1,
              streak: 0,
              multiplier: 1
            };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);

      setTimer(newTimer);
      return () => clearInterval(newTimer);
    }
  }, [gameState.currentQuestion, gameState.isAnswerRevealed]);

  const handleAnswer = (answerIndex: number) => {
    if (gameState.isAnswerRevealed || !gameState.currentQuestion) return;

    if (timer) clearInterval(timer);

    const isCorrect = answerIndex === gameState.currentQuestion.correctAnswer;
    const timeBonus = Math.max(0, Math.floor((gameState.timeRemaining / setup.timePerQuestion) * 50));
    const points = gameState.currentQuestion.points || 100;

    setGameState(prev => ({
      ...prev,
      selectedAnswer: answerIndex,
      isAnswerRevealed: true,
      score: isCorrect ? prev.score + (points + timeBonus) * prev.multiplier : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      multiplier: isCorrect ? Math.min(4, 1 + Math.floor(prev.streak / 3)) : 1,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      incorrectAnswers: isCorrect ? prev.incorrectAnswers : prev.incorrectAnswers + 1
    }));

    setTimeout(() => {
      if (gameState.questionNumber === gameState.totalQuestions - 1) {
        handleGameOver();
      } else {
        nextQuestion();
      }
    }, 2000);
  };

  const nextQuestion = () => {
    const nextQuestionIndex = gameState.questionNumber + 1;
    setGameState(prev => ({
      ...prev,
      currentQuestion: questions[nextQuestionIndex],
      questionNumber: nextQuestionIndex,
      timeRemaining: setup.timePerQuestion,
      selectedAnswer: null,
      isAnswerRevealed: false
    }));
  };

  const handleGameOver = () => {
    if (!profile) return;

    const finalStats = {
      gamesPlayed: profile.stats.gamesPlayed + 1,
      gamesWon: profile.stats.gamesWon + (gameState.correctAnswers > gameState.incorrectAnswers ? 1 : 0),
      totalScore: profile.stats.totalScore + gameState.score,
      highScore: Math.max(profile.stats.highScore || 0, gameState.score),
      totalCorrectAnswers: profile.stats.totalCorrectAnswers + gameState.correctAnswers,
      totalQuestions: profile.stats.totalQuestions + gameState.totalQuestions,
      bestStreak: Math.max(profile.stats.bestStreak || 0, gameState.streak)
    };

    updateStats(finalStats);
    setGameState(prev => ({ ...prev, isGameOver: true }));
  };

  const restartGame = () => {
    setIsSetupScreen(true);
    setGameState({
      currentQuestion: null,
      questionNumber: 0,
      totalQuestions: 0,
      score: 0,
      timeRemaining: 0,
      streak: 0,
      multiplier: 1,
      isGameOver: false,
      correctAnswers: 0,
      incorrectAnswers: 0,
      selectedAnswer: null,
      isAnswerRevealed: false
    });
    setQuestions([]);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="spinner" />
        </div>
      </PageLayout>
    );
  }

  if (isSetupScreen) {
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">
              {t('game.setup')}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('game.difficulty')}
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['easy', 'medium', 'hard'].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSetup(prev => ({ ...prev, difficulty: diff as 'easy' | 'medium' | 'hard' }))}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        setup.difficulty === diff
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                      }`}
                    >
                      {t(`game.${diff}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('game.questionCount')}
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {[5, 10, 15, 20].map((count) => (
                    <button
                      key={count}
                      onClick={() => setSetup(prev => ({ ...prev, questionCount: count }))}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        setup.questionCount === count
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('game.timePerQuestion')}
                </label>
                <div className="grid grid-cols-4 gap-4">
                  {[15, 30, 45, 60].map((time) => (
                    <button
                      key={time}
                      onClick={() => setSetup(prev => ({ ...prev, timePerQuestion: time }))}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        setup.timePerQuestion === time
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                      }`}
                    >
                      {time}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-4 mt-8">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {t('game.cancel')}
                </button>
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {t('game.start')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  if (gameState.isGameOver) {
    return (
      <PageLayout>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
          >
            <h2 className="text-3xl font-bold mb-6">
              {t('game.gameOver')}
            </h2>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                  {gameState.score}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('game.finalScore')}
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100)}%
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('game.accuracy')}
                </p>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={restartGame}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {t('game.playAgain')}
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {t('navigation.home')}
              </button>
            </div>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        {/* Game Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('game.question')} {gameState.questionNumber + 1}/{gameState.totalQuestions}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {gameState.score}
              </span>
              {gameState.multiplier > 1 && (
                <span className="text-sm px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full">
                  x{gameState.multiplier}
                </span>
              )}
            </div>
          </div>
          <div className="w-20 h-20 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={36 * 2 * Math.PI}
                strokeDashoffset={
                  36 * 2 * Math.PI *
                  (1 - gameState.timeRemaining / setup.timePerQuestion)
                }
                className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">
                {gameState.timeRemaining}
              </span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          {gameState.currentQuestion && (
            <motion.div
              key={gameState.currentQuestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8"
            >
              <h2 className="text-xl font-medium mb-6">
                {gameState.currentQuestion.text}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {gameState.currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(index)}
                    disabled={gameState.isAnswerRevealed}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all
                      ${gameState.isAnswerRevealed
                        ? index === gameState.currentQuestion?.correctAnswer
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : index === gameState.selectedAnswer
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-600 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                      }`}
                  >
                    <span className="inline-block w-8 h-8 rounded-full bg-gray-100 
                      dark:bg-gray-700 text-center leading-8 mr-3">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </motion.button>
                ))}
              </div>
              {gameState.isAnswerRevealed && gameState.currentQuestion.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {gameState.currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {t('game.quit')}
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default SinglePlayerGame; 