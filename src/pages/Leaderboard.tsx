import React from 'react';
import { useTranslation } from 'react-i18next';
import PageLayout from '../components/PageLayout';

const Leaderboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <PageLayout>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {t('leaderboard')}
      </h1>
      {/* Add your leaderboard content here */}
    </PageLayout>
  );
};

export default Leaderboard;