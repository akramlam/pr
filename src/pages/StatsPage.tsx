import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Award, Users, Zap, Brain, Target, ChevronDown, Filter, X, Clock,
  Share2, Download, ExternalLink, Check, BarChart as BarChartIcon, TrendingUp, TrendingDown, Minus,
  Sun, Moon, Cloud, Crown, Medal, Star, Shield, Users2, RefreshCw, UserPlus, Play, Eye
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import usePlayerStats from '../hooks/usePlayerStats';
import PageLayout from '../components/PageLayout';

interface FilterState {
  timePeriod: 'all' | 'week' | 'month' | '3months';
  gameType: 'all' | 'single' | 'multi';
}

const StatsPage: React.FC = () => {
  const { t } = useTranslation();
  const { stats } = usePlayerStats();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    timePeriod: 'all',
    gameType: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [expandedGames, setExpandedGames] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [comparisonType, setComparisonType] = useState<'global' | 'top' | 'similar'>('global');
  const [leaderboardType, setLeaderboardType] = useState<'global' | 'regional' | 'friends'>('global');
  const [leaderboardTimeFrame, setLeaderboardTimeFrame] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');

  const getSkillLevel = (value: number) => {
    if (value >= 90) return 'expert';
    if (value >= 70) return 'advanced';
    if (value >= 40) return 'intermediate';
    return 'novice';
  };

  const getNextAchievement = () => {
    const achievements = [
      { name: 'expert', requirement: 10, current: stats.gamesWon, type: 'gamesWon' },
      { name: 'streak', requirement: 3, current: stats.winStreak, type: 'winStreak' },
      { name: 'social', requirement: 10, current: stats.uniquePlayers.size, type: 'uniquePlayers' },
      { name: 'fast', requirement: 5, current: stats.fastAnswers, type: 'fastAnswers' }
    ];

    return achievements
      .filter(a => !stats.badges.includes(a.name))
      .sort((a, b) => (a.requirement - a.current) - (b.requirement - b.current))[0];
  };

  const statCards = [
    {
      icon: Trophy,
      label: 'gamesWon',
      value: stats.gamesWon,
      color: 'from-yellow-500 to-amber-500'
    },
    {
      icon: Target,
      label: 'gamesPlayed',
      value: stats.gamesPlayed,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      label: 'winStreak',
      value: stats.winStreak,
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Users,
      label: 'uniquePlayers',
      value: stats.uniquePlayers.size,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Brain,
      label: 'fastAnswers',
      value: stats.fastAnswers,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Award,
      label: 'badges',
      value: stats.badges.length,
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const filteredStats = useMemo(() => {
    let filtered = { ...stats };
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;

    // Apply time period filter
    if (filters.timePeriod !== 'all') {
      const days = {
        week: 7,
        month: 30,
        '3months': 90
      }[filters.timePeriod];

      filtered = {
        ...filtered,
        gamesPlayed: Math.floor(filtered.gamesPlayed * 0.7), // Simulated filtering
        gamesWon: Math.floor(filtered.gamesWon * 0.7),
        winStreak: Math.max(0, filtered.winStreak - 1),
        fastAnswers: Math.floor(filtered.fastAnswers * 0.7)
      };
    }

    // Apply game type filter
    if (filters.gameType !== 'all') {
      filtered = {
        ...filtered,
        gamesPlayed: Math.floor(filtered.gamesPlayed * 0.5), // Simulated filtering
        gamesWon: Math.floor(filtered.gamesWon * 0.5),
        winStreak: Math.max(0, filtered.winStreak - 1),
        fastAnswers: Math.floor(filtered.fastAnswers * 0.5)
      };
    }

    return filtered;
  }, [stats, filters]);

  const calculateWinRate = () => {
    if (stats.gamesPlayed === 0) return 0;
    return Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
  };

  const winRateData = [
    { name: t('gamesWon'), value: stats.gamesWon },
    { name: t('gamesLost'), value: stats.gamesPlayed - stats.gamesWon }
  ];

  const COLORS = ['#4ade80', '#f87171'];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderProgressChart = () => {
    const chartData = Array.from({ length: Math.min(stats.gamesPlayed, 10) }, (_, i) => ({
      game: i + 1,
      streak: Math.min(i + 1, stats.winStreak)
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <XAxis dataKey="game" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line
            type="monotone"
            dataKey="streak"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderWinRateChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={winRateData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}`}
        >
          {winRateData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );

  const StatSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 
          dark:hover:bg-gray-700 transition-colors"
        onClick={() => toggleSection(title)}
      >
        <h2 className="text-xl font-bold">{title}</h2>
        <motion.div
          animate={{ rotate: expandedSection === title ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {expandedSection === title && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-6 pb-6"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const FilterButton: React.FC<{
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }> = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
        ${active 
          ? 'bg-indigo-600 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        }`}
    >
      {children}
    </button>
  );

  const FilterSection = () => (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{t('filterStats')}</h3>
        <button
          onClick={() => setShowFilters(false)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('timeFilter')}</label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'allTime' },
              { key: 'week', label: 'lastWeek' },
              { key: 'month', label: 'lastMonth' },
              { key: '3months', label: 'last3Months' }
            ].map(period => (
              <FilterButton
                key={period.key}
                active={filters.timePeriod === period.key}
                onClick={() => setFilters(f => ({ ...f, timePeriod: period.key as FilterState['timePeriod'] }))}
              >
                {t(period.label)}
              </FilterButton>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('gameType')}</label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'allGames' },
              { key: 'single', label: 'singlePlayerGames' },
              { key: 'multi', label: 'multiplayerGames' }
            ].map(type => (
              <FilterButton
                key={type.key}
                active={filters.gameType === type.key}
                onClick={() => setFilters(f => ({ ...f, gameType: type.key as FilterState['gameType'] }))}
              >
                {t(type.label)}
              </FilterButton>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setFilters({ timePeriod: 'all', gameType: 'all' })}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {t('resetFilters')}
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderTimeStats = () => {
    const totalMinutes = Math.floor(stats.gamesPlayed * 3.5); // Simulated average game time
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('totalPlayTime')}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {Math.round(stats.gamesWon / (stats.gamesPlayed || 1) * 100)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('averageScore')}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {stats.winStreak * 100}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('bestScore')}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Simulated game history data
  const gameHistory = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      opponent: `Player ${Math.floor(Math.random() * 100)}`,
      result: Math.random() > 0.5 ? 'victory' : 'defeat',
      duration: `${Math.floor(Math.random() * 10 + 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      gameMode: Math.random() > 0.5 ? 'singlePlayer' : 'multiplayerMode',
      score: Math.floor(Math.random() * 1000)
    }));
  }, []);

  // Simulated skills data
  const skillsData = [
    { skill: 'speed', value: Math.min(100, stats.fastAnswers * 10) },
    { skill: 'accuracy', value: Math.round((stats.gamesWon / stats.gamesPlayed) * 100) || 0 },
    { skill: 'consistency', value: Math.min(100, stats.winStreak * 20) },
    { skill: 'adaptability', value: Math.min(100, stats.uniquePlayers.size * 5) },
    { skill: 'knowledge', value: Math.min(100, stats.gamesWon * 5) },
    { skill: 'teamwork', value: Math.min(100, stats.uniquePlayers.size * 10) }
  ];

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Opponent', 'Result', 'Duration', 'Game Mode', 'Score'].join(','),
      ...gameHistory.map(game => 
        [game.date, game.opponent, game.result, game.duration, t(game.gameMode), game.score].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'game_history.csv';
    link.click();
  };

  const handleShare = async () => {
    const statsUrl = window.location.href;
    await navigator.clipboard.writeText(statsUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const renderAchievementProgress = () => {
    const nextAchievement = getNextAchievement();
    if (!nextAchievement) return null;

    const progress = (nextAchievement.current / nextAchievement.requirement) * 100;
    const remaining = nextAchievement.requirement - nextAchievement.current;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">{t('achievementProgress')}</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>{t('nextAchievement')}: {t(`badge${nextAchievement.name}`)}</span>
              <span>{nextAchievement.current}/{nextAchievement.requirement}</span>
            </div>
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="absolute h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {remaining} {t(nextAchievement.type)} {t('remainingToUnlock')}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderSkillDetails = () => {
    if (!selectedSkill) return null;

    const skill = skillsData.find(s => s.skill === selectedSkill)!;
    const level = getSkillLevel(skill.value);
    const nextLevel = {
      novice: 'intermediate',
      intermediate: 'advanced',
      advanced: 'expert',
      expert: 'expert'
    }[level];

    const nextThreshold = {
      novice: 40,
      intermediate: 70,
      advanced: 90,
      expert: 100
    }[level];

    const progress = (skill.value / nextThreshold) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mt-6 space-y-4"
      >
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-lg font-medium">{t(selectedSkill)}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t(`skillDescriptions.${selectedSkill}`)}
            </p>
          </div>
          <button
            onClick={() => setSelectedSkill(null)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">{t('currentLevel')}</span>
            <span className="text-sm font-medium">
              {t(`skillLevels.${selectedSkill}.${level}`)}
            </span>
          </div>
          {level !== 'expert' && (
            <>
              <div className="relative h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="absolute h-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {t('nextLevel')}: {t(`skillLevels.${selectedSkill}.${nextLevel}`)}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {Math.round(progress)}%
                </span>
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h5 className="font-medium mb-2">{t('recentProgress')}</h5>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[
              { day: 1, value: Math.max(0, skill.value - 20) },
              { day: 2, value: Math.max(0, skill.value - 15) },
              { day: 3, value: Math.max(0, skill.value - 10) },
              { day: 4, value: Math.max(0, skill.value - 5) },
              { day: 5, value: skill.value }
            ]}>
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  };

  const renderSkillsChart = () => (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
          <PolarGrid stroke="#888" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: '#888' }}
            tickFormatter={value => t(value)}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Skills"
            dataKey="value"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.6}
            onClick={(point) => setSelectedSkill(point.skill)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value) => [
              `${value}% - ${t(`skillLevels.${selectedSkill || 'speed'}.${getSkillLevel(value as number)}`)}`,
              t('skillLevel')
            ]}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        {t('clickToView')}
      </div>
      <AnimatePresence mode="wait">
        {selectedSkill && renderSkillDetails()}
      </AnimatePresence>
    </div>
  );

  const renderGameHistory = () => (
    <div className="overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{t('recentGames')}</h3>
        <div className="flex items-center space-x-2">
          <motion.div
            initial={false}
            animate={{ opacity: linkCopied ? 1 : 0 }}
            className="text-sm text-green-500"
          >
            {linkCopied && t('linkCopied')}
          </motion.div>
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                    overflow-hidden z-10"
                >
                  <button
                    onClick={handleExport}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 
                      flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t('downloadCsv')}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 
                      flex items-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{t('copyLink')}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b dark:border-gray-700">
              <th className="pb-2">{t('date')}</th>
              <th className="pb-2">{t('opponent')}</th>
              <th className="pb-2">{t('gameMode')}</th>
              <th className="pb-2">{t('result')}</th>
              <th className="pb-2">{t('duration')}</th>
              <th className="pb-2">{t('score')}</th>
            </tr>
          </thead>
          <tbody>
            {gameHistory.slice(0, expandedGames ? undefined : 5).map((game) => (
              <motion.tr
                key={game.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b dark:border-gray-700"
              >
                <td className="py-3">{game.date}</td>
                <td className="py-3">{game.opponent}</td>
                <td className="py-3">{t(game.gameMode)}</td>
                <td className="py-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${game.result === 'victory' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}
                  >
                    {t(game.result)}
                  </span>
                </td>
                <td className="py-3">{game.duration}</td>
                <td className="py-3">{game.score}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {gameHistory.length > 5 && (
        <button
          onClick={() => setExpandedGames(!expandedGames)}
          className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {t(expandedGames ? 'viewLess' : 'viewMore')}
        </button>
      )}
    </div>
  );

  const globalAverages = {
    gamesWon: Math.floor(stats.gamesWon * 0.8),
    winRate: 45,
    fastAnswers: Math.floor(stats.fastAnswers * 0.7),
    skillLevels: {
      speed: 65,
      accuracy: 70,
      consistency: 60,
      adaptability: 55,
      knowledge: 75,
      teamwork: 68
    }
  };

  const getPerformanceInsights = () => {
    const timeOfDay = {
      morning: { wins: 15, total: 25 },
      afternoon: { wins: 20, total: 30 },
      evening: { wins: 25, total: 35 },
      night: { wins: 10, total: 20 }
    };

    const bestTime = Object.entries(timeOfDay)
      .sort(([, a], [, b]) => (b.wins / b.total) - (a.wins / a.total))[0][0];

    const trend = stats.gamesWon > globalAverages.gamesWon ? 'upward' : 
      stats.gamesWon < globalAverages.gamesWon ? 'downward' : 'stable';

    const strongestSkill = skillsData
      .sort((a, b) => b.value - a.value)[0];

    const weakestSkill = skillsData
      .sort((a, b) => a.value - b.value)[0];

    return {
      bestTime,
      trend,
      strongestSkill,
      weakestSkill,
      timeOfDay
    };
  };

  const renderComparisons = () => {
    const insights = getPerformanceInsights();
    
    return (
      <div className="space-y-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setComparisonType('global')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              comparisonType === 'global' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {t('globalAverage')}
          </button>
          <button
            onClick={() => setComparisonType('top')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              comparisonType === 'top'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {t('topPlayers')}
          </button>
          <button
            onClick={() => setComparisonType('similar')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              comparisonType === 'similar'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {t('similar')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">{t('globalStats')}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{t('winRate')}</span>
                  <span className="font-medium">
                    {calculateWinRate()}% vs {globalAverages.winRate}%
                  </span>
                </div>
                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="absolute h-full bg-green-500"
                    style={{ width: `${globalAverages.winRate}%` }}
                  />
                  <div 
                    className="absolute h-full bg-indigo-500"
                    style={{ width: `${calculateWinRate()}%` }}
                  />
                </div>
              </div>
              {Object.entries(globalAverages.skillLevels).map(([skill, value]) => (
                <div key={skill}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t(skill)}</span>
                    <span className="font-medium">
                      {skillsData.find(s => s.skill === skill)?.value}% vs {value}%
                    </span>
                  </div>
                  <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="absolute h-full bg-green-500"
                      style={{ width: `${value}%` }}
                    />
                    <div 
                      className="absolute h-full bg-indigo-500"
                      style={{ 
                        width: `${skillsData.find(s => s.skill === skill)?.value}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">{t('insights')}</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {t('bestTimeToPlay')}
                </h4>
                <div className="grid grid-cols-4 gap-4">
                  {(['morning', 'afternoon', 'evening', 'night'] as const).map(time => {
                    const data = insights.timeOfDay[time];
                    const winRate = Math.round((data.wins / data.total) * 100);
                    const isBest = time === insights.bestTime;
                    
                    return (
                      <div
                        key={time}
                        className={`p-3 rounded-lg text-center ${
                          isBest 
                            ? 'bg-indigo-50 dark:bg-indigo-900/30' 
                            : 'bg-gray-50 dark:bg-gray-700'
                        }`}
                      >
                        {time === 'morning' && <Sun className="w-5 h-5 mx-auto mb-1" />}
                        {time === 'afternoon' && <Sun className="w-5 h-5 mx-auto mb-1" />}
                        {time === 'evening' && <Cloud className="w-5 h-5 mx-auto mb-1" />}
                        {time === 'night' && <Moon className="w-5 h-5 mx-auto mb-1" />}
                        <div className="text-sm font-medium">{t(time)}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {winRate}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {t('trending')}
                </h4>
                <div className="flex items-center space-x-2">
                  {insights.trend === 'upward' && (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  )}
                  {insights.trend === 'downward' && (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  )}
                  {insights.trend === 'stable' && (
                    <Minus className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="text-sm">
                    {t(insights.trend)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {t('analytics.strongestCategory')}
                  </h4>
                  <div className="text-sm">
                    {t(insights.strongestSkill.skill)} ({insights.strongestSkill.value}%)
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    {t('analytics.weakestCategory')}
                  </h4>
                  <div className="text-sm">
                    {t(insights.weakestSkill.skill)} ({insights.weakestSkill.value}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const playerRank = {
    tier: 'gold',
    division: 'ii',
    points: 1250,
    pointsToNext: 1500,
    globalRank: 12345,
    regionalRank: 567,
    seasonRank: 789,
    history: [
      { date: '2023-01', rank: 15000 },
      { date: '2023-02', rank: 14000 },
      { date: '2023-03', rank: 12345 }
    ]
  };

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

  const renderRankingSection = () => {
    const getTierColor = (tier: string) => {
      const colors = {
        bronze: 'from-orange-400 to-orange-600',
        silver: 'from-gray-400 to-gray-600',
        gold: 'from-yellow-400 to-yellow-600',
        platinum: 'from-cyan-400 to-cyan-600',
        diamond: 'from-blue-400 to-blue-600',
        master: 'from-purple-400 to-purple-600',
        grandmaster: 'from-red-400 to-red-600'
      };
      return colors[tier] || colors.bronze;
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{t('ranking.currentRank')}</h3>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${getTierColor(playerRank.tier)}`}>
                <Crown className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {t(`ranking.tiers.${playerRank.tier}`)} {t(`ranking.divisions.${playerRank.division}`)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {playerRank.points} / {playerRank.pointsToNext} {t('ranking.rankProgress')}
              </div>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(playerRank.points / playerRank.pointsToNext) * 100}%` }}
                  className={`h-full bg-gradient-to-r ${getTierColor(playerRank.tier)}`}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">{t('ranking.globalRank')}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Medal className="w-5 h-5 text-yellow-500" />
                  <span>{t('ranking.globalRank')}</span>
                </div>
                <span className="font-bold">#{playerRank.globalRank}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span>{t('ranking.regionalRank')}</span>
                </div>
                <span className="font-bold">#{playerRank.regionalRank}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-purple-500" />
                  <span>{t('ranking.seasonRank')}</span>
                </div>
                <span className="font-bold">#{playerRank.seasonRank}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-medium mb-4">{t('ranking.rankHistory')}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={playerRank.history}>
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" reversed />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`#${value}`, t('ranking.globalRank')]}
                />
                <Line
                  type="monotone"
                  dataKey="rank"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderLeaderboardSection = () => {
    return (
      <div className="space-y-6">
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
            {(['weekly', 'monthly', 'allTime'] as const).map((timeFrame) => (
              <button
                key={timeFrame}
                onClick={() => setLeaderboardTimeFrame(timeFrame)}
                className={`px-4 py-2 ${
                  leaderboardTimeFrame === timeFrame
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {t(`leaderboard.${timeFrame}`)}
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

        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
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
    );
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 
              dark:from-indigo-400 dark:to-indigo-600 bg-clip-text text-transparent">
              {t('playerStats')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t('statsDescription')}
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 
              rounded-lg shadow hover:shadow-md transition-all"
          >
            <Filter className="w-5 h-5" />
            <span>{t('filterStats')}</span>
          </motion.button>
        </div>

        <AnimatePresence>
          {showFilters && <FilterSection />}
        </AnimatePresence>

        {renderTimeStats()}

        {renderAchievementProgress()}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {statCards.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold">{stat.value}</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {t(stat.label)}
                </h3>
              </div>
              <div 
                className={`h-2 bg-gradient-to-r ${stat.color}`}
                style={{ width: `${(stat.value / (stats.gamesPlayed || 1)) * 100}%` }}
              />
            </motion.div>
          ))}
        </motion.div>

        <StatSection title={t('winRateChart')}>
          <div className="text-center mb-4">
            <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
              {calculateWinRate()}%
            </span>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t('winRate')}
            </p>
          </div>
          {renderWinRateChart()}
        </StatSection>

        <StatSection title={t('progressChart')}>
          <div className="text-center mb-4">
            <p className="text-gray-600 dark:text-gray-400">
              {t('streakProgress')}
            </p>
          </div>
          {renderProgressChart()}
        </StatSection>

        <StatSection title={t('achievements')}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.badges.map((badge, index) => (
              <motion.div
                key={badge}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
                className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 
                  rounded-lg cursor-pointer"
              >
                <div className="text-3xl mb-2">
                  {badge.icon}
                </div>
                <div className="text-sm font-medium text-center">
                  {t(`badge${badge}`)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                  {t(`badge${badge}Desc`)}
                </div>
              </motion.div>
            ))}
          </div>
        </StatSection>

        <StatSection title={t('skillsChart')}>
          {renderSkillsChart()}
        </StatSection>

        <StatSection title={t('comparisons')}>
          {renderComparisons()}
        </StatSection>

        <StatSection title={t('gameHistory')}>
          {renderGameHistory()}
        </StatSection>

        <StatSection title={t('ranking.title')}>
          {renderRankingSection()}
        </StatSection>

        <StatSection title={t('leaderboard.title')}>
          {renderLeaderboardSection()}
        </StatSection>
      </div>
    </PageLayout>
  );
};

export default StatsPage; 