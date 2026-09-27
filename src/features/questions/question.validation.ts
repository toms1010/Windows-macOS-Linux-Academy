import type { QuizQuestion } from './question.types';

export interface ValidationResult {
  ok: boolean;
  reasons: string[];
}

/** Never blindly trust generated output — every question must pass this. */
export function validateQuestion(q: QuizQuestion): ValidationResult {
  const reasons: string[] = [];
  if (!q || typeof q !== 'object') return { ok: false, reasons: ['not an object'] };
  if (!q.id || typeof q.id !== 'string') reasons.push('missing id');
  if (q.type !== 'single_choice' && q.type !== 'multiple_choice' && q.type !== 'true_false') {
    reasons.push('invalid type');
  }
  if (!q.question || q.question.trim().length < 10) reasons.push('question too short');
  if (!Array.isArray(q.options)) {
    reasons.push('options missing');
  } else if (q.type === 'true_false' && q.options.length !== 2) {
    reasons.push('true/false needs exactly 2 options');
  } else if (q.type !== 'true_false' && q.options.length !== 4) {
    reasons.push('multiple choice needs exactly 4 options');
  }
  if (!q.correctAnswer || !q.options.includes(q.correctAnswer)) {
    reasons.push('correct answer must match an option');
  }
  if (new Set(q.options).size !== q.options.length) reasons.push('duplicate options');
  if (!q.explanation || q.explanation.trim().length < 10) reasons.push('explanation missing');
  if (!q.hint || q.hint.trim().length < 3) reasons.push('hint missing');
  if (!q.topic) reasons.push('topic missing');
  if (q.difficulty !== 'beginner' && q.difficulty !== 'intermediate' && q.difficulty !== 'advanced') {
    reasons.push('invalid difficulty');
  }
  if (!q.factKey) reasons.push('factKey missing');
  if (q.source !== 'local' && q.source !== 'ai' && q.source !== 'author') {
    reasons.push('invalid source (must be local, ai or author)');
  }
  return { ok: reasons.length === 0, reasons };
}
