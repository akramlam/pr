import { create } from 'zustand';
import _ from 'underscore';
import type { GameState, Question } from '../types';

interface GameStore {
  questions: Question[];
  currentQuestion: number;
  score: number;
  streak: number;
  loadQuestions: (difficulty: string) => Promise<void>;
  submitAnswer: (answer: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  questions: [],
  currentQuestion: 0,
  score: 0,
  streak: 0,

  loadQuestions: _.memoize(async (difficulty) => {
    // Implementation with caching
  }),

  submitAnswer: _.throttle((answer: number) => {
    // Implementation with rate limiting
  }, 1000)
})); 