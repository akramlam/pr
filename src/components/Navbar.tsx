import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, LogOut, User } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 
              dark:from-indigo-400 dark:to-indigo-600 bg-clip-text text-transparent">
              SMARTER®
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/leaderboard"
              className="nav-link flex items-center space-x-2 p-2 rounded-lg 
                hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Trophy className="h-5 w-5" />
              <span className="hidden sm:inline">{t('leaderboard')}</span>
            </Link>

            <DarkModeToggle />

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="nav-link flex items-center space-x-2 p-2 rounded-lg 
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>

                <button
                  onClick={logout}
                  className="nav-link flex items-center space-x-2 p-2 rounded-lg 
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">{t('logout')}</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="nav-link flex items-center space-x-2 p-2 rounded-lg 
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">{t('login')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;