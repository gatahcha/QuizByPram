# Setup Guide for QuizByPram

This guide will help you get the QuizByPram application up and running, both locally and deployed to GitHub Pages.

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

This will install:
- TypeScript 5.3.0
- Vite 5.0.0

### 2. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### 3. Make Changes

All source code is in the `src/` directory:
- `src/main.ts` - Application entry point
- `src/views/` - UI view components
- `src/models/` - State management
- `src/components/` - Reusable components
- `src/utils/` - Utility functions
- `src/styles/` - CSS styles
- `src/types/` - TypeScript type definitions

Quiz files are in the `quizzes/` directory.

### 4. Type Checking

```bash
npm run type-check
```

This runs TypeScript compiler without emitting files to check for type errors.

## GitHub Pages Deployment

### Initial Setup

1. **Update Vite Configuration**

   Edit `vite.config.ts` and change the base path to match your repository name:

   ```typescript
   base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
   ```

   Replace `YOUR-REPO-NAME` with your actual GitHub repository name.

2. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Enable GitHub Pages**

   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select "Deploy from a branch"
   - Select the `gh-pages` branch
   - Click **Save**

4. **Wait for Deployment**

   The GitHub Actions workflow will automatically build and deploy your app. You can check the progress in the **Actions** tab.

   Your site will be available at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

### Manual Deployment

If you want to deploy manually instead of using GitHub Actions:

```bash
# Build the application
npm run build

# Deploy to GitHub Pages (requires gh-pages package)
npm install -g gh-pages
gh-pages -d dist
```

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add your domain to the `cname` field in `.github/workflows/deploy.yml`:
   ```yaml
   cname: yourdomain.com
   ```

2. Configure your domain's DNS settings to point to GitHub Pages:
   - Add a CNAME record pointing to `YOUR-USERNAME.github.io`
   - Or add A records pointing to GitHub's IP addresses

3. In your repository settings under Pages, add your custom domain

## Creating New Quizzes

1. Create a new JSON file in the `quizzes/` directory

2. Follow the structure:
   ```json
   {
     "title": "Quiz Title",
     "description": "Quiz description",
     "questions": [
       {
         "question": "Question text?",
         "options": ["A", "B", "C", "D"],
         "correctAnswer": 0,
         "explanation": "Explanation text"
       }
     ]
   }
   ```

3. The quiz will automatically appear in the menu

## Environment Variables

You can customize the build behavior with environment variables:

- `NODE_ENV=production` - Enables production mode with optimizations

## Troubleshooting

### Quiz files not loading

Make sure:
- Quiz files are in the `quizzes/` directory
- Files have `.json` extension
- JSON is valid (use a JSON validator)
- Files follow the required structure

### GitHub Pages shows 404

Make sure:
- The `base` path in `vite.config.ts` matches your repository name
- GitHub Pages is enabled in repository settings
- The `gh-pages` branch exists
- The workflow completed successfully

### Build fails

Check:
- Node.js version is 18 or higher (`node --version`)
- All dependencies are installed (`npm install`)
- No TypeScript errors (`npm run type-check`)

## Production Build

To create a production build locally:

```bash
npm run build
```

The optimized files will be in the `dist/` directory. You can test the production build:

```bash
npm run preview
```

## Browser Compatibility

The application uses modern JavaScript features and requires:
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions  
- Safari: Latest 2 versions
- Mobile browsers: iOS 13+, Android 8+

## Performance

The production build is optimized for performance:
- Code splitting
- Minification
- Tree shaking
- Asset optimization
- Gzip compression ready

Typical bundle size: ~50-100KB (gzipped)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the README.md
3. Check existing GitHub issues
4. Create a new issue with details about your problem

## License

MIT License - See LICENSE file for details

