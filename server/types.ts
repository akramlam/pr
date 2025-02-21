export interface GameSession {
  id: string;
  name: string;
  questionCount: number;
  currentQuestion: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
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

export interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  points: number;
} 