# Product Requirements Document: QuizByPram - Vanilla TypeScript Application

## 1. Project Overview

**Project Name:** QuizByPram (Vanilla TypeScript)  
**Version:** 1.0.0  
**Purpose:** A lightweight, single-page quiz application built with vanilla TypeScript that allows users to take quizzes from JSON files stored locally or uploaded dynamically. The application provides immediate feedback, detailed explanations, and score tracking.

**Key Differences from Next.js Version:**
- No React framework - pure TypeScript with DOM manipulation
- No server-side rendering - entirely client-side
- No routing library - view management through state
- Direct file loading instead of server API calls
- Inline SVG icons instead of lucide-react components

---

## 2. Technology Stack

### Required Technologies
- **TypeScript 5.x** - Primary language with strict type checking
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Tailwind-like utility classes or custom CSS
- **Vite or Parcel** - Build tool for TypeScript compilation and hot reload
- **No frameworks** - Pure vanilla TypeScript

### Build Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "noEmit": true
  }
}
```

---

## 3. File Structure

```
quizbypram/
├── index.html                 # Main HTML file
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration
├── src/
│   ├── main.ts               # Application entry point
│   ├── types/
│   │   └── quiz.ts           # Type definitions
│   ├── models/
│   │   └── QuizManager.ts    # Quiz state management
│   ├── views/
│   │   ├── MenuView.ts       # Menu/landing page view
│   │   ├── QuizView.ts       # Quiz taking view
│   │   └── ResultsView.ts    # Results summary view
│   ├── components/
│   │   ├── Modal.ts          # Error/info modal component
│   │   └── Icons.ts          # SVG icon definitions
│   ├── utils/
│   │   ├── quizValidator.ts  # JSON validation logic
│   │   ├── quizLoader.ts     # File loading utilities
│   │   └── storage.ts        # LocalStorage management
│   └── styles/
│       └── main.css          # Application styles
└── quizzes/
    ├── javascript-basics.json
    ├── react-fundamentals.json
    └── fnh-200-chapter2.json
```

---

## 4. Data Types and Interfaces

### 4.1 Core Types (src/types/quiz.ts)

```typescript
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;  // Index of correct option (0-based)
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
  timeSpent?: number;  // Optional: milliseconds
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
```

### 4.2 Quiz JSON Format

Each quiz file must follow this exact structure:

```json
{
  "title": "Quiz Title Here",
  "description": "Brief description of the quiz topic and difficulty",
  "questions": [
    {
      "question": "What is the question text?",
      "options": [
        "Option A text",
        "Option B text",
        "Option C text",
        "Option D text"
      ],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why this answer is correct and why others are wrong."
    }
  ]
}
```

**Validation Rules:**
- `title`: Required, non-empty string
- `description`: Required, non-empty string
- `questions`: Required array with at least 1 question
- `question.question`: Required, non-empty string
- `question.options`: Required array with at least 2 options (strings)
- `question.correctAnswer`: Required integer, must be valid index (0 to options.length - 1)
- `question.explanation`: Required, non-empty string

---

## 5. Application State Management

### 5.1 QuizManager Class (src/models/QuizManager.ts)

The `QuizManager` class handles all application state and business logic:

```typescript
class QuizManager {
  private state: AppState;
  private listeners: Set<(state: AppState) => void>;
  
  constructor() {
    this.state = this.getInitialState();
    this.listeners = new Set();
  }
  
  // State management
  getState(): AppState;
  setState(updates: Partial<AppState>): void;
  subscribe(listener: (state: AppState) => void): () => void;
  
  // Quiz loading
  async loadLocalQuizzes(): Promise<void>;
  loadQuizFromFile(file: File): Promise<Quiz>;
  
  // Quiz control
  startQuiz(quiz: Quiz): void;
  selectAnswer(index: number): void;
  submitAnswer(): void;
  nextQuestion(): void;
  resetQuiz(): void;
  
  // Validation
  validateQuizJSON(data: any): { valid: boolean; error?: string };
}
```

### 5.2 State Flow

```
[Initial Load]
    ↓
[Menu View] ←──┐
    ↓          │
[Select Quiz]  │
    ↓          │
[Quiz View]    │
    ↓          │
[Complete]     │
    ↓          │
