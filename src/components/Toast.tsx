import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const toastStyles = {
  success: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  error: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
};

const Toast: React.FC = () => {
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    toasts.forEach(toast => {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [toasts, removeToast]);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => {
          const Icon = toastIcons[toast.type];

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`flex items-center gap-2 p-4 rounded-lg shadow-lg ${toastStyles[toast.type]}`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-auto p-1 hover:opacity-70 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toast; 