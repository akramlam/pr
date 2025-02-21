import { useState, useEffect } from 'react';

interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  winStreak: number;
  fastAnswers: number;
  badges: string[];
  uniquePlayers: Set<string>;
}

const usePlayerStats = () => {
  const [stats, setStats] = useState<PlayerStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    winStreak: 0,
    fastAnswers: 0,
    badges: [],
    uniquePlayers: new Set()
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // TODO: Replace with actual API call
        // Simulated API response
        const mockStats = {
          gamesPlayed: 50,
          gamesWon: 30,
          winStreak: 5,
          fastAnswers: 25,
          badges: ['newPlayer', 'winner', 'streak'],
          uniquePlayers: new Set(['player1', 'player2', 'player3', 'player4', 'player5'])
        };

        setStats(mockStats);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const updateStats = (newStats: Partial<PlayerStats>) => {
    setStats(prevStats => ({
      ...prevStats,
      ...newStats,
      uniquePlayers: new Set([...prevStats.uniquePlayers, ...(newStats.uniquePlayers || [])])
    }));
  };

  return {
    stats,
    loading,
    error,
    updateStats
  };
};

export default usePlayerStats; 