# Quick Start Guide

Get QuizByPram running in 3 simple steps!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start Development Server

```bash
npm run dev
```

Your browser will automatically open to `http://localhost:3000`

## Step 3: Start Taking Quizzes!

- Click on any available quiz from the menu
- Or upload your own quiz JSON file
- Take the quiz and see your results!

## What's Next?

### Create Your Own Quiz

1. Create a new `.json` file in the `quizzes/` folder
2. Follow the structure in existing quiz files
3. Refresh the page - your quiz will appear automatically!

### Deploy to GitHub Pages

1. Update the repository name in `vite.config.ts`:
   ```typescript
   base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
   ```

2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. Enable GitHub Pages in repository Settings → Pages → select `gh-pages` branch

4. Visit `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run type-check` | Check TypeScript types |

## Need Help?

- See [README.md](README.md) for detailed documentation
- See [SETUP.md](SETUP.md) for deployment instructions
- Check the PRD at [quizbypram-vanillats.md](quizbypram-vanillats.md) for technical specifications

## Project Structure

```
src/
├── main.ts              # App entry point
├── views/               # UI views (Menu, Quiz, Results)
├── models/              # State management
├── components/          # Reusable components
├── utils/               # Helper functions
├── types/               # TypeScript types
└── styles/              # CSS styles

quizzes/                 # Quiz JSON files
```

Enjoy using QuizByPram! 🎓

