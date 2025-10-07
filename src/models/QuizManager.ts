import { AppState, Quiz, QuizFile, UserAnswer, ViewType } from '../types/quiz.ts';
import { loadLocalQuizzes, loadQuizFromFile } from '../utils/quizLoader.ts';
import { validateQuizJSON } from '../utils/quizValidator.ts';
import { saveResult } from '../utils/storage.ts';

export class QuizManager {
  private state: AppState;
  private listeners: Set<(state: AppState) => void>;

  constructor() {
    this.state = this.getInitialState();
    this.listeners = new Set();
  }

  private getInitialState(): AppState {
    return {
      currentView: 'menu',
      availableQuizzes: [],
      currentQuiz: null,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showExplanation: false,
      userAnswers: [],
      score: 0,
    };
  }

  getState(): AppState {
    return { ...this.state };
  }

  setState(updates: Partial<AppState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  async loadLocalQuizzes(): Promise<void> {
    try {
      const quizzes = await loadLocalQuizzes();
      this.setState({ availableQuizzes: quizzes });
    } catch (error) {
      console.error('Failed to load local quizzes:', error);
    }
  }

  async loadQuizFromFile(file: File): Promise<Quiz> {
    return loadQuizFromFile(file);
  }

  startQuiz(quiz: Quiz): void {
    this.setState({
      currentView: 'quiz',
      currentQuiz: quiz,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showExplanation: false,
      userAnswers: [],
      score: 0,
    });
  }

  selectAnswer(index: number): void {
    if (!this.state.showExplanation) {
      this.setState({ selectedAnswer: index });
    }
  }

  submitAnswer(): void {
    const { currentQuiz, currentQuestionIndex, selectedAnswer } = this.state;
    
    if (currentQuiz === null || selectedAnswer === null) {
      return;
    }

    const question = currentQuiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    const userAnswer: UserAnswer = {
      questionIndex: currentQuestionIndex,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
    };

    const newUserAnswers = [...this.state.userAnswers, userAnswer];
    const newScore = isCorrect ? this.state.score + 1 : this.state.score;

    this.setState({
      userAnswers: newUserAnswers,
      score: newScore,
      showExplanation: true,
    });
  }

  nextQuestion(): void {
    const { currentQuiz, currentQuestionIndex } = this.state;
    
    if (currentQuiz === null) {
      return;
    }

    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex >= currentQuiz.questions.length) {
      // Quiz completed, save result and show results view
      this.completeQuiz();
    } else {
      this.setState({
        currentQuestionIndex: nextIndex,
        selectedAnswer: null,
        showExplanation: false,
      });
    }
  }

  private completeQuiz(): void {
    const { currentQuiz, userAnswers, score } = this.state;
    
    if (currentQuiz === null) {
      return;
    }

    const totalQuestions = currentQuiz.questions.length;
    const result = {
      quizTitle: currentQuiz.title,
      totalQuestions,
      correctAnswers: score,
      incorrectAnswers: totalQuestions - score,
      percentage: Math.round((score / totalQuestions) * 100),
      userAnswers,
      completedAt: new Date(),
    };

    saveResult(result);
    this.setState({ currentView: 'results' });
  }

  resetQuiz(): void {
    const { currentQuiz } = this.state;
    if (currentQuiz) {
      this.startQuiz(currentQuiz);
    }
  }

  backToMenu(): void {
    this.setState({
      currentView: 'menu',
      currentQuiz: null,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showExplanation: false,
      userAnswers: [],
      score: 0,
    });
  }

  validateQuizJSON(data: any): { valid: boolean; error?: string } {
    return validateQuizJSON(data);
  }
}

