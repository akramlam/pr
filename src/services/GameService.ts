import { createWebSocketClient } from '../lib/websocket';
import type { GameSession, GamePlayer } from '../types';

class GameService {
  private ws: ReturnType<typeof createWebSocketClient> | null = null;
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  connect() {
    this.ws = createWebSocketClient(this.sessionId ? `/game/${this.sessionId}` : '/game');
    this.ws.connect();
    return this.ws;
  }

  disconnect() {
    this.ws?.disconnect();
  }

  joinSession(player: Partial<GamePlayer>) {
    this.ws?.send({
      type: 'JOIN_SESSION',
      player,
    });
  }

  setReady(ready: boolean) {
    this.ws?.send({
      type: 'PLAYER_READY',
      ready,
    });
  }

  startGame() {
    this.ws?.send({
      type: 'START_GAME',
    });
  }

  submitAnswer(answerIndex: number) {
    this.ws?.send({
      type: 'SUBMIT_ANSWER',
      answerIndex,
    });
  }

  async hostGame(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.ws) {
        this.connect();
      }

      const handleMessage = (message: any) => {
        if (message.type === 'HOST_GAME_SUCCESS') {
          this.ws?.removeListener('message', handleMessage);
          this.sessionId = message.sessionId;
          resolve(message.sessionId);
        } else if (message.type === 'ERROR') {
          this.ws?.removeListener('message', handleMessage);
          reject(new Error(message.error));
        }
      };

      this.ws?.on('message', handleMessage);
      this.ws?.send({ type: 'HOST_GAME' });
    });
  }
}

export const createGameService = (sessionId: string) => new GameService(sessionId); 