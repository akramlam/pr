// Custom EventEmitter implementation
class EventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
    return this;
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return;
    this.events[event].forEach(callback => callback(...args));
    return this;
  }

  removeListener(event: string, callback: Function) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(cb => cb !== callback);
    return this;
  }
}

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

class WebSocketClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private url: string;
  private callbacks: Map<string, Function[]> = new Map();

  constructor(url: string) {
    super();
    this.url = url;
    console.log('WebSocket client created for:', url);
  }

  connect() {
    console.log('Attempting connection to:', this.url);
    
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.emit('connected');
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.emit('disconnected');
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Received message:', message);
          
          this.emit('message', message);
          
          if (message.type) {
            this.emit(message.type, message);
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
    }
  }

  on(event: string, callback: Function) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)?.push(callback);
  }

  emit(event: string, data?: any) {
    console.log('Emitting event:', event, data);
    const callbacks = this.callbacks.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('Sending message:', message);
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected. State:', this.ws?.readyState);
    }
  }

  disconnect() {
    if (this.ws) {
      console.log('Disconnecting WebSocket');
      this.ws.close();
      this.ws = null;
    }
  }
}

export const createWebSocketClient = (path: string = '') => {
  const wsUrl = `ws://localhost:3001${path}`;
  console.log('Creating WebSocket client with URL:', wsUrl);
  return new WebSocketClient(wsUrl);
}; 