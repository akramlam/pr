import { EventEmitter } from 'events';
import type { GameSession, GamePlayer, Question, Difficulty } from '../types';
import { QUESTIONS_BY_DIFFICULTY } from '../data/questions';

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  timestamp: number;
}

export class GameStateManager extends EventEmitter {
  private sessions = new Map<string, GameSession>();
  private timers = new Map<string, NodeJS.Timeout>();
  private chatHistory = new Map<string, ChatMessage[]>();

  createSession(sessionId: string, difficulty: Difficulty): GameSession {
    const session: GameSession = {
      id: sessionId,
      name: `Game ${sessionId}`,
      status: 'waiting',
      difficulty,
      players: [],
      questions: [],
      currentQuestion: 0,
      questionCount: 5,
      timeLimit: 30,
      startTime: null,
      endTime: null
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  addPlayer(sessionId: string, player: GamePlayer): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const isHost = session.players.length === 0;
    const newPlayer = {
      ...player,
      isHost,
      isReady: false,
      score: 0,
      streak: 0,
      multiplier: 1,
      answers: []
    };

    session.players.push(newPlayer);
    this.emit('sessionUpdate', session);
  }

  removePlayer(sessionId: string, playerId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const playerIndex = session.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return;

    const player = session.players[playerIndex];
    session.players.splice(playerIndex, 1);

    // If no players left, clean up session
    if (session.players.length === 0) {
      this.cleanupSession(sessionId);
      return;
    }

    // If host left, assign new host
    if (player.isHost) {
      session.players[0].isHost = true;
    }

    this.emit('sessionUpdate', session);
  }

  startGame(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session || !session.players.every(p => p.isReady)) return;

    // Select and shuffle questions
    const questions = [...QUESTIONS_BY_DIFFICULTY[session.difficulty]]
      .sort(() => Math.random() - 0.5)
      .slice(0, session.questionCount);

    session.questions = questions;
    session.status = 'active';
    session.currentQuestion = 0;
    session.startTime = Date.now();

    this.emit('gameStart', {
      session,
      question: questions[0],
      timeLimit: session.timeLimit
    });

    this.startQuestionTimer(sessionId);
  }

  submitAnswer(sessionId: string, playerId: string, answerIndex: number): void {
    const session = this.sessions.get(sessionId);
    if (!session || session.status !== 'active') return;

    const player = session.players.find(p => p.id === playerId);
    if (!player) return;

    const question = session.questions[session.currentQuestion];
    const isCorrect = answerIndex === question.correctAnswer;

    // Update player stats
    player.answers[session.currentQuestion] = answerIndex;
    if (isCorrect) {
      player.streak++;
      player.multiplier = Math.min(4, 1 + Math.floor(player.streak / 3));
      player.score += question.points * player.multiplier;
    } else {
      player.streak = 0;
      player.multiplier = 1;
    }

    // Check if all players have answered
    const allAnswered = session.players.every(p => 
      p.answers[session.currentQuestion] !== undefined
    );

    if (allAnswered) {
      this.moveToNextQuestion(sessionId);
    }

    this.emit('answerSubmitted', {
      session,
      playerId,
      isCorrect,
      score: player.score
    });
  }

  private startQuestionTimer(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    let timeLeft = session.timeLimit;
    
    // Clear any existing timer
    this.clearTimer(sessionId);

    const timer = setInterval(() => {
      timeLeft--;

      if (timeLeft <= 0) {
        this.clearTimer(sessionId);
        this.moveToNextQuestion(sessionId);
      } else {
        this.emit('timeUpdate', { sessionId, timeLeft });
      }
    }, 1000);

    this.timers.set(sessionId, timer);
  }

  private moveToNextQuestion(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const nextQuestion = session.currentQuestion + 1;

    if (nextQuestion >= session.questions.length) {
      this.endGame(sessionId);
    } else {
      session.currentQuestion = nextQuestion;
      this.emit('nextQuestion', {
        session,
        question: session.questions[nextQuestion],
        timeLimit: session.timeLimit
      });
      this.startQuestionTimer(sessionId);
    }
  }

  private endGame(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.status = 'finished';
    session.endTime = Date.now();
    this.clearTimer(sessionId);

    this.emit('gameOver', session);
  }

  private clearTimer(sessionId: string): void {
    const timer = this.timers.get(sessionId);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(sessionId);
    }
  }

  private cleanupSession(sessionId: string): void {
    this.clearTimer(sessionId);
    this.sessions.delete(sessionId);
    this.emit('sessionClosed', sessionId);
  }

  sendChatMessage(sessionId: string, playerId: string, playerName: string, text: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      playerId,
      playerName,
      text,
      timestamp: Date.now()
    };

    // Store message in chat history
    const history = this.chatHistory.get(sessionId) || [];
    history.push(message);
    this.chatHistory.set(sessionId, history);

    // Emit chat message event
    this.emit('chatMessage', {
      sessionId,
      message
    });
  }

  getChatHistory(sessionId: string): ChatMessage[] {
    return this.chatHistory.get(sessionId) || [];
  }

  // Add method to get session
  getSession(sessionId: string): GameSession | undefined {
    return this.sessions.get(sessionId);
  }

  // Add method to update session
  updateSession(session: GameSession): void {
    this.sessions.set(session.id, session);
    this.emit('sessionUpdate', session);
  }

  getActiveGames(): GameSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.status === 'waiting' && session.players.length < 8);
  }
}

export const gameStateManager = new GameStateManager(); 