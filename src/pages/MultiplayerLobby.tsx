import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ArrowRight, Copy, Check, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../hooks/useToast';
import PageLayout from '../components/PageLayout';
import { createGameService } from '../services/GameService';

const MultiplayerLobby: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [joinCode, setJoinCode] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleHost = async () => {
    setIsLoading(true);
    setError('');
    try {
      const gameService = createGameService('');
      const ws = gameService.connect();
      const newSessionId = await gameService.hostGame();
      setSessionId(newSessionId);
      navigate(`/multiplayer/${newSessionId}`);
    } catch (err) {
      setError(t('hostError'));
      addToast(t('hostError'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setError(t('enterValidCode'));
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      navigate(`/multiplayer/${joinCode}`);
    } catch (err) {
      setError(t('joinError'));
      addToast(t('joinError'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!sessionId) return;
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast(t('codeCopied'), 'success');
    } catch (err) {
      addToast(t('copyError'), 'error');
    }
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
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleHost}
          disabled={isLoading}
          className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-medium 
            py-4 px-6 rounded-xl mb-8 hover:bg-indigo-700 dark:hover:bg-indigo-600 
            transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-3"
        >
          <Users className="h-5 w-5" />
          {t('hostGame')}
        </motion.button>

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

        {/* Join Form */}
        <form onSubmit={handleJoin} className="mt-8 space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 
                  rounded-xl text-red-600 dark:text-red-400"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder={t('enterGameCode')}
              className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                placeholder-gray-500 dark:placeholder-gray-400
                focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                focus:border-transparent outline-none"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!joinCode.trim() || isLoading}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 
              dark:text-gray-100 font-medium py-4 px-6 rounded-xl
              hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-3"
          >
            <ArrowRight className="h-5 w-5" />
            {isLoading ? t('joining') : t('joinGame')}
          </motion.button>
        </form>
      </div>
    </PageLayout>
  );
};

export default MultiplayerLobby; 