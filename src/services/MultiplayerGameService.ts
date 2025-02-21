import { io, Socket } from 'socket.io-client';
import { EventEmitter } from '../lib/EventEmitter';

export class MultiplayerGameService extends EventEmitter {
  private socket: Socket | null = null;
  private gameId: string | null = null;
  private userId: string;

  constructor(userId: string) {
    super();
    this.userId = userId;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log('Connecting to game server...');
        this.socket = io('http://localhost:3001', {
          transports: ['websocket'],
          reconnection: true,
          timeout: 10000
        });

        this.socket.on('connect', () => {
          console.log('Connected to game server');
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Connection error:', error);
          reject(error);
        });

        this.setupEventListeners();
      } catch (error) {
        console.error('Failed to create socket connection:', error);
        reject(error);
      }
    });
  }

  createGame(settings: any = { mode: 'casual' }) {
    if (!this.socket) {
      throw new Error('Not connected to server');
    }

    console.log('Creating game with settings:', settings);
    this.socket.emit('HOST_GAME', {
      userId: this.userId,
      settings
    });
  }

  joinGame(gameId: string) {
    if (!this.socket) throw new Error('Not connected');
    
    this.socket.emit('JOIN_GAME', {
      userId: this.userId,
      gameId
    });
  }

  setReady() {
    if (!this.socket || !this.gameId) throw new Error('Not in a game');
    
    this.socket.emit('PLAYER_READY', {
      gameId: this.gameId,
      userId: this.userId
    });
  }

  submitAnswer(answer: number) {
    if (!this.socket || !this.gameId) throw new Error('Not in a game');
    
    this.socket.emit('SUBMIT_ANSWER', {
      gameId: this.gameId,
      userId: this.userId,
      answer
    });
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('GAME_CREATED', (data) => {
      console.log('Game created:', data);
      this.gameId = data.gameId;
      this.emit('gameCreated', data);
    });

    this.socket.on('PLAYER_JOINED', (data) => {
      this.emit('playerJoined', data);
    });

    this.socket.on('PLAYERS_STATUS', (data) => {
      this.emit('playersStatus', data);
    });

    this.socket.on('GAME_STARTING', (data) => {
      this.emit('gameStarting', data);
    });

    this.socket.on('GAME_STARTED', (data) => {
      this.emit('gameStarted', data);
    });

    this.socket.on('ANSWER_RESULTS', (data) => {
      this.emit('answerResults', data);
    });

    this.socket.on('PLAYER_LEFT', (data) => {
      this.emit('playerLeft', data);
    });

    this.socket.on('ERROR', (error) => {
      console.error('Server error:', error);
      this.emit('error', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.gameId = null;
    }
  }
} 