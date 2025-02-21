import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Play, Users, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const modes = [
    {
      title: 'singlePlayer',
      icon: Play,
      path: '/play/single',
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'multiplayerMode',
      icon: Users,
      path: '/play/multi',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'leaderboard',
      icon: Trophy,
      path: '/leaderboard',
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('appName')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t('play')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {modes.map(({ title, icon: Icon, path, color }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={path}
                className={`block p-6 rounded-xl shadow-lg bg-gradient-to-br ${color} 
                  transform transition-all hover:shadow-xl`}
              >
                <div className="text-white">
                  <Icon className="w-12 h-12 mb-4 mx-auto" />
                  <h2 className="text-xl font-bold text-center">
                    {t(title)}
                  </h2>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage; 