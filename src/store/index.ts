import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../i18n';
import { verifySession } from '../lib/auth';
import type { User } from '../types';

// Helper function to safely access localStorage
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Failed to write to localStorage:', error);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: string;
  setUser: (user: User, token: string) => void;
  setLanguage: (lang: string) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      language: i18n.language || 'en',

      setUser: (user, token) => {
        safeStorage.setItem('token', token);
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          isLoading: false 
        });
      },

      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },

      logout: () => {
        safeStorage.removeItem('token');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      },

      checkAuth: async () => {
        set({ isLoading: true });
        
        try {
          const token = safeStorage.getItem('token');
          if (!token) {
            get().logout();
            return false;
          }

          const payload = await verifySession(token);
          if (!payload) {
            get().logout();
            return false;
          }

          set({
            user: {
              id: payload.sub as string,
              email: payload.email as string,
              name: payload.name as string,
              role: payload.role as 'player' | 'administrator',
            },
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return true;
        } catch (error) {
          console.error('Auth check failed:', error);
          get().logout();
          return false;
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const value = safeStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          safeStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          safeStorage.removeItem(name);
        },
      },
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        language: state.language,
      }),
    }
  )
);