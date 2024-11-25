import React, { useEffect } from 'react';
import { useStore } from '../store';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { checkAuth, isLoading, isAuthenticated } = useStore();

  useEffect(() => {
    console.log('AuthProvider mounted');
    checkAuth().then(() => {
      console.log('Auth check completed');
      console.log('Auth state:', { isAuthenticated, isLoading });
    });
  }, [checkAuth]);

  if (isLoading) {
    console.log('AuthProvider loading');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  console.log('AuthProvider rendering children');
  return <>{children}</>;
}; 