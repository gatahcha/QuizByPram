import { Quiz, QuizFile } from '../types/quiz.ts';
import { validateQuizJSON } from './quizValidator.ts';

export async function loadLocalQuizzes(): Promise<QuizFile[]> {
  const quizModules = import.meta.glob('/quizzes/*.json');
  const files: QuizFile[] = [];

  for (const path in quizModules) {
    try {
      const module = await quizModules[path]() as any;
      const filename = path.split('/').pop() || '';
      
      // Validate before adding
      const validation = validateQuizJSON(module.default || module);
      if (validation.valid) {
        files.push({
          filename,
          quiz: (module.default || module) as Quiz
        });
      }
    } catch (error) {
      console.error(`Failed to load quiz from ${path}:`, error);
    }
  }

  return files;
}

export async function loadQuizFromFile(file: File): Promise<Quiz> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        const validation = validateQuizJSON(data);
        if (!validation.valid) {
          reject(new Error(validation.error || 'Invalid quiz file'));
          return;
        }

        resolve(data as Quiz);
      } catch (error) {
        reject(new Error('Invalid JSON file! Please check your file format and try again.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

