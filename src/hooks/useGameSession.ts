import { useState, useCallback, useEffect } from 'react';
import { useStore } from '../store';
import type { GameSession, GamePlayer } from '../types';

export function useGameSession(sessionId: string) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useStore();

  const fetchSession = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/sessions/${sessionId}`);
      if (!response.ok) throw new Error('Failed to fetch session');
      
      const data = await response.json();
      setSession(data);
      setPlayers(data.players);
      setTimeLeft(data.timeLimit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const submitAnswer = useCallback(async (answerIndex: number, points: number) => {
    if (!session || !user) return;

    try {
      const response = await fetch(`/api/sessions/${sessionId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answerIndex, points }),
      });

      if (!response.ok) throw new Error('Failed to submit answer');

      const updatedSession = await response.json();
      setSession(updatedSession);
      setPlayers(updatedSession.players);
      setTimeLeft(updatedSession.timeLimit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer');
    }
  }, [session, user, sessionId]);

  const setReady = useCallback(async (ready: boolean) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/sessions/${sessionId}/ready`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ready }),
      });

      if (!response.ok) throw new Error('Failed to update ready state');

      const updatedSession = await response.json();
      setSession(updatedSession);
      setPlayers(updatedSession.players);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ready state');
    }
  }, [user, sessionId]);

  return {
    session,
    players,
    timeLeft,
    error,
    isLoading,
    submitAnswer,
    setReady,
    refreshSession: fetchSession,
  };
}