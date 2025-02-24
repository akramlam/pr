import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { usePlayer } from '../contexts/PlayerContext';
import PageLayout from '../components/PageLayout';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { profile, updateProfile, isLoading } = usePlayer();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(profile?.username || '');

  if (isLoading || !profile) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="spinner" />
        </div>
      </PageLayout>
    );
  }

  const handleSave = () => {
    updateProfile({ username: editedUsername });
    setIsEditing(false);
  };

  const levelProgress = (profile.xp % 1000) / 1000;
  const xpToNextLevel = 1000 - (profile.xp % 1000);

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {profile.username[0].toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {profile.level}
              </div>
            </div>

            <div className="flex-1">
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter username"
                  />
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {t('common.save')}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedUsername(profile.username);
                    }}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{profile.username}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    {t('game.edit')}
                  </button>
                </div>
              )}

              <div className="mt-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Level {profile.level}
                </div>
                <div className="mt-1 relative">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-indigo-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${levelProgress * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {xpToNextLevel} XP to next level
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">{t('stats.overview')}</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('stats.gamesPlayed')}</span>
                <span className="font-semibold">{profile.stats.gamesPlayed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('stats.totalScore')}</span>
                <span className="font-semibold">{profile.stats.totalScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{t('stats.highScore')}</span>
                <span className="font-semibold">{profile.stats.highScore}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">{t('game.preferences')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('game.difficulty')}
                </label>
                <select
                  value={profile.preferences.difficulty}
                  onChange={(e) => updateProfile({
                    preferences: { ...profile.preferences, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="easy">{t('game.easy')}</option>
                  <option value="medium">{t('game.medium')}</option>
                  <option value="hard">{t('game.hard')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('game.questions')}
                </label>
                <select
                  value={profile.preferences.questionCount}
                  onChange={(e) => updateProfile({
                    preferences: { ...profile.preferences, questionCount: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('game.timeLimit')}
                </label>
                <select
                  value={profile.preferences.timePerQuestion}
                  onChange={(e) => updateProfile({
                    preferences: { ...profile.preferences, timePerQuestion: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="15">15 {t('common.seconds')}</option>
                  <option value="30">30 {t('common.seconds')}</option>
                  <option value="45">45 {t('common.seconds')}</option>
                  <option value="60">60 {t('common.seconds')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;