import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Crown, Medal, Star, Shield, Users2, RefreshCw, UserPlus, Play, Eye } from 'lucide-react';
import PageLayout from '../components/PageLayout';

const LeaderboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [leaderboardType, setLeaderboardType] = useState<'global' | 'regional' | 'friends'>('global');
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');

  // Simulated leaderboard data
  const leaderboardData = Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    playerId: `player${i}`,
    name: `Player ${i + 1}`,
    score: Math.floor(Math.random() * 5000),
    winRate: Math.floor(Math.random() * 100),
    gamesPlayed: Math.floor(Math.random() * 1000),
    peakRating: Math.floor(Math.random() * 2000),
    lastPlayed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    isOnline: Math.random() > 0.5,
    isFriend: Math.random() > 0.8
  }));

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('leaderboard.title')}
          </h1>
        </motion.div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex rounded-lg overflow-hidden">
            {(['global', 'regional', 'friends'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setLeaderboardType(type)}
                className={`px-4 py-2 ${
                  leaderboardType === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {t(`leaderboard.${type}`)}
              </button>
            ))}
          </div>

          <div className="flex rounded-lg overflow-hidden">
            {(['weekly', 'monthly', 'allTime'] as const).map((time) => (
              <button
                key={time}
                onClick={() => setTimeFrame(time)}
                className={`px-4 py-2 ${
                  timeFrame === time
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {t(`leaderboard.${time}`)}
              </button>
            ))}
          </div>

          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title={t('leaderboard.refresh')}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('leaderboard.rank')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('leaderboard.player')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('leaderboard.score')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('leaderboard.winRate')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('leaderboard.gamesPlayed')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('leaderboard.lastPlayed')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('leaderboard.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboardData.map((player) => (
                  <motion.tr
                    key={player.playerId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {player.rank <= 3 ? (
                          <div className={`p-1 rounded-full ${
                            player.rank === 1 ? 'bg-yellow-500' :
                            player.rank === 2 ? 'bg-gray-400' :
                            'bg-orange-500'
                          }`}>
                            <Crown className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <span className="text-gray-900 dark:text-gray-100">#{player.rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {player.name[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {player.name}
                          </div>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${
                              player.isOnline ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              {player.isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{player.score}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{player.winRate}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{player.gamesPlayed}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{player.lastPlayed}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {!player.isFriend && (
                          <button
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            title={t('leaderboard.addFriend')}
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title={t('leaderboard.challenge')}
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        {player.isOnline && (
                          <button
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            title={t('leaderboard.spectate')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LeaderboardPage; 