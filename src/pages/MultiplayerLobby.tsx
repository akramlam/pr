import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, ArrowRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { useToast } from '../hooks/useToast';
import { createGameService } from '../services/GameService';
import { gameServiceManager } from '../services/GameServiceManager';
import type { GameService } from '../services/GameService';
import type { GameSession } from '../types';

interface HostGameSuccessResponse {
  sessionId: string;
  session: GameSession;
}

const MultiplayerLobby: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const gameServiceRef = useRef<GameService | null>(null);

  useEffect(() => {
    return () => {
      if (gameServiceRef.current) {
        gameServiceRef.current.disconnect();
        gameServiceRef.current = null;
      }
    };
  }, []);

  const handleHost = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Host button clicked');
      const gameService = createGameService('new');
      gameServiceRef.current = gameService;

      // Connect to Socket.io server
      console.log('Connecting to server...');
      await gameService.connect();

      // Create a promise that will resolve when we get HOST_GAME_SUCCESS
      const hostGamePromise = new Promise<HostGameSuccessResponse>((resolve, reject) => {
        const handleSuccess = (data: HostGameSuccessResponse) => {
          console.log('Received HOST_GAME_SUCCESS:', data);
          if (data.sessionId && data.session) {
            console.log('Host game success with session:', data.sessionId);
            resolve(data);
          } else {
            reject(new Error('Invalid server response'));
          }
        };

        const handleError = (error: any) => {
          console.error('Socket.io error:', error);
          reject(error);
        };

        // Register event handlers
        gameService.on('HOST_GAME_SUCCESS', handleSuccess);
        gameService.on('error', handleError);

        // Send HOST_GAME message
        console.log('Connected to server, sending HOST_GAME message');
        gameService.send('HOST_GAME');

        // Cleanup function
        return () => {
          gameService.off('HOST_GAME_SUCCESS', handleSuccess);
          gameService.off('error', handleError);
        };
      });

      // Wait for the HOST_GAME_SUCCESS response
      const data = await hostGamePromise;
      console.log('Host game promise resolved:', data);

      // Update game service manager and navigate
      gameServiceManager.startTransition('new', data.sessionId);
      gameServiceManager.setService(data.sessionId, gameService);
      gameServiceManager.setSession(data.sessionId, data.session);
      
      // Navigate after everything is set up
      console.log('All set up, navigating to game session:', data.sessionId);
      navigate(`/multiplayer/${data.sessionId}`, { replace: true });

      // End the transition after navigation
      gameServiceManager.endTransition('new');
      gameServiceManager.endTransition(data.sessionId);
      
    } catch (err) {
      console.error('Error in handleHost:', err);
      setError(err instanceof Error ? err.message : 'Failed to create game');
      if (gameServiceRef.current) {
        gameServiceRef.current.disconnect();
        gameServiceRef.current = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setError(t('enterValidCode'));
      return;
    }

    console.log('Joining game:', joinCode);
    navigate(`/multiplayer/${joinCode}`, { replace: true });
  };

  return (
    <PageLayout>
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r 
          from-indigo-600 to-indigo-800 dark:from-indigo-400 dark:to-indigo-600 
          bg-clip-text text-transparent">
          {t('multiplayerMode')}
        </h1>

        {/* Host Game Button */}
        <button
          onClick={handleHost}
          disabled={isLoading}
          className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-medium 
            py-4 px-6 rounded-xl mb-8 hover:bg-indigo-700 dark:hover:bg-indigo-600 
            transition-colors flex items-center justify-center gap-3
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Users className="h-5 w-5" />
          {isLoading ? t('creatingGame') : t('hostGame')}
        </button>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
              {t('or')}
            </span>
          </div>
        </div>

        {/* Join Game Form */}
        <form onSubmit={handleJoin} className="mt-8">
          <div className="mb-4">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder={t('enterGameCode')}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700
                border-2 border-transparent focus:border-indigo-500 
                dark:focus:border-indigo-400 focus:outline-none transition-colors
                text-gray-900 dark:text-gray-100 placeholder-gray-500
                dark:placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={!joinCode.trim()}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 
              dark:text-gray-100 font-medium py-4 px-6 rounded-xl
              hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-3"
          >
            <ArrowRight className="h-5 w-5" />
            {t('joinGame')}
          </button>
        </form>
      </div>
    </PageLayout>
  );
};

export default MultiplayerLobby; 