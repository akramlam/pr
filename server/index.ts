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
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true
  },
  transports: ['websocket'],
  allowEIO3: true
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

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('TEST_EVENT', { status: 'connected' });
  
  socket.on('HOST_GAME', (callback) => {
    console.log('Received HOST_GAME');
    callback({ sessionId: 'test-session-123' });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
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

io.engine.on("connection", (socket) => {
  socket.on("ping", (cb) => {
    if (typeof cb === "function") cb();
  });
  
  socket.transport.on("close", (reason) => {
    console.log(`Connection closed: ${reason}`);
  });
});

httpServer.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('Port 3001 is already in use!');
    process.exit(1);
  }
});

const port = Number(process.env.PORT) || 3001;
httpServer.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
}); 