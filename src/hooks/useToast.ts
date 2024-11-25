import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type) => 
    set((state) => ({
      toasts: [
        ...state.toasts,
        { id: Math.random().toString(), message, type }
      ]
    })),
  removeToast: (id) => 
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }))
})); 