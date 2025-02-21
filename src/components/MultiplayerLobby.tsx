import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiplayerGame } from '../hooks/useMultiplayerGame';
import { GameLobby } from './GameLobby';

interface MultiplayerLobbyProps {
  sessionId: string;
}

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ sessionId }) => {
  const navigate = useNavigate();
  const { session, currentPlayer, isConnected, setReady, startGame } = useMultiplayerGame(sessionId);

  const handleStart = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleReady = useCallback((ready: boolean) => {
    setReady(ready);
  }, [setReady]);

  return (
    <GameLobby
      session={session}
      currentPlayer={currentPlayer}
      isConnected={isConnected}
      onReady={handleReady}
      onStart={handleStart}
    />
  );
}; 