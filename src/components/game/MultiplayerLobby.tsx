import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Users, Copy, Check, AlertCircle } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

interface MultiplayerLobbyProps {
  sessionId: string;
  onJoin: (code: string) => Promise<void>;
  onHost: () => Promise<void>;
}

const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ sessionId, onJoin, onHost }) => {
  const { t } = useTranslation();
  const { play } = useSound();
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      play('click');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError(String(t('copyError')));
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (!joinCode.trim()) {
        throw new Error(String(t('enterValidCode')));
      }
      play('click');
      await onJoin(joinCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(t('joinError')));
    } finally {
      setIsLoading(false);
    }
  };

  const handleHost = async () => {
    setIsLoading(true);
    try {
      play('click');
      await onHost();
    } catch (err) {
      setError(String(t('hostError')));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        {t('multiplayerLobby')}
      </h2>

      {/* Host Game Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleHost}
        disabled={isLoading}
        className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-medium 
          py-4 px-6 rounded-xl mb-4 hover:bg-indigo-700 dark:hover:bg-indigo-600 
          transition-colors disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-3"
      >
        <Users className="h-5 w-5" />
        {t('hostGame')}
      </motion.button>

      {/* Session ID Display */}
      {sessionId && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {t('shareCode')}
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-lg font-bold text-indigo-600 
              dark:text-indigo-400 break-all"
            >
              {sessionId}
            </code>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {copied ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5 text-gray-500" />
              )}
            </motion.button>
          </div>
        </div>
      )}

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl 
              flex items-center gap-2 text-red-600 dark:text-red-400"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Join Form */}
      <form onSubmit={handleJoin} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder={String(t('enterGameCode'))}
            className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
              focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
              focus:border-transparent outline-none"
          />
        </div>
        <motion.button
          type="submit"
          disabled={!joinCode.trim() || isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
    </motion.div>
  );
};

export default MultiplayerLobby; 