[Results View] ┘
```

---

## 6. View Components

### 6.1 MenuView (src/views/MenuView.ts)

**Purpose:** Landing page showing available quizzes and file upload

**Elements:**
1. **Header Section**
   - App title: "QuizByPram"
   - Icon: BookOpen SVG (64x64px)
   - Subtitle: "Test your knowledge and improve your skills"

2. **File Upload Section**
   - Card with dashed border (border-2, border-dashed)
   - Upload icon (48x48px)
   - Text: "Click to upload JSON file"
   - Subtext: "Must follow the required structure"
   - Hidden file input (accept=".json")
   - On file select: validate and start quiz or show error modal

3. **Available Quizzes Section**
   - Card listing all quizzes from `/quizzes` directory
   - Each quiz card shows:
     - Title (font-semibold, text-lg)
     - Description (text-sm, text-gray-600)
     - Question count (text-sm, text-indigo-600)
   - Click handler to start selected quiz
   - Empty state: "No quizzes available yet"

**Methods:**
```typescript
class MenuView {
  render(): HTMLElement;
  handleFileUpload(event: Event): Promise<void>;
  handleQuizSelect(quiz: Quiz): void;
  renderQuizCard(quizFile: QuizFile): HTMLElement;
  showErrorModal(message: string): void;
}
```

### 6.2 QuizView (src/views/QuizView.ts)

**Purpose:** Display questions and handle answer selection

**Layout Elements:**

1. **Header Bar**
   - Quiz title (text-2xl, font-bold)
   - Home button (icon + "Home" text, click to return to menu)

2. **Progress Section**
   - Text: "Question X of Y" (left)
   - Text: "Score: X/Y" (right)
   - Progress bar (full width, height 8px)
     - Background: gray-200
     - Fill: indigo-600, width calculated as (currentQ + 1) / total * 100%
     - Smooth transition on change

3. **Question Section**
   - Question text (text-xl, font-semibold, mb-6)

4. **Options Section**
   - 4 option buttons (or dynamic based on options array)
   - Each option:
     - Border-2, rounded-lg, padding-4
     - Cursor pointer (unless explanation showing)
     - States:
       - **Unselected:** border-gray-200, hover:border-indigo-300
       - **Selected:** border-indigo-500, bg-indigo-50
       - **Correct (after submit):** border-green-500, bg-green-50, checkmark icon
       - **Wrong (after submit):** border-red-500, bg-red-50, X icon
       - **Other (after submit):** border-gray-200, opacity-50

5. **Explanation Section** (shown after answer submission)
   - Blue box (bg-blue-50, border-l-4, border-blue-500)
   - "Explanation:" label (font-semibold, text-blue-900)
   - Explanation text (text-blue-800)

6. **Action Button**
   - Before submission: "Submit Answer" (disabled if no answer selected)
   - After submission: "Next Question" or "View Results" (if last question)
   - Style: bg-indigo-600, text-white, px-6, py-3, rounded-lg
   - Hover: bg-indigo-700

**Methods:**
```typescript
class QuizView {
  render(): HTMLElement;
  renderProgress(): HTMLElement;
  renderQuestion(): HTMLElement;
  renderOptions(): HTMLElement;
  handleAnswerSelect(index: number): void;
  handleSubmit(): void;
  handleNext(): void;
  showExplanation(): void;
}
```

### 6.3 ResultsView (src/views/ResultsView.ts)

**Purpose:** Show quiz completion summary and review

**Layout Elements:**

1. **Score Summary**
   - Title: "Quiz Complete!" (text-3xl, font-bold)
   - Large score display: "X/Y" (text-6xl, font-bold, text-indigo-600)
   - Percentage: "You scored X%" (text-xl, text-gray-600)
   - Message based on score:
     - 90%+: "Excellent work!"
     - 80-89%: "Great job!"
     - 70-79%: "Good effort!"
     - 60-69%: "Not bad, keep studying!"
     - <60%: "Keep practicing!"

2. **Question Review List**
   - Each question card shows:
     - Checkmark icon (green) or X icon (red)
     - Question text (font-semibold)
     - Correct answer (always shown)
     - User's answer (if incorrect)
     - Explanation in blue box (same style as quiz view)

3. **Action Buttons**
   - "Retry Quiz" (bg-indigo-600, full width or flex-1)
     - Resets state and starts same quiz again
   - "Back to Menu" (bg-gray-200, text-gray-800, full width or flex-1)
     - Returns to menu view

**Methods:**
```typescript
class ResultsView {
  render(): HTMLElement;
  renderScoreSummary(): HTMLElement;
  renderQuestionReview(): HTMLElement;
  getScoreMessage(percentage: number): string;
  handleRetake(): void;
  handleBackToMenu(): void;
}
```

---

## 7. Utility Modules

### 7.1 Quiz Validator (src/utils/quizValidator.ts)

```typescript
export function validateQuizJSON(data: any): { 
  valid: boolean; 
  error?: string 
} {
  // Validate all required fields
  // Return detailed error messages
}

