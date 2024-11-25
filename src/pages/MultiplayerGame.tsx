import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../components/PageLayout';
import WaitingRoom from '../components/game/WaitingRoom';
import QuestionCard from '../components/game/QuestionCard';
import ScorePopup from '../components/game/ScorePopup';
import ScoreMultiplier from '../components/game/ScoreMultiplier';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { createGameService } from '../services/GameService';
import type { GamePlayer, Question } from '../types';

type GameState = 'waiting' | 'playing' | 'finished';

const MultiplayerGame: React.FC = () => {
  const { t } = useTranslation();
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastPoints, setLastPoints] = useState<{ points: number; isCorrect: boolean } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!user) return;

    const gameService = createGameService(sessionId || '');
    const ws = gameService.connect();

    ws.on('GAME_STATE', (data) => {
      setPlayers(data.players);
      if (data.state === 'playing') {
        setQuestions(data.questions);
        setGameState('playing');
      } else if (data.state === 'finished') {
        setGameState('finished');
      }
    });

    ws.on('PLAYER_JOINED', (data) => {
      setPlayers(data.players);
      addToast(t('playerJoined', { name: data.player.name }), 'info');
    });

    ws.on('PLAYER_LEFT', (data) => {
      setPlayers(data.players);
      addToast(t('playerLeft', { name: data.player.name }), 'info');
    });

    ws.on('GAME_STARTED', () => {
      setGameState('playing');
      addToast(t('gameStarted'), 'info');
    });

    ws.on('GAME_ENDED', (data) => {
      setGameState('finished');
      const winner = data.players.reduce((prev: GamePlayer, current: GamePlayer) => 
        (prev.score > current.score) ? prev : current
      );
      addToast(t('gameWinner', { name: winner.name, score: winner.score }), 'success');
    });

    return () => {
      gameService.disconnect();
    };
  }, [user, sessionId, addToast, t]);

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
    } else {
      addToast(t('wrongAnswer'), 'error');
      setStreak(0);
      setLastPoints({ points: 0, isCorrect: false });
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastPoints(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }

    setIsTransitioning(false);
  };

  return (
    <PageLayout>
      <AnimatePresence mode="popLayout">
        {gameState === 'waiting' && (
          <WaitingRoom
            players={players}
            isHost={players[0]?.id === user?.id}
            onStart={() => {/* Implement start game */}}
            onReady={(ready) => {/* Implement ready state */}}
          />
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
                {t('score')}: {score} | {t('streak')}: {streak}
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
            {/* Add final scores and winner display */}
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default MultiplayerGame;