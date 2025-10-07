import { QuizManager } from '../models/QuizManager.ts';
import { QuizFile } from '../types/quiz.ts';
import { createIcon } from '../components/Icons.ts';
import { Modal } from '../components/Modal.ts';

export class MenuView {
  private modal: Modal;

  constructor(private manager: QuizManager) {
    this.modal = new Modal();
  }

  render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'view-container menu-view';

    const wrapper = document.createElement('div');
    wrapper.className = 'content-wrapper';

    // Header section
    const header = this.renderHeader();
    
    // Upload section
    const uploadSection = this.renderUploadSection();
    
    // Available quizzes section
    const quizzesSection = this.renderQuizzesSection();

    wrapper.append(header, uploadSection, quizzesSection);
    container.appendChild(wrapper);

    return container;
  }

  private renderHeader(): HTMLElement {
    const header = document.createElement('div');
    header.className = 'menu-header';
    
    const icon = createIcon('BookOpen', 'icon-xl');
    const title = document.createElement('h1');
    title.className = 'title';
    title.textContent = 'QuizByPram';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'subtitle';
    subtitle.textContent = 'Test your knowledge and improve your skills';

    header.append(icon, title, subtitle);
    return header;
  }

  private renderUploadSection(): HTMLElement {
    const section = document.createElement('div');
    section.className = 'upload-section card upload-card';

    const icon = createIcon('Upload', 'icon-lg');
    
    const mainText = document.createElement('p');
    mainText.className = 'upload-text';
    mainText.textContent = 'Click to upload JSON file';
    
    const subText = document.createElement('p');
    subText.className = 'upload-subtext';
    subText.textContent = 'Must follow the required structure';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.className = 'file-input';
    fileInput.addEventListener('change', (e) => this.handleFileUpload(e));

    section.addEventListener('click', () => fileInput.click());
    section.append(icon, mainText, subText, fileInput);

    return section;
  }

  private renderQuizzesSection(): HTMLElement {
    const section = document.createElement('div');
    section.className = 'quizzes-section';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = 'Available Quizzes';

    const quizList = document.createElement('div');
    quizList.className = 'quiz-list';

    const state = this.manager.getState();
    
    if (state.availableQuizzes.length === 0) {
      const emptyState = document.createElement('p');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'No quizzes available yet';
      quizList.appendChild(emptyState);
    } else {
      state.availableQuizzes.forEach(quizFile => {
        const card = this.renderQuizCard(quizFile);
        quizList.appendChild(card);
      });
    }

    section.append(title, quizList);
    return section;
  }

  private renderQuizCard(quizFile: QuizFile): HTMLElement {
    const card = document.createElement('div');
    card.className = 'card quiz-card';

    const title = document.createElement('h3');
    title.className = 'quiz-title';
    title.textContent = quizFile.quiz.title;

    const description = document.createElement('p');
    description.className = 'quiz-description';
    description.textContent = quizFile.quiz.description;

    const questionCount = document.createElement('p');
    questionCount.className = 'quiz-question-count';
    questionCount.textContent = `${quizFile.quiz.questions.length} questions`;

    card.addEventListener('click', () => this.handleQuizSelect(quizFile));
    card.append(title, description, questionCount);

    return card;
  }

  private async handleFileUpload(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      const quiz = await this.manager.loadQuizFromFile(file);
      this.manager.startQuiz(quiz);
    } catch (error) {
      this.showErrorModal(error instanceof Error ? error.message : 'Failed to load quiz file');
    }

    // Reset input
    input.value = '';
  }

  private handleQuizSelect(quizFile: QuizFile): void {
    this.manager.startQuiz(quizFile.quiz);
  }

  private showErrorModal(message: string): void {
    this.modal.show('Error', message, 'error');
  }
}

