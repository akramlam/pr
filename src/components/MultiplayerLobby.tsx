import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiplayerGame } from '../hooks/useMultiplayerGame';
import { GameLobby } from './GameLobby';
import { useGameServiceManager } from '../hooks/useGameServiceManager';
import { io, Socket } from 'socket.io-client';

interface MultiplayerLobbyProps {
  sessionId: string;
}

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ sessionId }) => {
  const navigate = useNavigate();
  const { session, currentPlayer, isConnected, setReady, startGame } = useMultiplayerGame(sessionId);
  const gameServiceManager = useGameServiceManager();
  const socketRef = React.useRef<Socket | null>(null);

  const handleStart = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleReady = useCallback((ready: boolean) => {
    setReady(ready);
  }, [setReady]);

  const handleHostGame = async () => {
    const socket = io({
      transports: ['websocket'],
      reconnection: false
    });

    socket.on('connect', () => {
      console.log('BASE CONNECTION ESTABLISHED');
      socket.emit('HOST_GAME', (response) => {
        console.log('RAW RESPONSE:', response);
      });
    });

    socket.on('TEST_EVENT', (data) => {
      console.log('TEST EVENT RECEIVED:', data);
    });

    socket.on('connect_error', (err) => {
      console.error('CONNECTION ERROR:', err.message);
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button 
        onClick={handleHostGame}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Host Game
      </button>
      <GameLobby
        session={session}
        currentPlayer={currentPlayer}
        isConnected={isConnected}
        onReady={handleReady}
        onStart={handleStart}
      />
    </div>
  );
}; 