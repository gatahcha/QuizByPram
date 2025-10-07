import { ValidationResult, Quiz, QuizQuestion } from '../types/quiz.ts';

export function validateQuizJSON(data: any): ValidationResult {
  // Check if data exists
  if (!data) {
    return { valid: false, error: 'Invalid JSON file! Please check your file format and try again.' };
  }

  // Check required top-level fields
  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    return { valid: false, error: 'Quiz must have a non-empty title.' };
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
    return { valid: false, error: 'Quiz must have a non-empty description.' };
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    return { valid: false, error: 'Quiz must have at least one question.' };
  }

  // Validate each question
  for (let i = 0; i < data.questions.length; i++) {
    const questionError = validateQuestion(data.questions[i], i);
    if (questionError) {
      return { valid: false, error: questionError };
    }
  }

  return { valid: true };
}

export function validateQuestion(question: any, index: number): string | null {
  const questionNum = index + 1;

  // Check question text
  if (!question.question || typeof question.question !== 'string' || question.question.trim() === '') {
    return `Question ${questionNum} must have a non-empty question text.`;
  }

  // Check options array
  if (!Array.isArray(question.options) || question.options.length < 2) {
    return `Question ${questionNum} must have at least 2 options.`;
  }

  // Check that all options are non-empty strings
  for (let i = 0; i < question.options.length; i++) {
    if (typeof question.options[i] !== 'string' || question.options[i].trim() === '') {
      return `Question ${questionNum} option ${i + 1} must be a non-empty string.`;
    }
  }

  // Check correctAnswer
  if (typeof question.correctAnswer !== 'number') {
    return `Question ${questionNum} correctAnswer must be a number.`;
  }

  if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
    return `Question ${questionNum} correctAnswer index must be between 0 and ${question.options.length - 1}.`;
  }

  // Check explanation
  if (!question.explanation || typeof question.explanation !== 'string' || question.explanation.trim() === '') {
    return `Question ${questionNum} must have a non-empty explanation.`;
  }

  return null;
}

