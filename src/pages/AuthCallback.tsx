import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { createSession } from '../lib/auth';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useStore();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      if (!code) {
        navigate('/login');
        return;
      }

      try {
        // Exchange code for tokens and user info
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });

        if (!response.ok) throw new Error('Authentication failed');

        const { user } = await response.json();
        const token = await createSession(user);
        
        setUser(user, token);
        navigate('/');
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;