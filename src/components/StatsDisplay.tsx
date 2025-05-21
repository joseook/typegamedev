import React from 'react';
import { Clock, Check, AlertCircle, Zap } from 'lucide-react';

interface StatsDisplayProps {
  wpm: number;
  accuracy: number;
  time: number;
  errors: number;
  isActive: boolean;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({
  wpm,
  accuracy,
  time,
  errors,
  isActive,
}) => {
  // Format time in seconds
  const formatTime = (timeInMs: number): string => {
    const seconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
        <div className="flex items-center space-x-2 mb-2 text-indigo-400">
          <Zap className="h-5 w-5" />
          <span className="text-sm font-medium">WPM</span>
        </div>
        <span className="text-2xl font-bold">{wpm.toFixed(0)}</span>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
        <div className="flex items-center space-x-2 mb-2 text-green-400">
          <Check className="h-5 w-5" />
          <span className="text-sm font-medium">Accuracy</span>
        </div>
        <span className="text-2xl font-bold">{accuracy.toFixed(1)}%</span>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
        <div className="flex items-center space-x-2 mb-2 text-yellow-400">
          <Clock className="h-5 w-5" />
          <span className="text-sm font-medium">Time</span>
        </div>
        <span className="text-2xl font-bold">{isActive ? formatTime(time) : '0:00'}</span>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center">
        <div className="flex items-center space-x-2 mb-2 text-red-400">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Errors</span>
        </div>
        <span className="text-2xl font-bold">{errors}</span>
      </div>
    </div>
  );
};

export default StatsDisplay;