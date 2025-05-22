import React, { useState, useEffect } from 'react';
import { Loader2, Code } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  const [loadingText, setLoadingText] = useState('Loading your coding challenge...');
  const loadingMessages = [
    'Loading your coding challenge...',
    'Preparing the editor...',
    'Fetching code snippets...',
    'Calibrating typing speed metrics...',
    'Almost ready...'
  ];

  useEffect(() => {
    // Rotate through loading messages every 2 seconds
    const interval = setInterval(() => {
      setLoadingText(prevText => {
        const currentIndex = loadingMessages.indexOf(prevText);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-950">
      <div className="flex flex-col items-center">
        <div className="bg-indigo-500/10 p-5 rounded-full mb-4">
          <Code className="h-10 w-10 text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">TypeGameDev</h1>
        <p className="text-gray-400 text-sm">Improve your coding speed with practice</p>
      </div>

      <div className="relative">
        <div className="absolute -inset-1 bg-indigo-500 rounded-lg opacity-20 blur-sm animate-pulse"></div>
        <div className="relative bg-gray-900 rounded-lg border border-indigo-500/30 p-8 flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-300 text-lg animate-pulse">{loadingText}</p>
        </div>
      </div>

      <div className="text-gray-500 text-sm mt-8 max-w-md text-center">
        <p>Test your typing skills in multiple programming languages and improve your coding speed.</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;