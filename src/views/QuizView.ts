import { QuizManager } from '../models/QuizManager.ts';
import { createIcon } from '../components/Icons.ts';

export class QuizView {
  constructor(private manager: QuizManager) {}

  render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'view-container quiz-view';

    const wrapper = document.createElement('div');
    wrapper.className = 'content-wrapper';

    const header = this.renderHeader();
    const progress = this.renderProgress();
    const questionSection = this.renderQuestionSection();

    wrapper.append(header, progress, questionSection);
    container.appendChild(wrapper);

    return container;
  }

  private renderHeader(): HTMLElement {
    const header = document.createElement('div');
    header.className = 'quiz-header';

    const state = this.manager.getState();
    const title = document.createElement('h1');
    title.className = 'quiz-title-header';
    title.textContent = state.currentQuiz?.title || 'Quiz';

    const homeButton = document.createElement('button');
    homeButton.className = 'btn btn-secondary home-button';
    
    const homeIcon = createIcon('Home', 'icon-sm');
    const homeText = document.createElement('span');
    homeText.textContent = 'Home';
    
    homeButton.append(homeIcon, homeText);
    homeButton.addEventListener('click', () => this.manager.backToMenu());

    header.append(title, homeButton);
    return header;
  }

  private renderProgress(): HTMLElement {
    const state = this.manager.getState();
    const currentQ = state.currentQuestionIndex + 1;
    const total = state.currentQuiz?.questions.length || 0;
    const percentage = (currentQ / total) * 100;

    const container = document.createElement('div');
    container.className = 'progress-container';

    const info = document.createElement('div');
    info.className = 'progress-info';

    const questionInfo = document.createElement('span');
    questionInfo.textContent = `Question ${currentQ} of ${total}`;

    const scoreInfo = document.createElement('span');
    scoreInfo.textContent = `Score: ${state.score}/${state.userAnswers.length}`;

    info.append(questionInfo, scoreInfo);

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';

    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    progressFill.style.width = `${percentage}%`;

    progressBar.appendChild(progressFill);
    container.append(info, progressBar);

    return container;
  }

  private renderQuestionSection(): HTMLElement {
    const section = document.createElement('div');
    section.className = 'question-section card';

    const state = this.manager.getState();
    const question = state.currentQuiz?.questions[state.currentQuestionIndex];

    if (!question) {
      return section;
    }

    const questionText = document.createElement('h2');
    questionText.className = 'question-text';
    questionText.textContent = question.question;

    const optionsContainer = this.renderOptions();
    
    section.appendChild(questionText);
    section.appendChild(optionsContainer);

    if (state.showExplanation) {
      const explanation = this.renderExplanation();
      section.appendChild(explanation);
    }

    const actionButton = this.renderActionButton();
    section.appendChild(actionButton);

    return section;
  }

  private renderOptions(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'options-container';

    const state = this.manager.getState();
    const question = state.currentQuiz?.questions[state.currentQuestionIndex];

    if (!question) {
      return container;
    }

    question.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'option';
      button.dataset.index = index.toString();

      const optionText = document.createElement('span');
      optionText.textContent = option;

      button.appendChild(optionText);

      // Apply states
      if (state.selectedAnswer === index && !state.showExplanation) {
        button.classList.add('selected');
      }

      if (state.showExplanation) {
        button.classList.add('disabled');
        
        if (index === question.correctAnswer) {
          button.classList.add('correct');
          const icon = createIcon('CheckCircle', 'icon-sm');
          button.appendChild(icon);
        } else if (index === state.selectedAnswer) {
          button.classList.add('incorrect');
          const icon = createIcon('XCircle', 'icon-sm');
          button.appendChild(icon);
        } else {
          button.style.opacity = '0.5';
        }
      } else {
        button.addEventListener('click', () => this.handleAnswerSelect(index));
      }

      container.appendChild(button);
    });

    return container;
  }

  private renderExplanation(): HTMLElement {
    const state = this.manager.getState();
    const question = state.currentQuiz?.questions[state.currentQuestionIndex];

    const container = document.createElement('div');
    container.className = 'explanation-box';

    const label = document.createElement('p');
    label.className = 'explanation-label';
    label.textContent = 'Explanation:';

    const text = document.createElement('p');
    text.className = 'explanation-text';
    text.textContent = question?.explanation || '';

    container.append(label, text);
    return container;
  }

  private renderActionButton(): HTMLElement {
    const state = this.manager.getState();
    const button = document.createElement('button');
    button.className = 'btn btn-primary action-button';

    const isLastQuestion = state.currentQuestionIndex === (state.currentQuiz?.questions.length || 0) - 1;

    if (state.showExplanation) {
      button.textContent = isLastQuestion ? 'View Results' : 'Next Question';
      button.addEventListener('click', () => this.handleNext());
    } else {
      button.textContent = 'Submit Answer';
      button.disabled = state.selectedAnswer === null;
      button.addEventListener('click', () => this.handleSubmit());
    }

    return button;
  }

  private handleAnswerSelect(index: number): void {
    this.manager.selectAnswer(index);
  }

  private handleSubmit(): void {
    this.manager.submitAnswer();
  }

  private handleNext(): void {
    this.manager.nextQuestion();
  }
}

