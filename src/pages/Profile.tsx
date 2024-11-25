import React from 'react';
import { useTranslation } from 'react-i18next';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../hooks/useAuth';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <PageLayout>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {t('profile')}
      </h1>
      {user && (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">{t('name')}:</span> {user.name}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">{t('email')}:</span> {user.email}
          </p>
        </div>
      )}
    </PageLayout>
  );
};

export default Profile;