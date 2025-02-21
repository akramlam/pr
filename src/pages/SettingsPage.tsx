import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sun, Moon, Volume2, VolumeX, Globe, Bell, Shield, LogOut } from 'lucide-react';
import PageLayout from '../components/PageLayout';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const settingsSections = [
    {
      title: 'appearance',
      settings: [
        {
          id: 'theme',
          label: 'toggleTheme',
          icon: isDarkMode ? Moon : Sun,
          value: isDarkMode,
          onChange: () => setIsDarkMode(!isDarkMode)
        }
      ]
    },
    {
      title: 'sound',
      settings: [
        {
          id: 'sound',
          label: 'Sound Effects',
          icon: isSoundEnabled ? Volume2 : VolumeX,
          value: isSoundEnabled,
          onChange: () => setIsSoundEnabled(!isSoundEnabled)
        }
      ]
    },
    {
      title: 'notifications',
      settings: [
        {
          id: 'notifications',
          label: 'Enable Notifications',
          icon: Bell,
          value: notifications,
          onChange: () => setNotifications(!notifications)
        }
      ]
    },
    {
      title: 'language',
      settings: [
        {
          id: 'language',
          label: 'Language',
          icon: Globe,
          value: 'English',
          type: 'select',
          options: ['English', 'Español', 'Français', '中文']
        }
      ]
    },
    {
      title: 'privacy',
      settings: [
        {
          id: 'privacy',
          label: 'Profile Visibility',
          icon: Shield,
          value: 'Public',
          type: 'select',
          options: ['Public', 'Friends Only', 'Private']
        }
      ]
    }
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('settings')}
              </h1>
            </div>

            {settingsSections.map(section => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {t(section.title)}
                  </h2>
                  <div className="space-y-4">
                    {section.settings.map(setting => (
                      <div
                        key={setting.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <setting.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-900 dark:text-white">
                            {t(setting.label)}
                          </span>
                        </div>
                        {setting.type === 'select' ? (
                          <select
                            className="form-select rounded-md border-gray-300 dark:border-gray-600 
                              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            value={setting.value}
                          >
                            {setting.options.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <button
                            onClick={setting.onChange}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer 
                              rounded-full border-2 border-transparent transition-colors duration-200 
                              ease-in-out focus:outline-none ${
                                setting.value
                                  ? 'bg-indigo-600'
                                  : 'bg-gray-200 dark:bg-gray-700'
                              }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform 
                                rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  setting.value ? 'translate-x-5' : 'translate-x-0'
                                }`}
                            />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
                  {t('logout')}
                </h2>
                <button
                  className="flex items-center space-x-2 text-red-600 dark:text-red-400 
                    hover:text-red-700 dark:hover:text-red-300"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsPage; 