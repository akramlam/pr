import React from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { googleSignIn } from '../lib/auth';
import FormField from './FormField';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitText: string;
  error?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, submitText, error }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-6">
        {type === 'register' && (
          <FormField
            id="name"
            name="name"
            type="text"
            label={t('name')}
            icon={User}
            required
            autoComplete="name"
          />
        )}
        
        <FormField
          id="email"
          name="email"
          type="email"
          label={t('email')}
          icon={Mail}
          required
          autoComplete="email"
        />
        
        <FormField
          id="password"
          name="password"
          type="password"
          label={t('password')}
          icon={Lock}
          required
          autoComplete={type === 'login' ? 'current-password' : 'new-password'}
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 
            hover:from-indigo-700 hover:to-purple-700 text-white font-medium
            py-3 px-4 rounded-lg shadow-md transition-colors"
        >
          {submitText}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
            {t('or')}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={googleSignIn}
        className="w-full flex items-center justify-center gap-3 
          bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 
          py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 
          hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {t('continueWithGoogle')}
      </button>
    </div>
  );
};

export default AuthForm;