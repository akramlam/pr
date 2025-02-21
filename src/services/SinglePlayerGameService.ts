import { EventEmitter } from '../lib/EventEmitter';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
}

export interface GameState {
  score: number;
  currentQuestion: Question | null;
  questionNumber: number;
  totalQuestions: number;
  timeRemaining: number;
  isGameOver: boolean;
  streak: number;
  multiplier: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageTime: number;
}

export class SinglePlayerGameService extends EventEmitter {
  private state: GameState;
  private timer: number | null = null;
  private questions: Question[] = [];
  private startTime: number = 0;
  private answerTimes: number[] = [];

  constructor() {
    super();
    this.state = {
      score: 0,
      currentQuestion: null,
      questionNumber: 0,
      totalQuestions: 0,
      timeRemaining: 0,
      isGameOver: false,
      streak: 0,
      multiplier: 1,
      correctAnswers: 0,
      incorrectAnswers: 0,
      averageTime: 0
    };
  }

  async startGame(difficulty: string = 'medium', questionsCount: number = 10): Promise<void> {
    try {
      this.questions = await this.fetchQuestions(difficulty, questionsCount);
      this.state = {
        ...this.state,
        score: 0,
        questionNumber: 0,
        totalQuestions: this.questions.length,
        isGameOver: false,
        streak: 0,
        multiplier: 1,
        correctAnswers: 0,
        incorrectAnswers: 0,
        averageTime: 0
      };
      this.nextQuestion();
      this.emit('gameStarted', { ...this.state });
    } catch (error) {
      this.emit('error', error);
    }
  }

  private async fetchQuestions(difficulty: string, count: number): Promise<Question[]> {
    // TODO: Replace with actual API call
    // For now, return mock questions
    return Array.from({ length: count }, (_, i) => ({
      id: `q${i}`,
      text: `Sample question ${i + 1}?`,
      options: [
        `Option A for question ${i + 1}`,
        `Option B for question ${i + 1}`,
        `Option C for question ${i + 1}`,
        `Option D for question ${i + 1}`
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      category: 'General Knowledge',
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      timeLimit: 30
    }));
  }

  submitAnswer(answerIndex: number): void {
    if (this.state.isGameOver || !this.state.currentQuestion) return;

    const timeTaken = (Date.now() - this.startTime) / 1000;
    this.answerTimes.push(timeTaken);

    const isCorrect = answerIndex === this.state.currentQuestion.correctAnswer;
    const timeBonus = Math.max(0, Math.floor((this.state.timeRemaining / this.state.currentQuestion.timeLimit) * 50));
    
    if (isCorrect) {
      this.state.streak++;
      this.state.multiplier = Math.min(4, 1 + Math.floor(this.state.streak / 3));
      this.state.score += (100 + timeBonus) * this.state.multiplier;
      this.state.correctAnswers++;
    } else {
      this.state.streak = 0;
      this.state.multiplier = 1;
      this.state.incorrectAnswers++;
    }

    this.state.averageTime = this.answerTimes.reduce((a, b) => a + b, 0) / this.answerTimes.length;

    this.emit('answerSubmitted', {
      isCorrect,
      correctAnswer: this.state.currentQuestion.correctAnswer,
      timeTaken,
      timeBonus,
      score: this.state.score,
      multiplier: this.state.multiplier
    });

    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }

    setTimeout(() => {
      if (this.state.questionNumber === this.state.totalQuestions - 1) {
        this.endGame();
      } else {
        this.nextQuestion();
      }
    }, 2000);
  }

  private nextQuestion(): void {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }

    const question = this.questions[this.state.questionNumber];
    this.state.currentQuestion = question;
    this.state.timeRemaining = question.timeLimit;
    this.state.questionNumber++;
    this.startTime = Date.now();

    this.timer = window.setInterval(() => {
      this.state.timeRemaining--;
      this.emit('timerUpdate', this.state.timeRemaining);

      if (this.state.timeRemaining <= 0) {
        if (this.timer) {
          window.clearInterval(this.timer);
          this.timer = null;
        }
        this.submitAnswer(-1); // Auto-submit wrong answer when time runs out
      }
    }, 1000);

    this.emit('questionChanged', {
      question,
      questionNumber: this.state.questionNumber,
      totalQuestions: this.state.totalQuestions
    });
  }

  private endGame(): void {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }

    this.state.isGameOver = true;
    this.emit('gameOver', {
      score: this.state.score,
      correctAnswers: this.state.correctAnswers,
      incorrectAnswers: this.state.incorrectAnswers,
      averageTime: this.state.averageTime,
      totalQuestions: this.state.totalQuestions
    });
  }

  pauseGame(): void {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    this.emit('gamePaused', this.state);
  }

  resumeGame(): void {
    if (!this.state.currentQuestion || this.state.isGameOver) return;
    
    this.timer = window.setInterval(() => {
      this.state.timeRemaining--;
      this.emit('timerUpdate', this.state.timeRemaining);

      if (this.state.timeRemaining <= 0) {
        if (this.timer) {
          window.clearInterval(this.timer);
          this.timer = null;
        }
        this.submitAnswer(-1);
      }
    }, 1000);
    
    this.emit('gameResumed', this.state);
  }

  getState(): GameState {
    return { ...this.state };
  }
}

export const createSinglePlayerGameService = () => new SinglePlayerGameService(); 