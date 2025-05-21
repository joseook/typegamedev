import { TestResult } from '../types';

// Calculate Words Per Minute
export const calculateWPM = (
  text: string,
  timeInMilliseconds: number
): number => {
  // Standard word length is considered 5 characters
  const standardWordLength = 5;
  const characters = text.length;
  const minutes = timeInMilliseconds / 60000; // Convert ms to minutes
  const words = characters / standardWordLength;
  
  return words / minutes;
};

// Calculate accuracy percentage
export const calculateAccuracy = (
  targetText: string,
  typedText: string
): number => {
  let correctChars = 0;
  const minLength = Math.min(targetText.length, typedText.length);
  
  for (let i = 0; i < minLength; i++) {
    if (targetText[i] === typedText[i]) {
      correctChars++;
    }
  }
  
  return (correctChars / targetText.length) * 100;
};

// Count errors in typing
export const countErrors = (
  targetText: string,
  typedText: string
): number => {
  let errors = 0;
  const minLength = Math.min(targetText.length, typedText.length);
  
  for (let i = 0; i < minLength; i++) {
    if (targetText[i] !== typedText[i]) {
      errors++;
    }
  }
  
  // Also count missing or extra characters as errors
  errors += Math.abs(targetText.length - typedText.length);
  
  return errors;
};

// Generate test result
export const generateTestResult = (
  targetText: string,
  typedText: string,
  startTime: number,
  endTime: number,
  language: string,
  snippetId: string
): TestResult => {
  const timeInMs = endTime - startTime;
  const wpm = calculateWPM(typedText, timeInMs);
  const accuracy = calculateAccuracy(targetText, typedText);
  const errors = countErrors(targetText, typedText);
  
  return {
    wpm,
    accuracy,
    time: timeInMs,
    errors,
    language,
    snippetId
  };
};