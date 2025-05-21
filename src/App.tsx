import React, { useState, useEffect } from 'react';
import { languages } from './data/languages';
import { getRandomSnippet } from './data/snippets';
import { Snippet } from './types';
import { supabase } from './lib/supabase';

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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [currentSnippet, setCurrentSnippet] = useState<Snippet | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
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

  // Initialize auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        setUserAvatar(session.user.user_metadata.avatar_url);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Change snippet when language changes
  useEffect(() => {
    setIsLoading(true);
    const newSnippet = getRandomSnippet(selectedLanguage);
    setCurrentSnippet(newSnippet);
    setIsLoading(false);
  }, [selectedLanguage]);

  // Handle language selection
  const handleSelectLanguage = (language: string) => {
    setSelectedLanguage(language);
    resetTest();
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle GitHub login
  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  // Start a new test
  const handleRestart = () => {
    setIsLoading(true);
    setCurrentSnippet(getRandomSnippet(selectedLanguage));
    resetTest();
    setIsLoading(false);
  };

  if (isLoading || !currentSnippet) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900'}`}>
      <Header 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        handleLogin={handleLogin}
        isLoggedIn={isLoggedIn}
        userAvatar={userAvatar}
      />

      <main className="container mx-auto px-4 py-8">
        {isCompleted && result ? (
          <ResultScreen result={result} onRestart={handleRestart} />
        ) : (
          <>
            <LanguageSelector 
              languages={languages}
              selectedLanguage={selectedLanguage}
              onSelectLanguage={handleSelectLanguage}
            />

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
            />

            <div className="text-center mt-6 text-gray-400 text-sm">
              <p>Start typing to begin the test. Press Tab to restart.</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;