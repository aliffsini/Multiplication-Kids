export interface QuizSettings {
  selectedTables: number[];
  questionCount: number;
  timerEnabled: boolean;
  timePerQuestion: number;
}

export interface Question {
  id: string;
  multiplicand: number;
  multiplier: number;
  answer: number;
  userAnswer?: number;
  isCorrect?: boolean;
  timeSpent?: number;
}

export interface QuizState {
  settings: QuizSettings;
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  isComplete: boolean;
  startTime: number;
  endTime?: number;
}

export type DifficultyPreset = 'easy' | 'medium' | 'hard' | 'extreme' | 'special';

export interface DifficultyConfig {
  name: string;
  tables: number[];
  icon: string;
  colorClass: string;
}

export const DIFFICULTY_PRESETS: Record<DifficultyPreset, DifficultyConfig> = {
  easy: {
    name: 'Easy',
    tables: [2, 3, 4],
    icon: '🌱',
    colorClass: 'bg-green-100 hover:bg-green-200 text-green-700'
  },
  medium: {
    name: 'Medium',
    tables: [5, 6, 7],
    icon: '🔥',
    colorClass: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
  },
  hard: {
    name: 'Hard',
    tables: [8, 9, 12],
    icon: '💎',
    colorClass: 'bg-red-100 hover:bg-red-200 text-red-700'
  },
  extreme: {
    name: 'Extreme',
    tables: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    icon: '👑',
    colorClass: 'bg-purple-100 hover:bg-purple-200 text-purple-700'
  },
  special: {
    name: 'Special',
    tables: [3, 4, 5, 6, 7, 8, 9, 12],
    icon: '⭐',
    colorClass: 'bg-gradient-to-r from-indigo-100 to-violet-100 hover:from-indigo-200 hover:to-violet-200 text-indigo-700'
  }
};
