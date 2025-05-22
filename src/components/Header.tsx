import React, { useState } from 'react';
import { Keyboard, Moon, Sun, Github, Award, Info, Menu, X } from 'lucide-react';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-50 py-3 px-4 md:px-6 flex justify-between items-center border-b ${isDarkMode ? 'border-gray-800 bg-gray-900/90 backdrop-blur-sm' : 'border-gray-200 bg-white/90 backdrop-blur-sm'}`}>
      <div className="flex items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-500/10 p-2 rounded-lg">
            <Keyboard className="h-6 w-6 text-indigo-500" />
          </div>
          <h1 className="text-xl font-mono font-bold flex items-center">
            <span className="hidden sm:inline">Type</span>
            <span className="text-indigo-500">Game</span>
            <span className="hidden sm:inline">Dev</span>
          </h1>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="md:hidden flex items-center p-2 rounded-md hover:bg-gray-800/50 transition-colors"
      >
        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center space-x-4">
        <a
          href="#"
          className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-800/50 rounded-md transition-colors"
          title="View top performers"
        >
          <Award className="h-5 w-5 text-yellow-400" />
          <span>Leaderboard</span>
        </a>

        <a
          href="#"
          className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-800/50 rounded-md transition-colors"
          title="About TypeGameDev"
        >
          <Info className="h-5 w-5 text-blue-400" />
          <span>About</span>
        </a>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-indigo-400" />}
        </button>

        {isLoggedIn ? (
          <div className="flex items-center space-x-2 px-2 py-1 rounded-full bg-gray-800/50">
            {userAvatar && (
              <img
                src={userAvatar}
                alt="User avatar"
                className="w-8 h-8 rounded-full border-2 border-indigo-500"
              />
            )}
            <span className="text-sm font-medium mr-1">Account</span>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-sm hover:shadow"
          >
            <Github className="h-5 w-5" />
            <span>Login with GitHub</span>
          </button>
        )}
      </div>

      {/* Mobile menu (overlay) */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 pt-16 bg-gray-900/95 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-6 pt-10">
            <a
              href="#"
              className="flex items-center space-x-2 px-6 py-3 hover:bg-gray-800/50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Award className="h-5 w-5 text-yellow-400" />
              <span>Leaderboard</span>
            </a>

            <a
              href="#"
              className="flex items-center space-x-2 px-6 py-3 hover:bg-gray-800/50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Info className="h-5 w-5 text-blue-400" />
              <span>About</span>
            </a>

            <button
              onClick={() => {
                toggleDarkMode();
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 px-6 py-3 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              {isDarkMode ? (
                <>
                  <Sun className="h-5 w-5 text-yellow-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 text-indigo-400" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {isLoggedIn ? (
              <div
                className="flex items-center space-x-3 px-6 py-3 rounded-lg bg-gray-800/50"
                onClick={() => setIsMenuOpen(false)}
              >
                {userAvatar && (
                  <img
                    src={userAvatar}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full border-2 border-indigo-500"
                  />
                )}
                <span className="font-medium">My Account</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleLogin();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors w-3/4 justify-center"
              >
                <Github className="h-5 w-5" />
                <span>Login with GitHub</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;