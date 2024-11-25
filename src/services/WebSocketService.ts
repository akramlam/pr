import { EventEmitter } from 'events';

export class WebSocketService extends EventEmitter {
  private ws: WebSocket | null = null;
  private reconnectTimer: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private url: string;
  private isConnecting = false;

  constructor(url: string) {
    super();
    this.url = url;
  }

  connect() {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) return;

    this.isConnecting = true;
    console.log('Connecting to WebSocket:', this.url);

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.scheduleReconnect();
    }
  }

  private handleOpen() {
    console.log('WebSocket connected');
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.emit('connected');

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private handleClose(event: CloseEvent) {
    console.log('WebSocket closed:', event.code, event.reason);
    this.isConnecting = false;
    this.ws = null;
    this.emit('disconnected');
    this.scheduleReconnect();
  }

  private handleError(error: Event) {
    console.error('WebSocket error:', error);
    this.emit('error', error);
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      this.emit('message', data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer || this.reconnectAttempts >= this.maxReconnectAttempts) {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.emit('maxReconnectAttemptsReached');
      }
      return;
    }

    this.reconnectTimer = window.setTimeout(() => {
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts}`);
      this.reconnectAttempts++;
      this.connect();
      this.reconnectTimer = null;
    }, this.reconnectDelay);
  }

  send(data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(data));
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        this.emit('error', error);
      }
    } else {
      console.warn('WebSocket not connected, message not sent:', data);
      this.emit('messageNotSent', data);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const createWebSocketService = (path: string) => {
  const url = `${import.meta.env.VITE_WS_URL}${path}`;
  return new WebSocketService(url);
}; 