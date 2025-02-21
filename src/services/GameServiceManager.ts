import type { GameService } from './GameService';
import type { GameSession } from '../types';

class GameServiceManager {
  private static instance: GameServiceManager;
  private activeServices = new Map<string, GameService>();
  private activeSessions = new Map<string, GameSession>();
  private mountedComponents = new Set<string>();
  private transitioningServices = new Set<string>();

  private constructor() {}

  static getInstance(): GameServiceManager {
    if (!GameServiceManager.instance) {
      GameServiceManager.instance = new GameServiceManager();
    }
    return GameServiceManager.instance;
  }

  setService(sessionId: string, service: GameService) {
    console.log('Setting service for session:', sessionId);
    this.activeServices.set(sessionId, service);
  }

  getService(sessionId: string): GameService | undefined {
    return this.activeServices.get(sessionId);
  }

  removeService(sessionId: string) {
    console.log('Removing service for session:', sessionId);
    const service = this.activeServices.get(sessionId);
    if (service) {
      service.disconnect();
      this.activeServices.delete(sessionId);
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
    
    // Transfer the service from 'new' to the actual session ID
    if (fromSessionId === 'new') {
      const service = this.activeServices.get(fromSessionId);
      if (service) {
        this.setService(toSessionId, service);
        this.activeServices.delete(fromSessionId);
      }
    }
  }

  endTransition(sessionId: string) {
    console.log('Ending transition for', sessionId);
    this.transitioningServices.delete(sessionId);
  }

  isTransitioning(sessionId: string): boolean {
    return this.transitioningServices.has(sessionId);
  }

  cleanup(sessionId: string) {
    console.log('Cleaning up session:', sessionId);
    if (this.isTransitioning(sessionId)) {
      console.log('Skipping cleanup for transitioning session:', sessionId);
      return;
    }

    this.removeService(sessionId);
    this.removeSession(sessionId);
    this.unmountComponent(sessionId);
    this.endTransition(sessionId);
  }
}

export const gameServiceManager = GameServiceManager.getInstance(); 