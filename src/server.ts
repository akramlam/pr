import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Health check endpoint - Add this before WebSocket setup
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    connections: wss.clients.size,
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to check server status
app.get('/status', (req, res) => {
  res.json({
    uptime: process.uptime(),
    timestamp: Date.now(),
    connections: wss.clients.size,
    websocketServer: 'running'
  });
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');

  // Send immediate confirmation
  ws.send(JSON.stringify({ 
    type: 'CONNECTION_SUCCESS',
    message: 'Connected to game server'
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received message:', data);

      switch (data.type) {
        case 'HOST_GAME':
          const gameId = Math.random().toString(36).substring(7);
          console.log('Creating new game:', gameId);
          
          ws.send(JSON.stringify({
            type: 'HOST_GAME_SUCCESS',
            gameId,
            message: `Game ${gameId} created successfully`
          }));
          break;

        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(JSON.stringify({
        type: 'ERROR',
        message: 'Failed to process message'
      }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;

// Add error handling for the server
server.on('error', (error) => {
  console.error('Server error:', error);
});

server.listen(PORT, () => {
  console.log(`
Server is running:
- HTTP: http://localhost:${PORT}
- WebSocket: ws://localhost:${PORT}
- Health Check: http://localhost:${PORT}/health
- Status: http://localhost:${PORT}/status
  `);
});

export default server;