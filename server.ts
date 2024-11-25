import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import { gameStateManager } from './src/services/GameStateManager';
import { verifySession } from './src/lib/auth';
import type { User, GamePlayer, Difficulty } from './src/types';

interface AuthenticatedRequest extends Request {
  user?: User;
}

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ 
  server,
  path: '/game'
});

// Store WebSocket connections
const connections = new Map<string, WebSocket>();

app.use(cors());
app.use(express.json());

// REST endpoints for game sessions
app.get('/api/games', (req, res) => {
  const activeGames = gameStateManager.getActiveGames();
  res.json(activeGames);
});

app.post('/api/games', (req: AuthenticatedRequest, res) => {
  const { difficulty } = req.body as { difficulty: Difficulty };
  const sessionId = gameStateManager.createSession(difficulty);
  res.json({ sessionId });
});

// WebSocket connection handler
wss.on('connection', (ws: WebSocket, req: Request) => {
  const sessionId = req.url?.split('/game/')[1];
  console.log('New WebSocket connection for session:', sessionId);

  if (!sessionId) {
    console.error('No session ID provided');
    ws.close();
    return;
  }

  // Set up event listeners for game state updates
  const eventHandlers = {
    sessionUpdate: (session: any) => {
      if (session.id === sessionId) {
        ws.send(JSON.stringify({
          type: 'SESSION_UPDATE',
          session
        }));
      }
    },
    gameStart: (data: any) => {
      if (data.session.id === sessionId) {
        ws.send(JSON.stringify({
          type: 'GAME_START',
          question: data.question,
          timeLimit: data.timeLimit
        }));
      }
    },
    timeUpdate: (data: any) => {
      if (data.sessionId === sessionId) {
        ws.send(JSON.stringify({
          type: 'TIME_UPDATE',
          timeLeft: data.timeLeft
        }));
      }
    },
    nextQuestion: (data: any) => {
      if (data.session.id === sessionId) {
        ws.send(JSON.stringify({
          type: 'NEXT_QUESTION',
          question: data.question,
          timeLimit: data.timeLimit
        }));
      }
    },
    gameOver: (session: any) => {
      if (session.id === sessionId) {
        ws.send(JSON.stringify({
          type: 'GAME_OVER',
          session
        }));
      }
    },
    chatMessage: (data: any) => {
      if (data.sessionId === sessionId) {
        ws.send(JSON.stringify({
          type: 'CHAT_MESSAGE',
          message: data.message
        }));
      }
    }
  };

  // Register event listeners
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    gameStateManager.on(event, handler);
  });

  // Handle incoming messages
  ws.on('message', (data: WebSocket.Data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('Received:', message);
      
      switch (message.type) {
        case 'JOIN_SESSION':
          handleJoinSession(sessionId, message.player, ws);
          break;

        case 'PLAYER_READY':
          handlePlayerReady(sessionId, message.playerId, message.ready);
          break;

        case 'START_GAME':
          handleStartGame(sessionId);
          break;

        case 'SUBMIT_ANSWER':
          handleSubmitAnswer(sessionId, message.playerId, message.answerIndex);
          break;

        case 'CHAT_MESSAGE':
          handleChatMessage(sessionId, message.playerId, message.playerName, message.text);
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(JSON.stringify({
        type: 'ERROR',
        message: 'Failed to process message'
      }));
    }
  });

  // Handle disconnection
  ws.on('close', () => {
    // Remove event listeners
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      gameStateManager.off(event, handler);
    });

    handlePlayerDisconnect(sessionId, ws);
  });
});

// Message handlers
function handleJoinSession(sessionId: string, player: GamePlayer, ws: WebSocket) {
  connections.set(player.id, ws);
  gameStateManager.addPlayer(sessionId, player);
}

function handlePlayerReady(sessionId: string, playerId: string, ready: boolean) {
  const session = gameStateManager.getSession(sessionId);
  if (!session) return;

  const player = session.players.find(p => p.id === playerId);
  if (!player) return;

  player.isReady = ready;
  gameStateManager.updateSession(session);
}

function handleStartGame(sessionId: string) {
  gameStateManager.startGame(sessionId);
}

function handleSubmitAnswer(sessionId: string, playerId: string, answerIndex: number) {
  gameStateManager.submitAnswer(sessionId, playerId, answerIndex);
}

function handleChatMessage(sessionId: string, playerId: string, playerName: string, text: string) {
  gameStateManager.sendChatMessage(sessionId, playerId, playerName, text);
}

function handlePlayerDisconnect(sessionId: string, ws: WebSocket) {
  const playerId = Array.from(connections.entries())
    .find(([_, conn]) => conn === ws)?.[0];

  if (playerId) {
    connections.delete(playerId);
    gameStateManager.removePlayer(sessionId, playerId);
  }
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 