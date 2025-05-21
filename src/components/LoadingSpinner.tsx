import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-950">
      <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
      <p className="text-gray-400 text-lg">Loading your coding challenge...</p>
    </div>
  );
};

export default LoadingSpinner;