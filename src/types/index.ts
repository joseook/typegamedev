export interface Snippet {
  id: string;
  code: string;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
}

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  stats: UserStats;
}

export interface UserStats {
  averageWpm: number;
  averageAccuracy: number;
  totalTests: number;
  languageStats: Record<string, LanguageStat>;
}

export interface LanguageStat {
  averageWpm: number;
  averageAccuracy: number;
  testsCompleted: number;
  bestWpm: number;
}

export interface TestResult {
  wpm: number;
  accuracy: number;
  time: number;
  errors: number;
  language: string;
  snippetId: string;
}

export interface TypingState {
  currentInput: string;
  errors: number;
  startTime: number | null;
  endTime: number | null;
  completed: boolean;
}

export type LanguageOption = {
  id: string;
  name: string;
  icon: string;
};