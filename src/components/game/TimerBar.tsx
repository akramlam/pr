import React from 'react';
import { Timer } from 'lucide-react';

interface TimerBarProps {
  timeLeft: number;
  totalTime: number;
}

const TimerBar: React.FC<TimerBarProps> = ({ timeLeft, totalTime }) => {
  const percentage = (timeLeft / totalTime) * 100;
  
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 
        transition-all duration-1000 ease-linear rounded-full"
        style={{ width: `${percentage}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center gap-1">
        <Timer className="h-3 w-3 text-gray-600 dark:text-gray-300" />
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
          {timeLeft}s
        </span>
      </div>
    </div>
  );
};

export default TimerBar;