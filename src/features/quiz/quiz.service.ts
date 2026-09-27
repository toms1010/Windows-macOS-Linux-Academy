import type { QuizAnswerRecord } from './quiz.types';
import type { QuizQuestion } from '../questions/question.types';

/**
 * Pure quiz business logic — no Supabase, no React. Separated from the
 * persistence layer (features/results) so scoring is independently testable.
 */

export function calculateScore(questions: QuizQuestion[], answers: QuizAnswerRecord[]): number {
  const byId = new Map(questions.map((q) => [q.id, q]));
  return answers.reduce((score, record) => {
    const question = byId.get(record.questionId);
    return question && record.selected === question.correctAnswer ? score + 1 : score;
  }, 0);
}

export function percentageOf(score: number, total: number): number {
  return total === 0 ? 0 : Math.round((score / total) * 100);
}

export function deriveGenerationMode(questions: QuizQuestion[]): 'local' | 'ai' | 'mixed' {
  const hasAI = questions.some((q) => q.source === 'ai');
  const hasOther = questions.some((q) => q.source !== 'ai');
  if (hasAI && hasOther) return 'mixed';
  if (hasAI) return 'ai';
  return 'local';
}
