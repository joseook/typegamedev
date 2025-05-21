import { useState, useEffect, useCallback } from 'react';
import { Snippet, TestResult, TypingState } from '../types';
import { generateTestResult } from '../utils/typingUtils';

const useTypingTest = (snippet: Snippet | null) => {
  const [typingState, setTypingState] = useState<TypingState>({
    currentInput: '',
    errors: 0,
    startTime: null,
    endTime: null,
    completed: false
  });
  
  const [result, setResult] = useState<TestResult | null>(null);
  const [currentWpm, setCurrentWpm] = useState(0);
  const [currentAccuracy, setCurrentAccuracy] = useState(100);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Reset the typing test
  const resetTest = useCallback(() => {
    setTypingState({
      currentInput: '',
      errors: 0,
      startTime: null,
      endTime: null,
      completed: false
    });
    setResult(null);
    setCurrentWpm(0);
    setCurrentAccuracy(100);
    setElapsedTime(0);
  }, []);
  
  // Start a new test with a different snippet
  useEffect(() => {
    resetTest();
  }, [snippet, resetTest]);
  
  // Handle input changes
  const handleInputChange = useCallback((input: string) => {
    if (!snippet || typingState.completed) return;
    
    const now = Date.now();
    const newState = { ...typingState, currentInput: input };
    
    // Start the timer if this is the first input
    if (!typingState.startTime && input.length > 0) {
      newState.startTime = now;
    }
    
    // Calculate errors
    let errors = 0;
    for (let i = 0; i < input.length; i++) {
      if (i >= snippet.code.length || input[i] !== snippet.code[i]) {
        errors++;
      }
    }
    newState.errors = errors;
    
    // Check if the test is completed
    if (input.length === snippet.code.length) {
      newState.completed = true;
      newState.endTime = now;
      
      // Generate final result
      if (newState.startTime) {
        const testResult = generateTestResult(
          snippet.code,
          input,
          newState.startTime,
          now,
          snippet.language,
          snippet.id
        );
        setResult(testResult);
      }
    }
    
    setTypingState(newState);
  }, [typingState, snippet]);
  
  // Update real-time stats
  useEffect(() => {
    if (!snippet || !typingState.startTime || typingState.completed) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      setElapsedTime(now - typingState.startTime);
      
      // Calculate current WPM
      const timeInMinutes = (now - typingState.startTime) / 60000;
      const standardWordLength = 5;
      const charactersTyped = typingState.currentInput.length;
      const wordsTyped = charactersTyped / standardWordLength;
      const currentWpm = timeInMinutes > 0 ? wordsTyped / timeInMinutes : 0;
      setCurrentWpm(currentWpm);
      
      // Calculate current accuracy
      let correctChars = 0;
      for (let i = 0; i < typingState.currentInput.length; i++) {
        if (snippet.code[i] === typingState.currentInput[i]) {
          correctChars++;
        }
      }
      
      const accuracy = typingState.currentInput.length > 0 
        ? (correctChars / typingState.currentInput.length) * 100 
        : 100;
      
      setCurrentAccuracy(accuracy);
    }, 500);
    
    return () => clearInterval(interval);
  }, [typingState, snippet]);
  
  return {
    currentInput: typingState.currentInput,
    errors: typingState.errors,
    isCompleted: typingState.completed,
    wpm: currentWpm,
    accuracy: currentAccuracy,
    time: elapsedTime,
    result,
    handleInputChange,
    resetTest
  };
};

export default useTypingTest;