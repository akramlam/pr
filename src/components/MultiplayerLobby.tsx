import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiplayerGame } from '../hooks/useMultiplayerGame';
import { GameLobby } from './GameLobby';
import { useGameServiceManager } from '../hooks/useGameServiceManager';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthProvider';

interface MultiplayerLobbyProps {
  sessionId: string;
}

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ sessionId }) => {
  const navigate = useNavigate();
  const { session, currentPlayer, isConnected, setReady, startGame } = useMultiplayerGame(sessionId);
  const gameServiceManager = useGameServiceManager();
  const socketRef = React.useRef<Socket | null>(null);
  const { user } = useAuth();

  const handleStart = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleReady = useCallback((ready: boolean) => {
    setReady(ready);
  }, [setReady]);

  const handleHostGame = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const socket = io({
      transports: ['websocket'],
      auth: { token: user.token },
      extraHeaders: {
        Authorization: `Bearer ${user.token}`
      }
    });

    socket.on('connect', () => {
      socket.emit('HOST_GAME', (response) => {
        navigate(`/game/${response.sessionId}`, {
          state: { socket }
        });
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