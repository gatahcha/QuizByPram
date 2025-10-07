import { createIcon } from './Icons.ts';

export class Modal {
  private element: HTMLElement;
  private titleElement: HTMLElement;
  private messageElement: HTMLElement;

  constructor() {
    this.element = this.createModal();
    this.titleElement = this.element.querySelector('.modal-title')!;
    this.messageElement = this.element.querySelector('.modal-message')!;
    document.body.appendChild(this.element);
  }

  show(title: string, message: string, type: 'error' | 'info' = 'error'): void {
    this.titleElement.textContent = title;
    this.messageElement.textContent = message;
    
    // Update icon based on type
    const iconContainer = this.element.querySelector('.modal-icon');
    if (iconContainer) {
      iconContainer.innerHTML = '';
      const icon = createIcon('AlertCircle', `icon-md ${type === 'error' ? 'text-red-500' : 'text-blue-500'}`);
      iconContainer.appendChild(icon);
    }
    
    this.element.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  hide(): void {
    this.element.classList.add('hidden');
    document.body.style.overflow = '';
  }

  private createModal(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay hidden';
    overlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-icon"></div>
          <h3 class="modal-title"></h3>
        </div>
        <p class="modal-message"></p>
        <button class="modal-close btn btn-primary">Close</button>
      </div>
    `;

    const closeButton = overlay.querySelector('.modal-close')!;
    closeButton.addEventListener('click', () => this.hide());
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.hide();
      }
    });

    return overlay;
  }
}

