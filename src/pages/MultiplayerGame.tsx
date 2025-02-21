import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../components/PageLayout';
import QuestionCard from '../components/game/QuestionCard';
import PlayerList from '../components/game/PlayerList';
import ReadyButton from '../components/game/ReadyButton';
import { useMultiplayerGame } from '../hooks/useMultiplayerGame';
import { useToast } from '../hooks/useToast';
import { Socket } from 'socket.io-client';

const MultiplayerGame: React.FC = () => {
  const { t } = useTranslation();
  const { sessionId } = useParams();
  const location = useLocation();
  const { addToast } = useToast();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const {
    session,
    isConnected,
    currentPlayer,
    setReady,
    startGame,
    submitAnswer
  } = useMultiplayerGame(sessionId || '');

  const socket = (location.state as { socket: Socket })?.socket;

  useEffect(() => {
    if (!socket) return;

    socket.on('SESSION_UPDATE', (session) => {
      console.log('Session update:', session);
    });

    return () => {
      socket.off('SESSION_UPDATE');
    };
  }, [socket]);

  const handleAnswer = async (answerIndex: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    try {
      await submitAnswer(answerIndex);
    } catch (error) {
      addToast(t('answerError'), 'error');
    } finally {
      setIsTransitioning(false);
    }
  };

  return (
    <PageLayout>
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isConnected ? t('connected') : t('disconnected')}
          </span>
        </div>
        {session && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('players')}: {session.players.length}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {session && (
          <>
            <PlayerList 
              players={session.players}
              currentPlayerId={currentPlayer?.id}
            />
            {session.status === 'waiting' && (
              <ReadyButton
                isReady={currentPlayer?.isReady || false}
                onToggleReady={setReady}
                disabled={!isConnected}
              />
            )}
            {session.status === 'active' && session.currentQuestion !== undefined && (
              <motion.div
                key={`question-${session.currentQuestion}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="relative"
              >
                <QuestionCard
                  question={session.questions[session.currentQuestion]}
                  onAnswer={handleAnswer}
                  timeLimit={session.timeLimit}
                  disabled={isTransitioning}
                />
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default MultiplayerGame;