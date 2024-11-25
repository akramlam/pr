import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store';
import AuthForm from '../components/AuthForm';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUser } = useStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    setUser({
      id: '1',
      name: name || 'New User',
      email,
      role: 'player'
    });
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('register')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {t('registerPrompt')}
          </p>
        </div>

        <AuthForm
          type="register"
          onSubmit={handleSubmit}
          submitText={t('register')}
        />

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {t('haveAccount')}{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;