import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { createGameService } from '../services/GameService';
import type { GamePlayer, Question } from '../types';

interface UseMultiplayerGameProps {
  sessionId?: string;
}

export const useMultiplayerGame = ({ sessionId }: UseMultiplayerGameProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const handleGameStart = useCallback(() => {
    if (!isHost || !sessionId) return;
    const gameService = createGameService(sessionId);
    gameService.startGame();
  }, [isHost, sessionId]);

  const handleReady = useCallback((ready: boolean) => {
    if (!sessionId) return;
    const gameService = createGameService(sessionId);
    gameService.setReady(ready);
    setIsReady(ready);
  }, [sessionId]);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (!sessionId) return;
    const gameService = createGameService(sessionId);
    gameService.submitAnswer(answerIndex);
  }, [sessionId]);

  useEffect(() => {
    if (!user || !sessionId) return;

    const gameService = createGameService(sessionId);
    const ws = gameService.connect();

    ws.on('GAME_STATE', (data) => {
      setPlayers(data.players);
      const currentPlayer = data.players.find(p => p.id === user.id);
      setIsHost(currentPlayer?.isHost || false);
      setIsReady(currentPlayer?.isReady || false);

      if (data.state === 'playing') {
        setQuestions(data.questions);
        setGameState('playing');
      } else if (data.state === 'finished') {
        setGameState('finished');
      }
    });

    ws.on('PLAYER_JOINED', (data) => {
      setPlayers(data.players);
      addToast(data.message, 'info');
    });

    ws.on('PLAYER_LEFT', (data) => {
      setPlayers(data.players);
      addToast(data.message, 'info');
    });

    ws.on('GAME_STARTED', (data) => {
      setGameState('playing');
      setQuestions(data.questions);
      addToast('Game started!', 'success');
    });

    ws.on('ANSWER_RESULT', (data) => {
      if (data.playerId === user.id) {
        setScore(data.newScore);
        setStreak(data.newStreak);
        if (data.isCorrect) {
          addToast(`Correct! +${data.points} points`, 'success');
        } else {
          addToast('Wrong answer!', 'error');
        }
      }
    });

    ws.on('NEXT_QUESTION', (data) => {
      setCurrentQuestionIndex(data.questionIndex);
    });

    ws.on('GAME_OVER', (data) => {
      setGameState('finished');
      const winner = data.players.reduce((prev: GamePlayer, curr: GamePlayer) => 
        prev.score > curr.score ? prev : curr
      );
      addToast(`Game Over! ${winner.name} wins with ${winner.score} points!`, 'info');
    });

    // Join the session
    gameService.joinSession({
      id: user.id,
      name: user.name,
      photoUrl: user.photoUrl,
    });

    return () => {
      gameService.disconnect();
    };
  }, [user, sessionId, addToast]);

  return {
    players,
    questions,
    isHost,
    isReady,
    gameState,
    currentQuestionIndex,
    score,
    streak,
    handleGameStart,
    handleReady,
    handleAnswer,
  };
};