import React from 'react';
import { useTranslation } from 'react-i18next';
import PageLayout from '../components/PageLayout';

const Stats: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {t('stats.title')}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overview Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t('stats.overview')}
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {t('stats.gamesPlayed')}
                </span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {t('stats.totalScore')}
                </span>
                <span className="font-semibold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {t('stats.averageScore')}
                </span>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t('stats.performance')}
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {t('stats.accuracy')}
                </span>
                <span className="font-semibold">0%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {t('stats.averageTime')}
                </span>
                <span className="font-semibold">0s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {t('stats.bestStreak')}
                </span>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </div>

          {/* History Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">
              {t('stats.history')}
            </h2>
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Play some games to see your history!
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Stats; 