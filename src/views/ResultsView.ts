import { QuizManager } from '../models/QuizManager.ts';
import { createIcon } from '../components/Icons.ts';
import { UserAnswer } from '../types/quiz.ts';

export class ResultsView {
  constructor(private manager: QuizManager) {}

  render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'view-container results-view';

    const wrapper = document.createElement('div');
    wrapper.className = 'content-wrapper';

    const scoreSummary = this.renderScoreSummary();
    const questionReview = this.renderQuestionReview();
    const actions = this.renderActions();

    wrapper.append(scoreSummary, questionReview, actions);
    container.appendChild(wrapper);

    return container;
  }

  private renderScoreSummary(): HTMLElement {
    const state = this.manager.getState();
    const total = state.currentQuiz?.questions.length || 0;
    const score = state.score;
    const percentage = Math.round((score / total) * 100);

    const container = document.createElement('div');
    container.className = 'score-summary card';

    const title = document.createElement('h1');
    title.className = 'results-title';
    title.textContent = 'Quiz Complete!';

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.textContent = `${score}/${total}`;

    const percentageDisplay = document.createElement('p');
    percentageDisplay.className = 'percentage-display';
    percentageDisplay.textContent = `You scored ${percentage}%`;

    const message = document.createElement('p');
    message.className = 'score-message';
    message.textContent = this.getScoreMessage(percentage);

    container.append(title, scoreDisplay, percentageDisplay, message);
    return container;
  }

  private getScoreMessage(percentage: number): string {
    if (percentage >= 90) return 'Excellent work!';
    if (percentage >= 80) return 'Great job!';
    if (percentage >= 70) return 'Good effort!';
    if (percentage >= 60) return 'Not bad, keep studying!';
    return 'Keep practicing!';
  }

  private renderQuestionReview(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'question-review';

    const title = document.createElement('h2');
    title.className = 'review-title';
    title.textContent = 'Review';

    container.appendChild(title);

    const state = this.manager.getState();
    const questions = state.currentQuiz?.questions || [];

    state.userAnswers.forEach((userAnswer, index) => {
      const question = questions[userAnswer.questionIndex];
      if (!question) return;

      const card = document.createElement('div');
      card.className = 'review-card card';

      const header = document.createElement('div');
      header.className = 'review-card-header';

      const icon = createIcon(
        userAnswer.isCorrect ? 'CheckCircle' : 'XCircle',
        userAnswer.isCorrect ? 'icon-sm text-green-500' : 'icon-sm text-red-500'
      );

      const questionText = document.createElement('h3');
      questionText.className = 'review-question';
      questionText.textContent = question.question;

      header.append(icon, questionText);

      const correctAnswer = document.createElement('p');
      correctAnswer.className = 'review-correct';
      correctAnswer.innerHTML = `<strong>Correct Answer:</strong> ${question.options[question.correctAnswer]}`;

      card.appendChild(header);
      card.appendChild(correctAnswer);

      if (!userAnswer.isCorrect) {
        const userAnswerElement = document.createElement('p');
        userAnswerElement.className = 'review-user-answer';
        userAnswerElement.innerHTML = `<strong>Your Answer:</strong> ${question.options[userAnswer.selectedAnswer]}`;
        card.appendChild(userAnswerElement);
      }

      const explanation = document.createElement('div');
      explanation.className = 'explanation-box';
      
      const explanationLabel = document.createElement('p');
      explanationLabel.className = 'explanation-label';
      explanationLabel.textContent = 'Explanation:';
      
      const explanationText = document.createElement('p');
      explanationText.className = 'explanation-text';
      explanationText.textContent = question.explanation;

      explanation.append(explanationLabel, explanationText);
      card.appendChild(explanation);

      container.appendChild(card);
    });

    return container;
  }

  private renderActions(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'results-actions';

    const retryButton = document.createElement('button');
    retryButton.className = 'btn btn-primary';
    retryButton.textContent = 'Retry Quiz';
    retryButton.addEventListener('click', () => this.handleRetake());

    const menuButton = document.createElement('button');
    menuButton.className = 'btn btn-secondary';
    menuButton.textContent = 'Back to Menu';
    menuButton.addEventListener('click', () => this.handleBackToMenu());

    container.append(retryButton, menuButton);
    return container;
  }

  private handleRetake(): void {
    this.manager.resetQuiz();
  }

  private handleBackToMenu(): void {
    this.manager.backToMenu();
  }
}

