export interface User {
  id: string;
  name: string;
  email: string;
  role: 'administrator' | 'player';
  photoUrl?: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: Difficulty;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  points: number;
}

export interface GameSession {
  id: string;
  name: string;
  questionCount: number;
  currentQuestion: number;
  timeLimit: number;
  difficulty: Difficulty;
  players: GamePlayer[];
  questions: Question[];
  status: 'waiting' | 'active' | 'finished';
  startTime?: number;
  endTime?: number;
}

export interface GamePlayer {
  id: string;
  name: string;
  photoUrl?: string;
  score: number;
  streak: number;
  multiplier: number;
  answers: number[];
  isReady: boolean;
  isHost: boolean;
}

export interface GameInvite {
  id: string;
  sessionId: string;
  hostId: string;
  hostName: string;
  difficulty: Difficulty;
  created: number;
}