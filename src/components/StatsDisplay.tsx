import React from 'react';
import { Clock, Check, AlertCircle, Zap, Award } from 'lucide-react';

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

  // Calculate WPM rating (for display purposes)
  const getWpmRating = (wpm: number): string => {
    if (wpm < 20) return 'Beginner';
    if (wpm < 40) return 'Intermediate';
    if (wpm < 60) return 'Advanced';
    if (wpm < 80) return 'Professional';
    return 'Expert';
  };

  // Calculate progress percentage for the progress bars
  const getWpmProgress = (wpm: number): number => Math.min(wpm / 100 * 100, 100);
  const getAccuracyProgress = (accuracy: number): number => accuracy;

  // Get color based on accuracy
  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy < 70) return 'bg-red-500';
    if (accuracy < 90) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-300 mb-3 flex items-center">
        <Award className="h-5 w-5 mr-2 text-indigo-400" />
        Your Performance
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col shadow-sm border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Zap className="h-5 w-5" />
              <span className="text-sm font-medium">Speed</span>
            </div>
            <span className="text-xs text-gray-400">{getWpmRating(wpm)}</span>
          </div>
          <span className="text-2xl font-bold">{wpm.toFixed(0)} WPM</span>

          <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${getWpmProgress(wpm)}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col shadow-sm border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2 text-green-400">
              <Check className="h-5 w-5" />
              <span className="text-sm font-medium">Accuracy</span>
            </div>
            <span className="text-xs text-gray-400">{accuracy > 98 ? 'Perfect!' : accuracy > 90 ? 'Great!' : 'Improving'}</span>
          </div>
          <span className="text-2xl font-bold">{accuracy.toFixed(1)}%</span>

          <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
            <div
              className={`${getAccuracyColor(accuracy)} h-2 rounded-full transition-all duration-300 ease-out`}
              style={{ width: `${getAccuracyProgress(accuracy)}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col shadow-sm border border-gray-700">
          <div className="flex items-center space-x-2 mb-2 text-yellow-400">
            <Clock className="h-5 w-5" />
            <span className="text-sm font-medium">Time</span>
          </div>
          <span className="text-2xl font-bold">{isActive ? formatTime(time) : '0:00'}</span>
          <p className="text-xs text-gray-400 mt-3">Time elapsed since you started typing</p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col shadow-sm border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 mb-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Errors</span>
            </div>
            {errors > 0 && <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded-full">Fix these!</span>}
          </div>
          <span className="text-2xl font-bold">{errors}</span>
          <p className="text-xs text-gray-400 mt-3">
            {errors === 0 ? 'Perfect typing! No errors.' : `You have ${errors} character mistakes to fix.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;