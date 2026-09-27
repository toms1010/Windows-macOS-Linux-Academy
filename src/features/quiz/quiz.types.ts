export type QuizPhase = 'answering' | 'feedback' | 'results';

export interface QuizAnswerRecord {
  questionId: string;
  selected: string;
  correct: boolean;
}
