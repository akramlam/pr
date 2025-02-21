import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, Edit, Camera, Medal, Star } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import usePlayerStats from '../hooks/usePlayerStats';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { stats } = usePlayerStats();

  const badges = [
    { id: 'newPlayer', icon: Star },
    { id: 'winner', icon: Medal },
    { id: 'streak', icon: Star },
    { id: 'expert', icon: Medal },
    { id: 'social', icon: User },
    { id: 'fast', icon: Star }
  ].filter(badge => stats.badges.includes(badge.id));

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            {/* Profile Header */}
            <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
              <button className="absolute bottom-2 right-2 p-2 rounded-full bg-white/20 hover:bg-white/30">
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="relative px-6 pb-6">
              <div className="flex items-end -mt-12 mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                    U
                  </div>
                  <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white dark:bg-gray-800 shadow-lg">
                    <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Username
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Joined 2023
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      {t('settings')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.gamesPlayed}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t('gamesPlayed')}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.gamesWon}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t('gamesWon')}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.winStreak}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t('winStreak')}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  {t('badges')}
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {badges.map(({ id, icon: Icon }) => (
                    <motion.div
                      key={id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <Icon className="w-6 h-6 mb-2 text-indigo-600 dark:text-indigo-400" />
                      <div className="text-xs text-center font-medium text-gray-900 dark:text-white">
                        {t(`badge${id}`)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfilePage; 