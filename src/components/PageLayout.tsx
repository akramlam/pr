import React from 'react';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`max-w-7xl mx-auto p-6 ${className}`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {children}
      </div>
    </motion.div>
  );
};

export default PageLayout; 