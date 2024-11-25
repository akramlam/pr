import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import type { GameSession, GamePlayer, Question } from '../types';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

interface GameState {
  sessions: Map<string, GameSession>;
  connections: Map<string, WebSocket>;
}

const state: GameState = {
  sessions: new Map(),
  connections: new Map(),
};

wss.on('connection', (ws, req) => {
  const sessionId = req.url?.split('/').pop();
  const playerId = uuidv4();

  if (!sessionId) {
    ws.close();
    return;
  }

  // Store connection
  state.connections.set(playerId, ws);

  // Handle messages
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'JOIN_SESSION':
          handleJoinSession(sessionId, playerId, message.player);
          break;

        case 'PLAYER_READY':
          handlePlayerReady(sessionId, playerId, message.ready);
          break;

        case 'START_GAME':
          handleStartGame(sessionId, playerId);
          break;

        case 'SUBMIT_ANSWER':
          handleSubmitAnswer(sessionId, playerId, message.answerIndex);
          break;

        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  // Handle disconnection
  ws.on('close', () => {
    handlePlayerDisconnect(sessionId, playerId);
  });
});

function handleJoinSession(sessionId: string, playerId: string, player: GamePlayer) {
  let session = state.sessions.get(sessionId);

  if (!session) {
    // Create new session if it doesn't exist
    session = {
      id: sessionId,
      name: `Game ${sessionId}`,
      questionCount: 10,
      currentQuestion: 0,
      timeLimit: 30,
      difficulty: 'medium',
      players: [],
      questions: [], // We'll load these when the game starts
      status: 'waiting',
    };
    state.sessions.set(sessionId, session);
  }

  // Add player to session
  session.players.push({
    ...player,
    id: playerId,
    score: 0,
    streak: 0,
    multiplier: 1,
    answers: [],
    isReady: false,
    isHost: session.players.length === 0, // First player is host
  });

  // Notify all players in session
  broadcastToSession(sessionId, {
    type: 'SESSION_UPDATE',
    session,
  });
}

function handlePlayerReady(sessionId: string, playerId: string, ready: boolean) {
  const session = state.sessions.get(sessionId);
  if (!session) return;

  const player = session.players.find(p => p.id === playerId);
  if (!player) return;

  player.isReady = ready;

  broadcastToSession(sessionId, {
    type: 'SESSION_UPDATE',
    session,
  });
}

function handleStartGame(sessionId: string, playerId: string) {
  const session = state.sessions.get(sessionId);
  if (!session) return;

  const player = session.players.find(p => p.id === playerId);
  if (!player?.isHost) return;

  if (!session.players.every(p => p.isReady)) return;

  // Load questions and start game
  session.status = 'active';
  session.startTime = Date.now();
  session.currentQuestion = 0;

  // Send first question
  broadcastToSession(sessionId, {
    type: 'GAME_START',
    question: session.questions[0],
    timeLimit: session.timeLimit,
  });

  // Start question timer
  startQuestionTimer(sessionId);
}

function handleSubmitAnswer(sessionId: string, playerId: string, answerIndex: number) {
  const session = state.sessions.get(sessionId);
  if (!session || session.status !== 'active') return;

  const player = session.players.find(p => p.id === playerId);
  if (!player) return;

  // Record answer
  player.answers[session.currentQuestion] = answerIndex;

  // Check if all players have answered
  const allAnswered = session.players.every(p => 
    p.answers[session.currentQuestion] !== undefined
  );

  if (allAnswered) {
    moveToNextQuestion(sessionId);
  }
}

function handlePlayerDisconnect(sessionId: string, playerId: string) {
  state.connections.delete(playerId);

  const session = state.sessions.get(sessionId);
  if (!session) return;

  session.players = session.players.filter(p => p.id !== playerId);

  if (session.players.length === 0) {
    state.sessions.delete(sessionId);
    return;
  }

  // If host left, assign new host
  if (!session.players.some(p => p.isHost)) {
    session.players[0].isHost = true;
  }

  broadcastToSession(sessionId, {
    type: 'SESSION_UPDATE',
    session,
  });
}

function broadcastToSession(sessionId: string, message: any) {
  const session = state.sessions.get(sessionId);
  if (!session) return;

  session.players.forEach(player => {
    const connection = state.connections.get(player.id);
    if (connection?.readyState === WebSocket.OPEN) {
      connection.send(JSON.stringify(message));
    }
  });
}

function startQuestionTimer(sessionId: string) {
  const session = state.sessions.get(sessionId);
  if (!session) return;

  let timeLeft = session.timeLimit;

  const timer = setInterval(() => {
    timeLeft--;

    if (timeLeft <= 0) {
      clearInterval(timer);
      moveToNextQuestion(sessionId);
    } else {
      broadcastToSession(sessionId, {
        type: 'TIME_UPDATE',
        timeLeft,
      });
    }
  }, 1000);
}

function moveToNextQuestion(sessionId: string) {
  const session = state.sessions.get(sessionId);
  if (!session) return;

  const nextQuestion = session.currentQuestion + 1;

  if (nextQuestion >= session.questions.length) {
    // Game over
    session.status = 'finished';
    session.endTime = Date.now();

    broadcastToSession(sessionId, {
      type: 'GAME_OVER',
      session,
    });
  } else {
    session.currentQuestion = nextQuestion;

    broadcastToSession(sessionId, {
      type: 'NEXT_QUESTION',
      question: session.questions[nextQuestion],
      timeLimit: session.timeLimit,
    });

    startQuestionTimer(sessionId);
  }
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 