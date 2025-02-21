import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, User, Palette, Medal, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEEAD', // Yellow
  '#D4A5A5', // Pink
  '#9B59B6', // Purple
  '#3498DB'  // Dark Blue
];

const AVATARS = [
  '👨‍🎓', '👩‍🎓', '🧙‍♂️', '🧙‍♀️', '🦊', '🐱', '🐶', '🐼',
  '🦁', '🐯', '🦉', '🦄', '🐸', '🐢', '🐬', '🐙'
];

const BADGES = {
  newPlayer: { icon: '🌟', name: 'New Player', condition: 'Just joined!' },
  winner: { icon: '🏆', name: 'Winner', condition: 'Won a game' },
  streak: { icon: '🔥', name: 'On Fire', condition: 'Won 3 games in a row' },
  expert: { icon: '🎓', name: 'Expert', condition: 'Won 10 games' },
  social: { icon: '🤝', name: 'Social', condition: 'Played with 10 different players' },
  fast: { icon: '⚡', name: 'Quick Thinker', condition: 'Answered in under 5 seconds' }
};

interface PlayerSettings {
  displayName: string;
  color: string;
  avatar: string;
  badges: string[];
  gamesPlayed?: number;
  gamesWon?: number;
  winStreak?: number;
}

export const PlayerSettings: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<PlayerSettings>(() => {
    const saved = localStorage.getItem('playerSettings');
    return saved ? JSON.parse(saved) : {
      displayName: `Player ${Math.floor(Math.random() * 1000)}`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      badges: ['newPlayer'],
      gamesPlayed: 0,
      gamesWon: 0,
      winStreak: 0
    };
  });

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'badges'>('profile');

  useEffect(() => {
    localStorage.setItem('playerSettings', JSON.stringify(settings));
  }, [settings]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      displayName: e.target.value
    }));
  };

  const handleColorSelect = (color: string) => {
    setSettings(prev => ({
      ...prev,
      color
    }));
  };

  const handleAvatarSelect = (avatar: string) => {
    setSettings(prev => ({
      ...prev,
      avatar
    }));
  };

  const checkBadgeUnlock = (stats: Partial<PlayerSettings>) => {
    const newBadges = [...settings.badges];
    
    // Winner badge
    if (stats.gamesWon && stats.gamesWon > 0 && !newBadges.includes('winner')) {
      newBadges.push('winner');
    }
    
    // Streak badge
    if (stats.winStreak && stats.winStreak >= 3 && !newBadges.includes('streak')) {
      newBadges.push('streak');
    }
    
    // Expert badge
    if (stats.gamesWon && stats.gamesWon >= 10 && !newBadges.includes('expert')) {
      newBadges.push('expert');
    }
    
    // Social badge (assuming we track unique players in stats)
    if (stats.uniquePlayers && stats.uniquePlayers >= 10 && !newBadges.includes('social')) {
      newBadges.push('social');
    }

    if (newBadges.length !== settings.badges.length) {
      setSettings(prev => ({
        ...prev,
        badges: newBadges
      }));
    }
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 25 }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const badgeVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: settings.color }}
              >
                {settings.avatar}
              </div>
              <div>
                <h4 className="font-medium">{settings.displayName}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('gamesPlayed')}: {settings.gamesPlayed}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('displayName')}
              </label>
              <input
                type="text"
                value={settings.displayName}
                onChange={handleNameChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 
                  border-2 border-transparent focus:border-indigo-500 
                  dark:focus:border-indigo-400 focus:outline-none transition-colors"
                maxLength={20}
              />
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                {t('avatar')}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {AVATARS.map(avatar => (
                  <button
                    key={avatar}
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 
                      flex items-center justify-center text-xl transition-transform hover:scale-110
                      ${settings.avatar === avatar ? 'ring-2 ring-indigo-500' : ''}`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                {t('playerColor')}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`w-10 h-10 rounded-full transition-transform hover:scale-110
                      ${settings.color === color ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'badges':
        return renderBadges();
    }
  };

  const renderBadges = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(BADGES).map(([id, badge], index) => (
          <motion.div
            key={id}
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-lg border-2 ${
              settings.badges.includes(id)
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-700 opacity-50'
            }`}
          >
            <motion.div
              whileHover={settings.badges.includes(id) ? { scale: 1.2, rotate: 12 } : {}}
              className="text-2xl mb-1"
            >
              {badge.icon}
            </motion.div>
            <h4 className="font-medium text-sm">{badge.name}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {badge.condition}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title={t('playerSettings')}
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50"
          >
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5" />
              <h3 className="text-lg font-semibold">{t('playerSettings')}</h3>
            </div>

            <div className="flex gap-1 mb-4">
              {['profile', 'appearance', 'badges'].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
                    ${activeTab === tab
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  {t(tab)}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(false)}
                className="w-full py-2 px-4 bg-indigo-600 dark:bg-indigo-500 text-white 
                  rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
              >
                {t('save')}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayerSettings; 