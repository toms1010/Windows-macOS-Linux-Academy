import type { QuizAnswerRecord } from '../quiz/quiz.types';

export interface SaveAttemptInput {
  score: number;
  totalQuestions: number;
  percentage: number;
  generationMode: 'local' | 'ai' | 'mixed';
  answers: QuizAnswerRecord[];
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'failed' | 'skipped';
