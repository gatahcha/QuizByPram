export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface UserAnswer {
  questionIndex: number;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeSpent?: number;
}

export interface QuizResult {
  quizTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  userAnswers: UserAnswer[];
  completedAt: Date;
}

export interface QuizFile {
  filename: string;
  quiz: Quiz;
}

export type ViewType = 'menu' | 'quiz' | 'results';

export interface AppState {
  currentView: ViewType;
  availableQuizzes: QuizFile[];
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  showExplanation: boolean;
  userAnswers: UserAnswer[];
  score: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface ScoreData {
  score: number;
  total: number;
  percentage: number;
  message: string;
}

