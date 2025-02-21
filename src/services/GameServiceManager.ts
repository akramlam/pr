import type { GameService } from './GameService';
import type { GameSession } from '../types';

export class GameServiceManager {
  private services: Map<string, GameService> = new Map();
  private currentSession: string | null = null;
  private static instance: GameServiceManager;
  private activeSessions = new Map<string, GameSession>();
  private mountedComponents = new Set<string>();
  private transitioningServices = new Set<string>();

  private constructor() {}

  async hostGame(): Promise<{ sessionId: string; session: any }> {
    try {
      const service = new GameService();
      await service.connect();
      
      const result = await service.hostGame();
      const { sessionId, session } = result;

      this.services.set(sessionId, service);
      this.currentSession = sessionId;

      console.log('Setting service for session:', sessionId);
      console.log('Setting session:', sessionId, session);

      return result;
    } catch (error) {
      console.error('Failed to host game:', error);
      throw error;
    }
  }

  getCurrentSession(): string | null {
    return this.currentSession;
  }

  getService(sessionId: string): GameService | undefined {
    return this.services.get(sessionId);
  }

  static getInstance(): GameServiceManager {
    if (!GameServiceManager.instance) {
      GameServiceManager.instance = new GameServiceManager();
    }
    return GameServiceManager.instance;
  }

  setService(sessionId: string, service: GameService) {
    console.log('Setting service for session:', sessionId);
    this.services.set(sessionId, service);
  }

  removeService(sessionId: string) {
    console.log('Removing service for session:', sessionId);
    const service = this.services.get(sessionId);
    if (service) {
      service.disconnect();
      this.services.delete(sessionId);
    }
  }

  setSession(sessionId: string, session: GameSession) {
    console.log('Setting session:', sessionId, session);
    this.activeSessions.set(sessionId, session);
  }

  getSession(sessionId: string): GameSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  removeSession(sessionId: string) {
    this.activeSessions.delete(sessionId);
  }

  isComponentMounted(sessionId: string): boolean {
    return this.mountedComponents.has(sessionId);
  }

  mountComponent(sessionId: string) {
    console.log('Mounting component for session:', sessionId);
    this.mountedComponents.add(sessionId);
  }

  unmountComponent(sessionId: string) {
    console.log('Unmounting component for session:', sessionId);
    this.mountedComponents.delete(sessionId);
  }

  startTransition(fromSessionId: string, toSessionId: string) {
    console.log('Starting transition from', fromSessionId, 'to', toSessionId);
    this.transitioningServices.add(fromSessionId);
    this.transitioningServices.add(toSessionId);

    // Transfer session state
    const session = this.activeSessions.get(fromSessionId);
    if (session) {
      this.activeSessions.set(toSessionId, {...session, id: toSessionId});
      this.activeSessions.delete(fromSessionId);
    }

    // Service transfer
    const service = this.services.get(fromSessionId);
    if (service) {
      service.updateSessionId(toSessionId);
      this.services.set(toSessionId, service);
      this.services.delete(fromSessionId);
    }
  }

  endTransition(sessionId: string) {
    console.log('Ending transition for', sessionId);
    this.transitioningServices.delete(sessionId);
  }

  isTransitioning(sessionId: string): boolean {
    return this.transitioningServices.has(sessionId);
  }

  async preserveConnectionForNavigation(sessionId: string) {
    const service = this.getService(sessionId);
    if (service) {
      // Clone the existing socket connection
      const clonedSocket = service.socket;
      clonedSocket?.offAny(); // Remove all listeners
      
      // Create new service with cloned connection
      const newService = new GameService(sessionId, service.url);
      newService.socket = clonedSocket;
      
      // Update service registry
      this.services.set(sessionId, newService);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  cleanup(sessionId: string) {
    if (this.isTransitioning(sessionId)) {
      console.log('Delaying cleanup for transitioning session:', sessionId);
      setTimeout(() => this.cleanup(sessionId), 2000);
      return;
    }
    console.log('Cleaning up session:', sessionId);
    this.removeService(sessionId);
    this.removeSession(sessionId);
    this.unmountComponent(sessionId);
    this.endTransition(sessionId);
  }

  async handleNavigationTransition(oldSessionId: string, newSessionId: string) {
    const service = this.getService(oldSessionId);
    if (!service) return;

    // Transfer connection without closing
    service.transferConnection(newSessionId);
    
    // Update service registry
    this.services.set(newSessionId, service);
    this.services.delete(oldSessionId);
    
    // Preserve connection for 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('Transition completed for', newSessionId);
  }
}

export const gameServiceManager = GameServiceManager.getInstance(); 