export function validateQuestion(
  question: any, 
  index: number
): string | null {
  // Validate individual question
  // Return error message or null
}
```

### 7.2 Quiz Loader (src/utils/quizLoader.ts)

```typescript
export async function loadLocalQuizzes(): Promise<QuizFile[]> {
  // Load all JSON files from /quizzes directory
  // In vanilla TS, this requires either:
  // Option 1: Import all quiz files explicitly
  // Option 2: Use Vite's import.meta.glob
  // Option 3: Maintain a manifest file
}

export async function loadQuizFromFile(file: File): Promise<Quiz> {
  // Read file as text
  // Parse JSON
  // Validate structure
  // Return Quiz or throw error
}
```

**Implementation for Vite:**
```typescript
const quizModules = import.meta.glob('/quizzes/*.json');

export async function loadLocalQuizzes(): Promise<QuizFile[]> {
  const files: QuizFile[] = [];
  
  for (const path in quizModules) {
    const module = await quizModules[path]();
    const filename = path.split('/').pop() || '';
    files.push({
      filename,
      quiz: module.default as Quiz
    });
  }
  
  return files;
}
```

### 7.3 Storage Manager (src/utils/storage.ts)

```typescript
const STORAGE_KEY = 'quizbypram-history';

export interface QuizHistory {
  results: QuizResult[];
  lastAccessed: Date;
}

export function saveResult(result: QuizResult): void {
  // Save to localStorage
}

export function getHistory(): QuizHistory {
  // Load from localStorage
}

export function clearHistory(): void {
  // Clear localStorage
}
```

---

## 8. Component Modules

### 8.1 Modal Component (src/components/Modal.ts)

**Purpose:** Display error messages and alerts

```typescript
export class Modal {
  private element: HTMLElement;
  
  constructor() {
    this.element = this.createModal();
  }
  
  show(title: string, message: string, type: 'error' | 'info'): void {
    // Update content
    // Display modal
  }
  
  hide(): void {
    // Hide modal
  }
  
  private createModal(): HTMLElement {
    // Return modal structure
  }
}
```

**Modal Structure:**
```html
<div class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">
      <svg class="icon-alert"></svg>
      <h3>Modal Title</h3>
    </div>
    <p class="modal-message">Message text</p>
    <button class="modal-close">Close</button>
  </div>
</div>
```

**Styles:**
- Overlay: Fixed position, full screen, bg-black/50, z-index 50
- Content: Max-width 28rem, bg-white, rounded-lg, padding-6
- Centered using flexbox

### 8.2 Icons Module (src/components/Icons.ts)

**Purpose:** Provide SVG icon definitions

```typescript
export const Icons = {
  BookOpen: `<svg>...</svg>`,
  Upload: `<svg>...</svg>`,
  Home: `<svg>...</svg>`,
  CheckCircle: `<svg>...</svg>`,
  XCircle: `<svg>...</svg>`,
  AlertCircle: `<svg>...</svg>`,
};

