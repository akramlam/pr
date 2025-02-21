import { io, Socket } from 'socket.io-client';
import { EventEmitter } from '../lib/EventEmitter';
import type { GameSession, GamePlayer } from '../types';

interface ServerToClientEvents {
  connect: () => void;
  disconnect: (reason: string) => void;
  CONNECTED: (data: { playerId: string }) => void;
  HOST_GAME_SUCCESS: (data: { sessionId: string; session: GameSession }) => void;
  JOIN_GAME_SUCCESS: (data: { sessionId: string; session: GameSession }) => void;
  PLAYER_JOINED: (data: { player: GamePlayer; session: GameSession }) => void;
  PLAYER_LEFT: (data: { playerId: string; session: GameSession }) => void;
  GAME_STARTED: (data: { session: GameSession }) => void;
  QUESTION_STARTED: (data: { question: any; timeLimit: number }) => void;
  ANSWER_RESULT: (data: { correct: boolean; score: number }) => void;
  GAME_OVER: (data: { session: GameSession; winners: string[] }) => void;
  ERROR: (data: { message: string }) => void;
}

interface ClientToServerEvents {
  HOST_GAME: () => void;
  JOIN_GAME: (data: { sessionId: string; player: Partial<GamePlayer> }) => void;
  LEAVE_GAME: () => void;
  START_GAME: () => void;
  SUBMIT_ANSWER: (data: { answer: number }) => void;
  PLAYER_READY: (data: { ready: boolean }) => void;
}

export class GameService extends EventEmitter {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private url: string;
  private sessionId: string;
  private _isCleanDisconnect = false;

  constructor(sessionId: string, url: string) {
    super();
    this.sessionId = sessionId;
    this.url = url;
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  get isCleanDisconnect(): boolean {
    return this._isCleanDisconnect;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Socket already connected');
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        console.log('Creating Socket.io connection...');
        
        this.socket = io(this.url, {
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
        });

        this.socket.on('connect', () => {
          console.log('Socket.io connected successfully');
          this.emit('connected', null);
          resolve();
        });

        this.socket.on('connect_error', (error: Error) => {
          console.error('Socket.io connection error:', error);
          this.emit('error', error);
          reject(error);
        });

        this.socket.on('disconnect', (reason: string) => {
          console.log('Socket.io disconnected:', reason);
          this._isCleanDisconnect = reason === 'io client disconnect';
          this.emit('disconnected', reason);
        });

        // Forward game-specific events
        this.socket.on('CONNECTED', (data) => this.emit('CONNECTED', data));
        this.socket.on('HOST_GAME_SUCCESS', (data) => this.emit('HOST_GAME_SUCCESS', data));
        this.socket.on('JOIN_GAME_SUCCESS', (data) => this.emit('JOIN_GAME_SUCCESS', data));
        this.socket.on('PLAYER_JOINED', (data) => this.emit('PLAYER_JOINED', data));
        this.socket.on('PLAYER_LEFT', (data) => this.emit('PLAYER_LEFT', data));
        this.socket.on('GAME_STARTED', (data) => this.emit('GAME_STARTED', data));
        this.socket.on('QUESTION_STARTED', (data) => this.emit('QUESTION_STARTED', data));
        this.socket.on('ANSWER_RESULT', (data) => this.emit('ANSWER_RESULT', data));
        this.socket.on('GAME_OVER', (data) => this.emit('GAME_OVER', data));
        this.socket.on('ERROR', (data) => this.emit('ERROR', data));

      } catch (error) {
        console.error('Failed to create Socket.io connection:', error);
        reject(error);
      }
    });
  }

  send<T extends keyof ClientToServerEvents>(
    type: T,
    data?: ClientToServerEvents[T] extends (arg: infer P) => void ? P : never
  ) {
    if (!this.socket?.connected) {
      console.error('Cannot send message: Socket not connected');
      return;
    }

    try {
      console.log('Sending Socket.io message:', { type, data });
      if (data === undefined) {
        this.socket.emit(type);
      } else {
        this.socket.emit(type, data);
      }
    } catch (error) {
      console.error('Error sending Socket.io message:', error);
    }
  }

  disconnect() {
    console.log('Disconnecting Socket.io');
    this._isCleanDisconnect = true;
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Game-specific methods
  setReady(ready: boolean) {
    this.send('PLAYER_READY', { ready });
  }

  startGame() {
    this.send('START_GAME');
  }

  submitAnswer(answerIndex: number) {
    this.send('SUBMIT_ANSWER', { answer: answerIndex });
  }
}

export const createGameService = (sessionId: string) => {
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  const host = window.location.hostname;
  const port = '3001';
  const baseUrl = `${protocol}://${host}:${port}`;
  return new GameService(sessionId, baseUrl);
}; 