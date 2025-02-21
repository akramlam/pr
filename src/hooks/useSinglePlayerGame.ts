import { useState, useEffect, useCallback } from 'react';
import { SinglePlayerGameService, GameState, Question } from '../services/SinglePlayerGameService';

interface GameStats {
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageTime: number;
  totalQuestions: number;
}

export const useSinglePlayerGame = () => {
  const [gameService] = useState(() => new SinglePlayerGameService());
  const [gameState, setGameState] = useState<GameState>(gameService.getState());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleQuestionChange = ({ question, questionNumber, totalQuestions }: {
      question: Question;
      questionNumber: number;
      totalQuestions: number;
    }) => {
      setGameState(prev => ({
        ...prev,
        currentQuestion: question,
        questionNumber,
        totalQuestions
      }));
    };

    const handleTimerUpdate = (timeRemaining: number) => {
      setGameState(prev => ({ ...prev, timeRemaining }));
    };

    const handleAnswerSubmitted = (result: {
      isCorrect: boolean;
      correctAnswer: number;
      timeTaken: number;
      timeBonus: number;
      score: number;
      multiplier: number;
    }) => {
      setGameState(prev => ({
        ...prev,
        score: result.score,
        multiplier: result.multiplier
      }));
    };

    const handleGameOver = (stats: GameStats) => {
      setGameState(prev => ({
        ...prev,
        isGameOver: true,
        score: stats.score,
        correctAnswers: stats.correctAnswers,
        incorrectAnswers: stats.incorrectAnswers,
        averageTime: stats.averageTime
      }));
    };

    const handleError = (error: Error) => {
      setError(error.message);
      setIsLoading(false);
    };

    gameService.on('questionChanged', handleQuestionChange);
    gameService.on('timerUpdate', handleTimerUpdate);
    gameService.on('answerSubmitted', handleAnswerSubmitted);
    gameService.on('gameOver', handleGameOver);
    gameService.on('error', handleError);

    return () => {
      gameService.removeAllListeners();
    };
  }, [gameService]);

  const startGame = useCallback(async (difficulty: string = 'medium', questionsCount: number = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      await gameService.startGame(difficulty, questionsCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start game');
    } finally {
      setIsLoading(false);
    }
  }, [gameService]);

  const submitAnswer = useCallback((answerIndex: number) => {
    gameService.submitAnswer(answerIndex);
  }, [gameService]);

  const pauseGame = useCallback(() => {
    gameService.pauseGame();
  }, [gameService]);

  const resumeGame = useCallback(() => {
    gameService.resumeGame();
  }, [gameService]);

  return {
    gameState,
    isLoading,
    error,
    startGame,
    submitAnswer,
    pauseGame,
    resumeGame
  };
}; 