export function createIcon(
  name: keyof typeof Icons, 
  className?: string
): HTMLElement {
  // Create SVG element from string
  // Apply className
  // Return element
}
```

**Required Icons:**
1. **BookOpen** - Logo/menu icon (64x64px on menu, 24x24px elsewhere)
2. **Upload** - File upload icon (48x48px in upload zone, 20x20px in header)
3. **Home** - Return to menu (20x20px)
4. **CheckCircle** - Correct answer (20x20px)
5. **XCircle** - Wrong answer (20x20px)
6. **AlertCircle** - Error modal (24x24px)

**SVG Source:** Use Lucide icon SVG paths or similar open-source icon library

---

## 9. Main Application (src/main.ts)

**Purpose:** Initialize app and coordinate views

```typescript
class QuizApp {
  private manager: QuizManager;
  private currentView: MenuView | QuizView | ResultsView | null;
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
    switch (state.currentView) {
      case 'menu':
        this.currentView = new MenuView(this.manager);
        break;
      case 'quiz':
        this.currentView = new QuizView(this.manager);
        break;
      case 'results':
        this.currentView = new ResultsView(this.manager);
        break;
    }
    
    if (this.currentView) {
      this.container.appendChild(this.currentView.render());
    }
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  new QuizApp();
});
```

---

## 10. Styling (src/styles/main.css)

### 10.1 Design System

**Colors:**
```css
:root {
  --color-primary: #4f46e5;      /* indigo-600 */
  --color-primary-hover: #4338ca; /* indigo-700 */
  --color-primary-light: #eef2ff; /* indigo-50 */
  
  --color-success: #22c55e;       /* green-500 */
  --color-success-light: #f0fdf4; /* green-50 */
  
  --color-error: #ef4444;         /* red-500 */
  --color-error-light: #fef2f2;   /* red-50 */
  
  --color-info: #3b82f6;          /* blue-500 */
  --color-info-light: #eff6ff;    /* blue-50 */
  
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-600: #4b5563;
  --color-gray-800: #1f2937;
  
  --gradient-bg: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
}
```

**Typography:**
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
               'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-gray-800);
}

h1 { font-size: 2.25rem; font-weight: 700; }
h2 { font-size: 1.875rem; font-weight: 700; }
h3 { font-size: 1.5rem; font-weight: 600; }
```

**Spacing Scale:**
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

### 10.2 Component Styles

**Card:**
```css
.card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  padding: 1.5rem;
}
```

**Button:**
```css
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-primary:disabled {
  background: var(--color-gray-200);
  cursor: not-allowed;
}
```

**Progress Bar:**
```css
.progress-bar {
  width: 100%;
  height: 0.5rem;
  background: var(--color-gray-200);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
}
```

**Option Button:**
```css
.option {
  border: 2px solid var(--color-gray-200);
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option:hover:not(.disabled) {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.option.selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.option.correct {
  border-color: var(--color-success);
  background: var(--color-success-light);
}

.option.incorrect {
  border-color: var(--color-error);
  background: var(--color-error-light);
}
```

---

## 11. Key Features Implementation

### 11.1 File Upload with Validation

**User Flow:**
1. User clicks upload area
2. File input opens
3. User selects .json file
4. File is read as text
5. JSON is parsed
6. Validation runs:
   - Check all required fields
   - Validate data types
   - Validate array lengths
   - Validate option indices
7. If valid: Start quiz immediately
8. If invalid: Show modal with specific error message

**Error Messages:**
- "Invalid JSON file! Please check your file format and try again."
- "Invalid JSON structure! Please ensure your file includes: title, description, questions array with question, options, correctAnswer (index), and explanation fields."
- "Question X must have at least 2 options"
- "Question X correctAnswer index must be between 0 and Y"

### 11.2 Quiz Navigation

**Question Flow:**
1. Display question and options
2. User selects answer (highlight selected)
3. User clicks "Submit Answer"
4. Show correct/incorrect highlighting
5. Display explanation box
6. Change button to "Next Question" or "View Results"
7. User clicks next
8. Move to next question (steps 1-7) or show results

**State Preservation:**
- Current question index
- Selected answer for current question
- All previous answers and correctness
- Running score
- Whether explanation is showing

### 11.3 Score Calculation

**Formula:**
```typescript
const score = userAnswers.filter(a => a.isCorrect).length;
const percentage = Math.round((score / totalQuestions) * 100);
```

**Display:**
- Show running score in quiz view header: "Score: 5/10"
- Show final score in results: Large "5/10" display
- Show percentage: "You scored 50%"
- Show message based on percentage (see ResultsView section)

### 11.4 Results Review

