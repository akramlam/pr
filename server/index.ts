import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import type { GameSession, GamePlayer } from '../src/types';

interface ServerToClientEvents {
  CONNECTED: (data: { playerId: string }) => void;
  HOST_GAME_SUCCESS: (data: { sessionId: string; session: GameSession }) => void;
  JOIN_GAME_SUCCESS: (data: { sessionId: string; session: GameSession }) => void;
  SESSION_UPDATE: (data: { session: GameSession }) => void;
  GAME_STARTED: (data: { session: GameSession }) => void;
  QUESTION_STARTED: (data: { question: { text: string; options: string[] }; timeLimit: number }) => void;
  ANSWER_RESULT: (data: { correct: boolean; score: number }) => void;
  ERROR: (data: { message: string }) => void;
}

interface ClientToServerEvents {
  HOST_GAME: () => void;
  JOIN_GAME: (data: { sessionId: string; player: Partial<GamePlayer> }) => void;
  PLAYER_READY: (data: { ready: boolean }) => void;
  START_GAME: () => void;
  SUBMIT_ANSWER: (data: { answer: number }) => void;
  disconnect: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  playerId: string;
}

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

interface ServerState {
  sessions: Map<string, GameSession>;
  playerSessions: Map<string, string>;
}

const state: ServerState = {
  sessions: new Map(),
  playerSessions: new Map()
};

function cleanupPlayerConnections(playerId: string) {
  const sessionId = state.playerSessions.get(playerId);
  if (sessionId) {
    const session = state.sessions.get(sessionId);
    if (session) {
      session.players = session.players.filter(p => p.id !== playerId);
      if (session.players.length === 0) {
        state.sessions.delete(sessionId);
      } else {
        // If the host left, assign a new host
        if (!session.players.some(p => p.isHost)) {
          session.players[0].isHost = true;
        }
        // Notify remaining players
        io.to(sessionId).emit('SESSION_UPDATE', { session });
      }
    }
    state.playerSessions.delete(playerId);
  }
}

io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
  const playerId = uuidv4();
  console.log('New connection, player ID:', playerId);

  socket.data.playerId = playerId;

  socket.on('HOST_GAME', () => {
    try {
      const sessionId = uuidv4();
      console.log(`Creating new game session: ${sessionId}`);

      // Create new session with host player
      const session: GameSession = {
        id: sessionId,
        players: [{
          id: playerId,
          name: `Player ${playerId.slice(0, 4)}`,
          isHost: true,
          ready: false,
          score: 0
        }],
        status: 'waiting'
      };

      state.sessions.set(sessionId, session);
      state.playerSessions.set(playerId, sessionId);
      socket.join(sessionId);

      console.log(`Session ${sessionId} created with host ${playerId}`);
      console.log('Current sessions:', Array.from(state.sessions.keys()));
      console.log('Current player sessions:', Array.from(state.playerSessions.entries()));

      socket.emit('HOST_GAME_SUCCESS', {
        sessionId,
        session
      });
    } catch (error) {
      console.error('Error handling HOST_GAME:', error);
      socket.emit('ERROR', { message: 'Failed to create game' });
    }
  });

  socket.on('JOIN_GAME', ({ sessionId, player }) => {
    try {
      const session = state.sessions.get(sessionId);
      if (!session) {
        socket.emit('ERROR', { message: 'Session not found' });
        return;
      }

      // Add new player to session
      const newPlayer: GamePlayer = {
        id: playerId,
        name: player.name || `Player ${playerId.slice(0, 4)}`,
        isHost: false,
        ready: false,
        score: 0
      };

      session.players.push(newPlayer);
      state.playerSessions.set(playerId, sessionId);
      socket.join(sessionId);

      socket.emit('JOIN_GAME_SUCCESS', {
        sessionId,
        session
      });

      // Notify all players of the update
      io.to(sessionId).emit('SESSION_UPDATE', { session });
    } catch (error) {
      console.error('Error handling JOIN_GAME:', error);
      socket.emit('ERROR', { message: 'Failed to join game' });
    }
  });

  socket.on('PLAYER_READY', ({ ready }) => {
    try {
      const sessionId = state.playerSessions.get(playerId);
      if (!sessionId) return;

      const session = state.sessions.get(sessionId);
      if (!session) return;

      const player = session.players.find(p => p.id === playerId);
      if (!player) return;

      player.ready = ready;
      io.to(sessionId).emit('SESSION_UPDATE', { session });
    } catch (error) {
      console.error('Error handling PLAYER_READY:', error);
      socket.emit('ERROR', { message: 'Failed to update ready status' });
    }
  });

  socket.on('START_GAME', () => {
    try {
      const sessionId = state.playerSessions.get(playerId);
      if (!sessionId) return;

      const session = state.sessions.get(sessionId);
      if (!session) return;

      const player = session.players.find(p => p.id === playerId);
      if (!player || !player.isHost) return;

      if (!session.players.every(p => p.ready)) return;
      if (session.players.length < 2) return;

      session.status = 'playing';
      session.currentRound = 0;
      session.totalRounds = 10;

      io.to(sessionId).emit('GAME_STARTED', { session });
      startNewRound(sessionId);
    } catch (error) {
      console.error('Error handling START_GAME:', error);
      socket.emit('ERROR', { message: 'Failed to start game' });
    }
  });

  socket.on('SUBMIT_ANSWER', ({ answer }) => {
    try {
      const sessionId = state.playerSessions.get(playerId);
      if (!sessionId) return;

      const session = state.sessions.get(sessionId);
      if (!session || session.status !== 'playing') return;

      // TODO: Implement answer handling
      socket.emit('ANSWER_RESULT', {
        correct: true,
        score: 100
      });
    } catch (error) {
      console.error('Error handling SUBMIT_ANSWER:', error);
      socket.emit('ERROR', { message: 'Failed to submit answer' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', playerId);
    cleanupPlayerConnections(playerId);
  });
});

function startNewRound(sessionId: string) {
  const session = state.sessions.get(sessionId);
  if (!session) return;

  // TODO: Implement round handling
  io.to(sessionId).emit('QUESTION_STARTED', {
    question: {
      text: 'Sample question',
      options: ['A', 'B', 'C', 'D']
    },
    timeLimit: 30
  });
}

const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 