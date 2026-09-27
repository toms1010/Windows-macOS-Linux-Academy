import { QUESTION_BANK } from '@/data/quizBank';
import { validateQuestion } from './question.validation';
import type { GenerationOptions, QuizQuestion } from './question.types';

export const MAX_GENERATE = 20;
export const COUNT_OPTIONS = [3, 5, 10, 15, 20];

export interface GenerateResult {
  questions: QuizQuestion[];
  /** True when the bank ran out before reaching `count`. */
  truncated: boolean;
  /** Human-readable note when truncated or topic unknown. */
  note: string;
}

/** Normalize for duplicate comparison: case, punctuation, whitespace. */
export function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .replace(/[?.,!;:'"“”‘’()\-–—]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type FreshFilters = Omit<GenerationOptions, 'count' | 'rotation'>;

function freshPool(opts: FreshFilters): QuizQuestion[] {
  const topic = opts.topic.trim();
  const seenText = new Set(opts.existingQuestions.map((q) => normalizeText(q.question)));
  const seenFacts = new Set(opts.existingQuestions.map((q) => q.factKey));
  const seenIds = new Set(opts.existingQuestions.map((q) => q.id));

  let pool = QUESTION_BANK.filter((q) => q.topic.toLowerCase() === topic.toLowerCase());
  if (opts.difficulty !== 'mixed') {
    const byDiff = pool.filter((q) => q.difficulty === opts.difficulty);
    if (byDiff.length > 0) pool = byDiff;
  }
  if (opts.questionType !== 'mixed') {
    const want: Record<string, string> = { multiple_choice: 'single_choice', true_false: 'true_false' };
    const byType = pool.filter((q) => q.type === (want[opts.questionType] ?? opts.questionType));
    if (byType.length > 0) pool = byType;
  }
  return pool.filter(
    (q) =>
      !seenIds.has(q.id) &&
      !seenText.has(normalizeText(q.question)) &&
      !seenFacts.has(q.factKey) &&
      validateQuestion(q).ok
  );
}

/** The application's single question data-access layer (curated bank). */
export const questionService = {
  topics(): string[] {
    return Array.from(new Set(QUESTION_BANK.map((q) => q.topic)));
  },

  /** Exact number of fresh, valid questions for these filters (no cap). */
  countAvailable(opts: FreshFilters): number {
    if (!opts.topic.trim()) return 0;
    if (!QUESTION_BANK.some((q) => q.topic.toLowerCase() === opts.topic.trim().toLowerCase())) return 0;
    return freshPool(opts).length;
  },

  /**
   * Curated-bank generation (no network, no secrets — safe to run in browser).
   * Picks validated, non-duplicate questions, rotating by `rotation` so
   * Regenerate returns a different set.
   */
  generateLocal(opts: GenerationOptions): GenerateResult {
    const count = Math.min(Math.max(1, Math.floor(opts.count)), MAX_GENERATE);
    const topic = opts.topic.trim();

    if (!QUESTION_BANK.some((q) => q.topic.toLowerCase() === topic.toLowerCase())) {
      return { questions: [], truncated: true, note: `No curated questions for “${topic}” yet — try a listed topic or Custom matching one.` };
    }

    const fresh = freshPool(opts);
    const rotation = ((opts.rotation ?? 0) % Math.max(1, fresh.length + 1)) | 0;
    const ordered = fresh.length > 0 ? [...fresh.slice(rotation), ...fresh.slice(0, rotation)] : [];

    const picked = ordered.slice(0, count);
    const truncated = picked.length < count;
    return {
      questions: picked,
      truncated,
      note: truncated
        ? `Only ${picked.length} fresh question${picked.length === 1 ? '' : 's'} available for this combination — the bank avoids repeating facts.`
        : '',
    };
  },

  /**
   * AI generation entry point. There is deliberately NO AI provider wired in:
   * no keys, no endpoint, no network calls. When a server-side AI backend
   * exists (Supabase Edge Function + secret key), implement the call here —
   * never in a component — and validate every returned question with
   * validateQuestion() + duplicate checks before resolving.
   */
  async requestAI(_opts: GenerationOptions): Promise<{ ok: boolean; questions: QuizQuestion[]; reason?: 'not-configured' | 'offline' | 'failed' }> {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return { ok: false, questions: [], reason: 'offline' };
    }
    return { ok: false, questions: [], reason: 'not-configured' };
  },

  /** Shuffle answer options; correctAnswer is a value so mapping stays correct. */
  shuffleOptions(q: QuizQuestion): QuizQuestion {
    if (q.type === 'true_false') return q;
    return { ...q, options: shuffle(q.options) };
  },
};
