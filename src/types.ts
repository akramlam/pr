export interface GamePlayer {
  id: string;
  name: string;
  isHost: boolean;
  ready: boolean;
  score: number;
}

export interface GameSession {
  id: string;
  // name: game{$id};
  players: GamePlayer[];
  status: 'waiting' | 'playing' | 'finished';
  currentRound?: number;
  totalRounds?: number;
}

export interface GameQuestion {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: number;
}

export interface GameRound {
  question: GameQuestion;
  timeLimit: number;
  answers: { [playerId: string]: number };
}

export interface GameState {
  session: GameSession;
  currentRound?: GameRound;
  timeRemaining?: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Category = 'Math' | 'Science' | 'Geography' | 'History';

export interface Question {
  id: string;
  text: string;
  category: Category;
  difficulty: Difficulty;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
  points: number;
} 