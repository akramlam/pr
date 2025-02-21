import { v4 as uuidv4 } from 'uuid';
import type { GameSession, Difficulty } from '../types';

export class LobbyManager {
  private lobbies = new Map<string, GameSession>();

  createLobby(difficulty: Difficulty, timeLimit: number = 30): GameSession {
    const id = uuidv4();
    const lobby: GameSession = {
      id,
      name: `Game ${id}`,
      status: 'waiting',
      difficulty,
      players: [],
      questions: [],
      currentQuestion: 0,
      questionCount: 5,
      timeLimit,
      startTime: undefined,
      endTime: undefined
    };

    this.lobbies.set(id, lobby);
    return lobby;
  }

  getLobby(id: string): GameSession | undefined {
    return this.lobbies.get(id);
  }

  deleteLobby(id: string): boolean {
    return this.lobbies.delete(id);
  }

  getActiveLobbies(): GameSession[] {
    return Array.from(this.lobbies.values()).filter(
      lobby => lobby.status === 'waiting' && lobby.players.length < 8
    );
  }
}

export const lobbyManager = new LobbyManager(); 