**Question Cards:**
- Display all questions in order
- Show icon (check or X) based on correctness
- Always show correct answer
- Show user's answer if incorrect
- Display full explanation for each question
- Color coding:
  - Green elements for correct answers
  - Red elements for incorrect answers

### 11.5 Retry Functionality

**Retry Button:**
- Resets all state except current quiz
- Sets question index to 0
- Clears selected answer
- Clears user answers array
- Resets score to 0
- Switches to quiz view
- Keeps same quiz loaded

### 11.6 Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Mobile Adjustments:**
- Reduce padding: 1rem instead of 2rem
- Stack buttons vertically
- Reduce font sizes: h1 to 1.875rem, h2 to 1.5rem
- Full-width cards
- Adjust icon sizes: 40px instead of 64px

**CSS Example:**
```css
@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }
  
  h1 {
    font-size: 1.875rem;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .button-group button {
    width: 100%;
  }
}
```

---

## 12. Build and Development Setup

### 12.1 package.json

```json
{
  "name": "quizbypram",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

### 12.2 vite.config.ts

```typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### 12.3 index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuizByPram - Interactive Quiz Application</title>
  <meta name="description" content="Create and take multiple-choice quizzes with immediate feedback and detailed explanations">
  <link rel="stylesheet" href="/src/styles/main.css">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

---

## 13. Implementation Checklist

### Phase 1: Setup and Types
- [ ] Initialize project with Vite and TypeScript
- [ ] Create file structure
- [ ] Define all TypeScript interfaces in `quiz.ts`
- [ ] Set up tsconfig.json with strict mode
- [ ] Create basic HTML structure
- [ ] Set up CSS variables and base styles

### Phase 2: Utilities
- [ ] Implement `quizValidator.ts` with all validation rules
- [ ] Implement `quizLoader.ts` for file loading
- [ ] Implement `storage.ts` for localStorage management
- [ ] Test validation with valid and invalid quiz files

### Phase 3: Components
- [ ] Create Icons module with all 6 required icons
- [ ] Implement Modal component with show/hide methods
- [ ] Style modal with overlay and animations
- [ ] Test modal display and dismissal

### Phase 4: State Management
- [ ] Implement QuizManager class
- [ ] Add state subscription system
- [ ] Implement all quiz control methods
- [ ] Test state updates and notifications

### Phase 5: Views
- [ ] Implement MenuView
  - [ ] Render header and description
  - [ ] Render file upload zone
  - [ ] Render quiz list from local files
  - [ ] Handle file upload with validation
  - [ ] Handle quiz selection
- [ ] Implement QuizView
  - [ ] Render progress bar
  - [ ] Render question and options
  - [ ] Handle answer selection
  - [ ] Handle answer submission
  - [ ] Show/hide explanation
  - [ ] Handle navigation to next question
- [ ] Implement ResultsView
  - [ ] Render score summary
  - [ ] Render question review list
  - [ ] Handle retry action
  - [ ] Handle back to menu action

### Phase 6: Main Application
- [ ] Implement QuizApp class
- [ ] Set up view routing based on state
- [ ] Initialize on DOMContentLoaded
- [ ] Test full application flow

### Phase 7: Styling
- [ ] Complete all CSS component styles
- [ ] Implement responsive breakpoints
- [ ] Add hover and active states
- [ ] Test on mobile, tablet, and desktop
- [ ] Add transitions and animations

### Phase 8: Testing and Polish
- [ ] Test with all three provided quiz files
- [ ] Test file upload with valid files
- [ ] Test file upload with invalid files
- [ ] Test quiz completion flow
- [ ] Test retry functionality
- [ ] Test back to menu navigation
- [ ] Verify accessibility (keyboard navigation, ARIA labels)
- [ ] Check browser compatibility
- [ ] Optimize bundle size
- [ ] Build production version

---

## 14. Example Quiz Files

### 14.1 Simple Quiz (javascript-basics.json)

