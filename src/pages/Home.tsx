import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Play, Users, Trophy, Brain, Star, Zap } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageLayout className="text-center">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r 
            from-indigo-600 to-indigo-800 dark:from-indigo-400 dark:to-indigo-600 
            bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {t('welcome')}
        </motion.h1>

        <motion.p 
          className="text-xl text-gray-600 dark:text-gray-300 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Test your knowledge and compete with friends in real-time!
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Single Player Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link to="/game" className="card block">
              <Play className="w-12 h-12 mb-4 mx-auto text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-bold mb-2">{t('play')}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t('singlePlayerDescription')}
              </p>
              <div className="mt-4 flex justify-center space-x-2">
                <Brain className="w-5 h-5 text-indigo-500" />
                <Star className="w-5 h-5 text-yellow-500" />
                <Zap className="w-5 h-5 text-blue-500" />
              </div>
            </Link>
          </motion.div>

          {/* Multiplayer Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link to="/multiplayer" className="card block">
              <Users className="w-12 h-12 mb-4 mx-auto text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-bold mb-2">{t('multiplayerMode')}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t('multiplayerDescription')}
              </p>
              <div className="mt-4 flex justify-center">
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 
                  text-indigo-600 dark:text-indigo-400 rounded-full text-sm">
                  Live Matches
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Leaderboard Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link to="/leaderboard" className="card block">
              <Trophy className="w-12 h-12 mb-4 mx-auto text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-bold mb-2">{t('leaderboard')}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t('leaderboardDescription')}
              </p>
              <div className="mt-4 flex justify-center">
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 
                  text-yellow-600 dark:text-yellow-400 rounded-full text-sm">
                  Top Players
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;