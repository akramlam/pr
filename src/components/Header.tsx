import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Trophy, Settings, User, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navigation = [
    { name: 'play', path: '/', icon: Home },
    { name: 'leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'profile', path: '/profile', icon: User },
    { name: 'settings', path: '/settings', icon: Settings },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {t('appName')}
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map(({ name, path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium
                    ${location.pathname === path
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {t(name)}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            <button
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 
                hover:text-gray-700 dark:hover:text-gray-300"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <nav className="sm:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map(({ name, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium
                ${location.pathname === path
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {t(name)}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header; 