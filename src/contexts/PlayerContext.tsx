import React, { createContext, useContext, useEffect, useState } from 'react';

interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  totalScore: number;
  highScore: number;
  averageScore: number;
  totalCorrectAnswers: number;
  totalQuestions: number;
  accuracy: number;
  bestStreak: number;
  averageTime: number;
}

interface PlayerProfile {
  id: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  stats: PlayerStats;
  preferences: {
    difficulty: 'easy' | 'medium' | 'hard';
    questionCount: number;
    timePerQuestion: number;
  };
}

interface PlayerContextType {
  profile: PlayerProfile | null;
  updateProfile: (updates: Partial<PlayerProfile>) => void;
  updateStats: (gameStats: Partial<PlayerStats>) => void;
  isLoading: boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const DEFAULT_PROFILE: PlayerProfile = {
  id: '1',
  username: 'Player',
  avatar: '',
  level: 1,
  xp: 0,
  stats: {
    gamesPlayed: 0,
    gamesWon: 0,
    totalScore: 0,
    highScore: 0,
    averageScore: 0,
    totalCorrectAnswers: 0,
    totalQuestions: 0,
    accuracy: 0,
    bestStreak: 0,
    averageTime: 0
  },
  preferences: {
    difficulty: 'medium',
    questionCount: 10,
    timePerQuestion: 30
  }
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('playerProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      setProfile(DEFAULT_PROFILE);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save profile to localStorage whenever it changes
    if (profile) {
      localStorage.setItem('playerProfile', JSON.stringify(profile));
    }
  }, [profile]);

  const updateProfile = (updates: Partial<PlayerProfile>) => {
    setProfile(prev => {
      if (!prev) return prev;
      return { ...prev, ...updates };
    });
  };

  const updateStats = (gameStats: Partial<PlayerStats>) => {
    setProfile(prev => {
      if (!prev) return prev;
      const newStats = { ...prev.stats };

      // Update each stat
      Object.entries(gameStats).forEach(([key, value]) => {
        if (key in newStats) {
          newStats[key as keyof PlayerStats] = value as number;
        }
      });

      // Calculate new averages
      if (newStats.gamesPlayed > 0) {
        newStats.averageScore = newStats.totalScore / newStats.gamesPlayed;
        newStats.accuracy = (newStats.totalCorrectAnswers / newStats.totalQuestions) * 100;
      }

      return { ...prev, stats: newStats };
    });
  };

  return (
    <PlayerContext.Provider value={{ profile, updateProfile, updateStats, isLoading }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}; 