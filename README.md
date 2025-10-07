# QuizByPram - Vanilla TypeScript Application

A lightweight, single-page quiz application built with vanilla TypeScript that allows users to take quizzes from JSON files stored locally or uploaded dynamically. The application provides immediate feedback, detailed explanations, and score tracking.

## Features

- 📚 **Multiple Quiz Support** - Load quizzes from local JSON files or upload custom quizzes
- ✅ **Immediate Feedback** - Get instant results after submitting each answer
- 📊 **Score Tracking** - Track your progress throughout the quiz
- 📝 **Detailed Explanations** - Learn from comprehensive explanations for each question
- 🎯 **Results Review** - Review all questions and answers after completing the quiz
- 🔄 **Retry Functionality** - Retake quizzes to improve your score
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- 💾 **Local Storage** - Quiz history saved to browser's local storage
- 🎨 **Modern UI** - Beautiful gradient design with smooth animations

## Technology Stack

- **TypeScript 5.x** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **HTML5 & CSS3** - Modern web standards
- **No frameworks** - Pure vanilla TypeScript for minimal bundle size

## Project Structure

```
quizme/
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

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quizbypram
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Creating Custom Quizzes

Create a JSON file following this structure:

```json
{
  "title": "Quiz Title",
  "description": "Brief description of the quiz",
  "questions": [
    {
      "question": "Your question here?",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of the correct answer."
    }
  ]
}
```

### Validation Rules

- `title`: Required, non-empty string
- `description`: Required, non-empty string
- `questions`: Required array with at least 1 question
- `question.question`: Required, non-empty string
- `question.options`: Required array with at least 2 options
- `question.correctAnswer`: Required integer (0-based index)
- `question.explanation`: Required, non-empty string

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

### Code Style

The project uses TypeScript strict mode and follows modern ES2020+ standards.

## Deployment

### GitHub Pages

The project includes a GitHub Actions workflow that automatically builds and deploys to GitHub Pages when pushing to the main branch.

To enable:
1. Go to repository Settings → Pages
2. Select "Deploy from a branch"
3. Choose "gh-pages" branch
4. Save

The site will be available at `https://<username>.github.io/<repository-name>/`

### Other Hosting Platforms

The built application in the `dist` folder can be deployed to any static hosting service:
- Netlify
- Vercel
- Cloudflare Pages
- AWS S3 + CloudFront
- Firebase Hosting

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 13+
- Mobile Chrome: Android 8+

## Features in Detail

### Quiz Upload

Upload custom quiz JSON files through the menu interface. The application validates the structure and provides detailed error messages if the format is incorrect.

### Progress Tracking

- Visual progress bar showing quiz completion
- Running score display
- Question counter (e.g., "Question 3 of 10")

### Answer Feedback

- Selected answers are highlighted
- Correct answers shown in green with checkmark
- Incorrect answers shown in red with X icon
- Immediate display of explanation after submission

### Results Summary

- Final score and percentage
- Motivational message based on performance
- Complete review of all questions
- Show correct answers and user's answers
- Explanations for every question

### Local Storage

Quiz results are automatically saved to browser's local storage for future reference.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Icons from [Lucide](https://lucide.dev/)
- Built with [Vite](https://vitejs.dev/)
- Inspired by modern quiz applications and educational platforms

