import { QuizManager } from './models/QuizManager.ts';
import { MenuView } from './views/MenuView.ts';
import { QuizView } from './views/QuizView.ts';
import { ResultsView } from './views/ResultsView.ts';
import { AppState } from './types/quiz.ts';

class QuizApp {
  private manager: QuizManager;
  private container: HTMLElement;

  constructor() {
    this.manager = new QuizManager();
    this.container = document.getElementById('app')!;
    this.init();
  }

  private async init(): Promise<void> {
    // Load local quizzes
    await this.manager.loadLocalQuizzes();

    // Subscribe to state changes
    this.manager.subscribe((state) => this.render(state));

    // Initial render
    this.render(this.manager.getState());
  }

  private render(state: AppState): void {
    // Clear container
    this.container.innerHTML = '';

    // Render appropriate view
    let view: MenuView | QuizView | ResultsView | null = null;

    switch (state.currentView) {
      case 'menu':
        view = new MenuView(this.manager);
        break;
      case 'quiz':
        view = new QuizView(this.manager);
        break;
      case 'results':
        view = new ResultsView(this.manager);
        break;
    }

    if (view) {
      this.container.appendChild(view.render());
    }
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  new QuizApp();
});

