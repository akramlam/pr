import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from './useToast';
import { createGameService, GameService } from '../services/GameService';
import { gameServiceManager } from '../services/GameServiceManager';
import type { GameSession, GamePlayer } from '../types';

export const useMultiplayerGame = (sessionId: string) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [session, setSession] = useState<GameSession | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<GamePlayer | null>(null);
  const mountedRef = useRef(false);
  const gameServiceRef = useRef<GameService | null>(null);
  const actualSessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionId || mountedRef.current) return;

    mountedRef.current = true;
    let isMounted = true;

    const handleConnect = () => {
      if (!isMounted) return;
      console.log('Connected to game session:', sessionId);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      if (!isMounted) return;
      console.log('Disconnected from game session');
      setIsConnected(false);
    };

    const handleError = (error: any) => {
      if (!isMounted) return;
      console.error('WebSocket error:', error);
      addToast(t('connectionError'), 'error');
    };

    const handleConnected = (data: any) => {
      if (!isMounted) return;
      console.log('Player connected:', data);
      if (data.playerId && !currentPlayer) {
        const newPlayer = {
          id: data.playerId,
          isHost: sessionId === 'new',
          ready: false,
          score: 0,
          name: `Player ${data.playerId.slice(0, 4)}`
        };
        setCurrentPlayer(newPlayer);
      }
    };

    const handleSessionUpdate = (data: any) => {
      if (!isMounted) return;
      console.log('Session update:', data);
      if (data.session) {
        setSession(data.session);
        gameServiceManager.setSession(data.session.id, data.session);
      }
    };

    const handleHostGameSuccess = (data: any) => {
      if (!isMounted) return;
      console.log('Host game success:', data);
      if (data.session) {
        setSession(data.session);
        gameServiceManager.setSession(data.session.id, data.session);
        actualSessionIdRef.current = data.sessionId;
      }
    };

    const setupGameService = () => {
      // Try to reuse existing game service
      const existingService = gameServiceManager.getService(sessionId);
      if (existingService) {
        console.log('Reusing existing game service for session:', sessionId);
        gameServiceRef.current = existingService;
      } else {
        console.log('Creating new game service for session:', sessionId);
        const gameService = createGameService(sessionId);
        gameServiceRef.current = gameService;
        if (sessionId !== 'new') {
          gameServiceManager.setService(sessionId, gameService);
        }
      }

      const gameService = gameServiceRef.current;
      if (!gameService) return;

      // Register event handlers
      gameService.on('connected', handleConnect);
      gameService.on('disconnected', handleDisconnect);
      gameService.on('error', handleError);
      gameService.on('CONNECTED', handleConnected);
      gameService.on('SESSION_UPDATE', handleSessionUpdate);
      gameService.on('HOST_GAME_SUCCESS', handleHostGameSuccess);

      // Connect to the game session if not already connected
      if (!gameService.isConnected) {
        gameService.connect();
      }
    };

    // Only set up the game service if we're not in a transition
    if (!gameServiceManager.isTransitioning(sessionId)) {
      setupGameService();
    }

    // Cleanup function
    return () => {
      isMounted = false;
      mountedRef.current = false;
      
      if (gameServiceRef.current) {
        const service = gameServiceRef.current;
        service.off('connected', handleConnect);
        service.off('disconnected', handleDisconnect);
        service.off('error', handleError);
        service.off('CONNECTED', handleConnected);
        service.off('SESSION_UPDATE', handleSessionUpdate);
        service.off('HOST_GAME_SUCCESS', handleHostGameSuccess);

        // Only clean up if we're not transitioning to a new session
        const isTransitioning = sessionId === 'new' && actualSessionIdRef.current;
        if (!isTransitioning) {
          console.log('Cleaning up game service for session:', sessionId);
          if (sessionId !== actualSessionIdRef.current) {
            gameServiceManager.cleanup(sessionId);
            gameServiceRef.current = null;
          }
        } else {
          console.log('Preserving game service for transition to:', actualSessionIdRef.current);
        }
      }
    };
  }, [sessionId, t, addToast, currentPlayer]);

  const setReady = (ready: boolean) => {
    if (!gameServiceRef.current) return;
    gameServiceRef.current.setReady(ready);
  };

  const startGame = () => {
    if (!gameServiceRef.current || !currentPlayer?.isHost) return;
    gameServiceRef.current.startGame();
  };

  const submitAnswer = (answerIndex: number) => {
    if (!gameServiceRef.current) return;
    gameServiceRef.current.submitAnswer(answerIndex);
  };

  return {
    session,
    isConnected,
    currentPlayer,
    setReady,
    startGame,
    submitAnswer
  };
};