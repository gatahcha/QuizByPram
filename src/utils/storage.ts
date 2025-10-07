import { QuizResult } from '../types/quiz.ts';

const STORAGE_KEY = 'quizbypram-history';

export interface QuizHistory {
  results: QuizResult[];
  lastAccessed: Date;
}

export function saveResult(result: QuizResult): void {
  try {
    const history = getHistory();
    history.results.push(result);
    history.lastAccessed = new Date();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save quiz result:', error);
  }
}

export function getHistory(): QuizHistory {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        results: parsed.results || [],
        lastAccessed: new Date(parsed.lastAccessed || Date.now())
      };
    }
  } catch (error) {
    console.error('Failed to load quiz history:', error);
  }

  return {
    results: [],
    lastAccessed: new Date()
  };
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
}

