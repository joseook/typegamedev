import React, { useState } from 'react';
import { Keyboard, Moon, Sun, Github, Award, Info, Menu, X } from 'lucide-react';
import Leaderboard from './Leaderboard';

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
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-40 py-3 px-4 md:px-6 flex justify-between items-center border-b ${isDarkMode ? 'border-gray-800 bg-gray-900/90 backdrop-blur-sm' : 'border-gray-200 bg-white/90 backdrop-blur-sm'}`}>
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
        <button
          onClick={() => setShowLeaderboard(true)}
          className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-800/50 rounded-md transition-colors"
          title="View top performers"
        >
          <Award className="h-5 w-5 text-yellow-400" />
          <span>Leaderboard</span>
        </button>

        <button
          onClick={() => setShowAbout(true)}
          className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-800/50 rounded-md transition-colors"
          title="About TypeGameDev"
        >
          <Info className="h-5 w-5 text-blue-400" />
          <span>About</span>
        </button>

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
            <button
              className="flex items-center justify-center space-x-2 px-4 py-3 w-64 hover:bg-gray-800/50 rounded-md transition-colors"
              onClick={() => {
                setIsMenuOpen(false);
                setShowLeaderboard(true);
              }}
            >
              <Award className="h-5 w-5 text-yellow-400" />
              <span>Leaderboard</span>
            </button>

            <button
              className="flex items-center space-x-2 px-6 py-3 hover:bg-gray-800/50 rounded-lg transition-colors"
              onClick={() => {
                setIsMenuOpen(false);
                setShowAbout(true);
              }}
            >
              <Info className="h-5 w-5 text-blue-400" />
              <span>About</span>
            </button>

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

      {/* Portals para os modais para evitar problemas de z-index */}
      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}>
          <div className="relative bg-gray-900 w-full max-w-4xl rounded-lg shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h2 className="text-xl font-bold flex items-center">
                <Award className="h-5 w-5 text-yellow-400 mr-2" />
                Leaderboard
              </h2>
              <button 
                onClick={() => setShowLeaderboard(false)}
                className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-2">
              <Leaderboard />
            </div>
          </div>
        </div>
      )}
      
      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}>
          <div className="relative bg-gray-900 w-full max-w-2xl rounded-lg shadow-xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h2 className="text-xl font-bold flex items-center">
                <Info className="h-5 w-5 text-blue-400 mr-2" />
                About TypeGameDev
              </h2>
              <button 
                onClick={() => setShowAbout(false)}
                className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">What is TypeGameDev?</h3>
                <p className="text-gray-300 leading-relaxed">
                  TypeGameDev is an educational platform designed to help developers improve their coding speed and accuracy. 
                  By practicing typing real code snippets in various programming languages, developers can enhance their 
                  productivity and reduce the cognitive overhead of typing, allowing them to focus more on problem-solving 
                  and creative coding aspects.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Educational Purpose</h3>
                <p className="text-gray-300 leading-relaxed">
                  Research shows that typing proficiency directly impacts a developer's productivity. TypeGameDev provides 
                  a focused environment where developers can practice typing code in a distraction-free interface, with 
                  real-time feedback on speed and accuracy. Regular practice with TypeGameDev can help reduce errors, 
                  increase coding speed, and build muscle memory for common programming patterns.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Features</h3>
                <ul className="list-disc pl-5 text-gray-300 space-y-1">
                  <li>Practice typing in multiple programming languages</li>
                  <li>Real-time speed (WPM) and accuracy tracking</li>
                  <li>Smart cursor positioning and line navigation</li>
                  <li>Leaderboard to compete with other developers</li>
                  <li>Dark mode for reduced eye strain</li>
                  <li>GitHub integration for account management</li>
                </ul>
              </div>
              
              <div className="pt-2 border-t border-gray-800">
                <p className="text-gray-400 text-sm">
                  <span className="font-medium">Created by:</span> <a href="https://github.com/joseook" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">joseook</a>
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  <span className="font-medium">Inspired by:</span> <a href="https://www.speedtyper.dev" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors">speedtyper.dev</a>
                </p>
                <p className="text-gray-400 text-sm mt-3">
                  TypeGameDev is currently in beta. Your feedback is valuable to us as we continue to improve the platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;