```json
{
  "title": "JavaScript Basics",
  "description": "Test your knowledge of fundamental JavaScript concepts",
  "questions": [
    {
      "question": "What is the correct way to declare a variable in JavaScript?",
      "options": [
        "var name = 'John'",
        "variable name = 'John'",
        "v name = 'John'",
        "declare name = 'John'"
      ],
      "correctAnswer": 0,
      "explanation": "The 'var' keyword is used to declare variables in JavaScript. Other options are not valid JavaScript syntax."
    },
    {
      "question": "Which method is used to add an element to the end of an array?",
      "options": [
        "push()",
        "pop()",
        "shift()",
        "unshift()"
      ],
      "correctAnswer": 0,
      "explanation": "The push() method adds one or more elements to the end of an array and returns the new length of the array."
    }
  ]
}
```

### 14.2 Complex Quiz (fnh-200-chapter2.json)

Already provided in the system - contains 25 detailed questions with longer explanations and multiple options.

---

## 15. Additional Features (Optional Enhancements)

### 15.1 LocalStorage History
- Save completed quiz results to localStorage
- Add "History" view to see past results
- Show statistics (average score, total quizzes taken)

### 15.2 Timer Feature
- Add optional timer per question
- Show time spent on each question
- Include time stats in results

### 15.3 Quiz Settings
- Allow shuffling questions
- Allow shuffling options
- Set passing score threshold
- Enable/disable explanations

### 15.4 Export Results
- Generate PDF of quiz results
- Export results as JSON
- Share results via email

### 15.5 Dark Mode
- Add theme toggle
- Implement dark color scheme
- Persist theme preference

### 15.6 Keyboard Navigation
- Arrow keys to select options
- Enter to submit/next
- ESC to return to menu
- Tab navigation for accessibility

---

## 16. Key Implementation Notes

### 16.1 View Rendering Pattern

Each view should follow this pattern:

```typescript
class SomeView {
  constructor(private manager: QuizManager) {}
  
  render(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'view-container';
    
    // Build view structure
    const header = this.renderHeader();
    const content = this.renderContent();
    const footer = this.renderFooter();
    
    container.append(header, content, footer);
    
    // Attach event listeners
    this.attachEventListeners(container);
    
    return container;
  }
  
  private attachEventListeners(container: HTMLElement): void {
    // Add event listeners to interactive elements
  }
}
```

### 16.2 Event Handling

Use event delegation for dynamic content:

```typescript
container.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  
  if (target.matches('.option-button')) {
    const index = parseInt(target.dataset.index || '0');
    this.handleOptionClick(index);
  }
  
  if (target.matches('.submit-button')) {
    this.handleSubmit();
  }
});
```

### 16.3 State Updates

Always update state through QuizManager:

```typescript
// Good
this.manager.selectAnswer(index);
this.manager.nextQuestion();

// Bad - don't mutate state directly
this.manager.getState().selectedAnswer = index;
```

### 16.4 Quiz File Loading

For production, consider three approaches:

1. **Static Import (Simplest):**
```typescript
import jsBasics from '../quizzes/javascript-basics.json';
import reactFundamentals from '../quizzes/react-fundamentals.json';
import fnh200 from '../quizzes/fnh-200-chapter2.json';

const quizzes = [
  { filename: 'javascript-basics.json', quiz: jsBasics },
  { filename: 'react-fundamentals.json', quiz: reactFundamentals },
  { filename: 'fnh-200-chapter2.json', quiz: fnh200 },
];
```

2. **Glob Import (Vite):**
```typescript
const modules = import.meta.glob('/quizzes/*.json');
// See section 7.2 for implementation
```

3. **Manifest File:**
```json
// quizzes/manifest.json
{
  "quizzes": [
    "javascript-basics.json",
    "react-fundamentals.json",
    "fnh-200-chapter2.json"
  ]
}
```

---

## 17. Success Criteria

The application is complete when:

1. ✅ User can see all local quizzes on the menu
2. ✅ User can upload a custom quiz JSON file
3. ✅ Invalid quiz files show appropriate error messages
4. ✅ User can start any quiz from the menu
5. ✅ Quiz displays questions one at a time with progress tracking
6. ✅ User can select and submit answers
7. ✅ Correct/incorrect feedback is immediate and clear
8. ✅ Explanations are shown after answer submission
9. ✅ User can navigate through all questions
10. ✅ Final results show score, percentage, and full review
11. ✅ User can retry the same quiz
12. ✅ User can return to menu from any view
13. ✅ Application is fully responsive (mobile, tablet, desktop)
14. ✅ All interactions are smooth with appropriate transitions
15. ✅ No TypeScript errors in strict mode
16. ✅ Application builds successfully for production

