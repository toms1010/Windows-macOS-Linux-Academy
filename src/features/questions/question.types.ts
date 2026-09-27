/**
 * Question domain types — the single source of truth for question shapes.
 * Quiz-flow and persistence layers import from here; nothing duplicates them.
 */
export type QuestionType = 'single_choice' | 'multiple_choice' | 'true_false';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  topic: string;
  difficulty: Difficulty;
  question: string;
  /** Exactly 2 options for true_false, 4 for multiple choice. */
  options: string[];
  /** Must equal one of `options`. */
  correctAnswer: string;
  explanation: string;
  hint: string;
  /**
   * Stable fact identifier (e.g. 'wsl-acronym'). The generator refuses to
   * emit two questions sharing a factKey, so reworded duplicates like
   * "full meaning of WSL" can never follow "what does WSL stand for".
   */
  factKey: string;
  /**
   * Provenance — NEVER misrepresented. 'author' = hand-written starter set,
   * 'local' = curated bank, 'ai' = AI service output.
   */
  source: QuestionSource;
}

export type QuestionSource = 'local' | 'ai' | 'author';

export type GenerationMode = 'local' | 'ai';

export interface GenerationOptions {
  topic: string;
  count: number;
  difficulty: Difficulty | 'mixed';
  questionType: 'multiple_choice' | 'true_false' | 'mixed';
  /** Questions already in the quiz — used for duplicate avoidance. */
  existingQuestions: QuizQuestion[];
  /** Rotation offset so Regenerate returns a different set. */
  rotation?: number;
}
