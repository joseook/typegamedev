import React, { useState, useEffect } from 'react';
import { languages } from './data/languages';
import { getRandomSnippet } from './data/snippets';
import { Snippet } from './types';
import { supabase, signInWithGitHub } from './lib/supabase';

// Components
import Header from './components/Header';
import LanguageSelector from './components/LanguageSelector';
import CodeEditor from './components/CodeEditor';
import StatsDisplay from './components/StatsDisplay';
import ResultScreen from './components/ResultScreen';
import LoadingSpinner from './components/LoadingSpinner';

// Hooks
import useTypingTest from './hooks/useTypingTest';

const App: React.FC = () => {
  // Try to load theme preference from localStorage
  const savedTheme = localStorage.getItem('theme') === 'light' ? false : true;
  const savedLanguage = localStorage.getItem('selectedLanguage') || 'javascript';

  const [isDarkMode, setIsDarkMode] = useState(savedTheme);
  const [selectedLanguage, setSelectedLanguage] = useState(savedLanguage);
  const [currentSnippet, setCurrentSnippet] = useState<Snippet | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false); // New state for game start

  const {
    currentInput,
    errors,
    isCompleted,
    wpm,
    accuracy,
    time,
    result,
    handleInputChange,
    resetTest
  } = useTypingTest(currentSnippet);

  // Initialize auth state and get user data
  useEffect(() => {
    // Check if user is already logged in on initial load
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      
      if (session?.user) {
        // Set user avatar and store it in localStorage for persistence
        const avatarUrl = session.user.user_metadata.avatar_url;
        setUserAvatar(avatarUrl);
        localStorage.setItem('userAvatar', avatarUrl);
        
        console.log('User logged in:', session.user.user_metadata.user_name || session.user.user_metadata.preferred_username);
      } else {
        // Try to get avatar from localStorage if exists
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) {
          setUserAvatar(savedAvatar);
        }
      }
    };
    
    checkInitialSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      
      if (session?.user) {
        const avatarUrl = session.user.user_metadata.avatar_url;
        setUserAvatar(avatarUrl);
        localStorage.setItem('userAvatar', avatarUrl);
      } else if (event === 'SIGNED_OUT') {
        setUserAvatar(undefined);
        localStorage.removeItem('userAvatar');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Save selected language to localStorage
  useEffect(() => {
    localStorage.setItem('selectedLanguage', selectedLanguage);
  }, [selectedLanguage]);

  // Change snippet when language changes
  useEffect(() => {
    const loadNewSnippet = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors when loading new snippet

      try {
        const newSnippet = getRandomSnippet(selectedLanguage);
        // If no snippet is found for this language, handle gracefully
        if (!newSnippet) {
          console.error(`No snippets found for language: ${selectedLanguage}`);
          setError(`No code snippets available for ${selectedLanguage}. Please try another language.`);
          setCurrentSnippet(null);
          return;
        }

        setCurrentSnippet(newSnippet);
      } catch (error) {
        console.error('Error loading snippet:', error);
        setError('Failed to load code snippet. Please try refreshing the page.');
        setCurrentSnippet(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadNewSnippet();
  }, [selectedLanguage]);

  // Effect to handle focusing the game on initial interaction
  useEffect(() => {
    // Only add listeners if the game hasn't started, not loading, and no error
    if (!gameStarted && !isLoading && !error) {
      const focusHandler = () => {
        setGameStarted(true);
      };

      window.addEventListener('keydown', focusHandler, { once: true });
      window.addEventListener('click', focusHandler, { once: true });

      return () => {
        window.removeEventListener('keydown', focusHandler);
        window.removeEventListener('click', focusHandler);
      };
    }
  }, [gameStarted, isLoading, error]);

  // Handle language selection
  const handleSelectLanguage = (language: string) => {
    if (language === selectedLanguage) {
      // If same language is selected, just refresh the snippet
      handleRestart();
      return;
    }

    setSelectedLanguage(language);
    resetTest();
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle GitHub login usando o helper que garante URL de redirecionamento correta
  const handleLogin = async () => {
    try {
      const { error } = await signInWithGitHub();
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  // Start a new test
  const handleRestart = () => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => { // Adding a slight delay for better UX
      try {
        const newSnippet = getRandomSnippet(selectedLanguage);
        if (!newSnippet) {
          setError(`No code snippets available for ${selectedLanguage}. Please try another language.`);
          setCurrentSnippet(null);
        } else {
          setCurrentSnippet(newSnippet);
        }
        resetTest();
      } catch (error) {
        console.error('Error restarting test:', error);
        setError('Failed to load a new code snippet. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900'}`}>
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        handleLogin={handleLogin}
        isLoggedIn={isLoggedIn}
        userAvatar={userAvatar}
      />

      <main className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center justify-center">
        {(() => { // IIFE for conditional rendering logic of main content
          if (error) {
            return (
              <div className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-md mb-6 flex items-center justify-between w-full max-w-3xl">
                <p>{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    // Optionally reset language or other states if error is critical
                    setSelectedLanguage('javascript'); 
                    // If snippet load failed for a language, user might want to retry or change.
                    // Triggering a reload of snippet for javascript:
                    const loadDefaultSnippet = async () => {
                        setIsLoading(true);
                        try {
                            const newSnippet = getRandomSnippet('javascript');
                            if (!newSnippet) {
                                setError(`No code snippets available for JavaScript.`);
                                setCurrentSnippet(null);
                            } else {
                                setCurrentSnippet(newSnippet);
                            }
                            resetTest(); // Reset typing state
                        } catch (e) {
                            setError('Failed to load JavaScript snippet.');
                        } finally {
                            setIsLoading(false);
                        }
                    };
                    loadDefaultSnippet();
                  }}
                  className="text-xs bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded"
                >
                  Try JavaScript & Retry
                </button>
              </div>
            );
          }

          // Show spinner if initial assets are loading and game hasn't started
          if (isLoading && !gameStarted) {
            return <LoadingSpinner />;
          }

          // Show "Click to focus" message if game hasn't started, and not loading/error
          if (!gameStarted) { // isLoading is false and error is null here
            return (
              <div className="text-center p-10">
                <p className="text-3xl text-gray-400 dark:text-gray-600">
                  Click or press any key to focus
                </p>
              </div>
            );
          }

          // Game has started (gameStarted is true)
          if (isCompleted && result) {
            return <ResultScreen result={result} onRestart={handleRestart} />;
          }

          // Game is active and not completed
          return (
            <div className="w-full max-w-3xl">
              <LanguageSelector
                languages={languages}
                selectedLanguage={selectedLanguage}
                onSelectLanguage={handleSelectLanguage}
              />
              {/* Show spinner if loading new snippet during active game (e.g., language change) */}
              {isLoading && <LoadingSpinner />}
              
              {!isLoading && currentSnippet && (
                <>
                  <StatsDisplay
                    wpm={wpm}
                    accuracy={accuracy}
                    time={time}
                    errors={errors}
                    isActive={currentInput.length > 0 && !isCompleted}
                  />
                  <CodeEditor
                    snippet={currentSnippet}
                    userInput={currentInput}
                    onInputChange={handleInputChange}
                    errors={errors}
                    isCompleted={isCompleted}
                    isDarkMode={isDarkMode} // Pass theme for potential editor styling
                  />
                </>
              )}
              {!isLoading && !currentSnippet && (
                <div className="text-center text-gray-500 mt-10">
                  <p>No code snippet loaded. Try selecting a language or refreshing.</p>
                </div>
              )}
            </div>
          );
        })()}
      </main>

      <footer className="py-6 border-t border-gray-800/20">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-2 sm:mb-0">
            <span className="font-medium text-indigo-400">TypeGameDev</span> — Improve your coding speed with practice
          </p>
          <p className="text-sm text-gray-500">
            Built with ❤️ for developers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;