---

## 18. Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens at http://localhost:3000

# Type check without building
npm run type-check

# Build for production
npm run build
# Output in /dist directory

# Preview production build
npm run preview
```

---

## 19. Browser Support

- **Chrome/Edge:** Latest 2 versions
- **Firefox:** Latest 2 versions
- **Safari:** Latest 2 versions
- **Mobile Safari:** iOS 13+
- **Mobile Chrome:** Android 8+

Required modern features:
- ES2020 features (optional chaining, nullish coalescing)
- CSS Grid and Flexbox
- CSS Custom Properties
- Fetch API
- File API
- LocalStorage API

---

## 20. Final Notes

This PRD provides complete specifications for implementing a vanilla TypeScript quiz application that matches the functionality of the Next.js version. The key differences are:

1. **No React** - All UI is built with native DOM manipulation
2. **No routing library** - View changes managed through state
3. **Client-only** - All quiz loading happens in the browser
4. **Simpler deployment** - Static HTML/CSS/JS bundle
5. **Smaller bundle** - No framework overhead
6. **Direct control** - Full control over DOM and state management

The application should feel identical to the Next.js version from a user perspective, but with a simpler, more lightweight implementation using only vanilla TypeScript, HTML, and CSS.

---

**End of Product Requirements Document**

---

## Appendix A: Complete Type Reference

```typescript
// src/types/quiz.ts - Complete type definitions

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
```

## Appendix B: CSS Class Reference

```css
/* Layout */
.view-container { /* Full height container for each view */ }
.content-wrapper { /* Max-width centered content */ }
.card { /* White card with shadow */ }
.card-header { /* Card title section */ }
.card-body { /* Card content section */ }

/* Typography */
.title { /* Main page title */ }
.subtitle { /* Secondary text */ }
.text-sm { /* Small text */ }
.text-lg { /* Large text */ }
.font-semibold { /* Semi-bold weight */ }
.font-bold { /* Bold weight */ }

/* Buttons */
.btn { /* Base button style */ }
.btn-primary { /* Primary action button */ }
.btn-secondary { /* Secondary action button */ }
.btn-disabled { /* Disabled button state */ }

/* Quiz Elements */
.progress-container { /* Progress bar wrapper */ }
.progress-bar { /* Progress bar background */ }
.progress-fill { /* Progress bar fill */ }
.question-text { /* Question display */ }
.option { /* Answer option button */ }
.option.selected { /* Selected option */ }
.option.correct { /* Correct answer (after submit) */ }
.option.incorrect { /* Wrong answer (after submit) */ }
.explanation-box { /* Explanation container */ }

/* Icons */
.icon { /* Base icon style */ }
.icon-sm { /* Small icon (20px) */ }
.icon-md { /* Medium icon (24px) */ }
.icon-lg { /* Large icon (48px) */ }
.icon-xl { /* Extra large icon (64px) */ }

/* Modal */
.modal-overlay { /* Full screen overlay */ }
.modal-content { /* Modal card */ }
.modal-header { /* Modal title section */ }
.modal-message { /* Modal text content */ }
.modal-close { /* Close button */ }

/* Utilities */
.flex { /* Flexbox container */ }
.flex-col { /* Flex column direction */ }
.flex-row { /* Flex row direction */ }
.items-center { /* Align items center */ }
.justify-between { /* Space between */ }
.gap-2 { /* Gap 0.5rem */ }
.gap-4 { /* Gap 1rem */ }
.mb-4 { /* Margin bottom 1rem */ }
.mt-2 { /* Margin top 0.5rem */ }
.p-4 { /* Padding 1rem */ }
.rounded { /* Border radius 0.5rem */ }
.shadow { /* Box shadow */ }

/* Responsive */
@media (max-width: 640px) { /* Mobile styles */ }
@media (min-width: 641px) and (max-width: 1024px) { /* Tablet styles */ }
@media (min-width: 1025px) { /* Desktop styles */ }
```

---

**Document Version:** 1.0  
**Last Updated:** October 7, 2025  
**Author:** Product Requirements Document for QuizByPram Vanilla TypeScript  
**Status:** Ready for Implementation

