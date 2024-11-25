import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  total, 
  color = 'bg-indigo-600 dark:bg-indigo-500' 
}) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-1000 ease-linear`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;