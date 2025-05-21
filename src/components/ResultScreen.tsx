import React from 'react';
import { TestResult } from '../types';
import { Trophy, RotateCcw, Share } from 'lucide-react';

interface ResultScreenProps {
  result: TestResult;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRestart }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-8 max-w-md mx-auto mt-8 border border-gray-800">
      <div className="flex justify-center mb-6">
        <Trophy className="h-16 w-16 text-yellow-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-6">Test Completed!</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between py-2 border-b border-gray-800">
          <span className="text-gray-400">Speed:</span>
          <span className="font-bold">{result.wpm.toFixed(1)} WPM</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-800">
          <span className="text-gray-400">Accuracy:</span>
          <span className="font-bold">{result.accuracy.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-800">
          <span className="text-gray-400">Time:</span>
          <span className="font-bold">{(result.time / 1000).toFixed(1)}s</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-800">
          <span className="text-gray-400">Errors:</span>
          <span className="font-bold">{result.errors}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-800">
          <span className="text-gray-400">Language:</span>
          <span className="font-bold">{result.language}</span>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={onRestart}
          className="flex-1 flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
        
        <button
          className="flex justify-center items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          <Share className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;