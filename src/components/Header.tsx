import React from 'react';
import { Keyboard, Moon, Sun, Github } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  handleLogin: () => void;
  isLoggedIn: boolean;
  userAvatar?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  isDarkMode, 
  toggleDarkMode, 
  handleLogin, 
  isLoggedIn,
  userAvatar
}) => {
  return (
    <header className="p-4 flex justify-between items-center border-b border-gray-800">
      <div className="flex items-center space-x-2">
        <Keyboard className="h-6 w-6 text-indigo-500" />
        <h1 className="text-xl font-mono font-bold">codetyper.dev</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {isLoggedIn ? (
          <div className="flex items-center space-x-2">
            {userAvatar && (
              <img 
                src={userAvatar} 
                alt="User avatar" 
                className="w-8 h-8 rounded-full"
              />
            )}
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
          >
            <Github className="h-5 w-5" />
            <span>Login with GitHub</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;