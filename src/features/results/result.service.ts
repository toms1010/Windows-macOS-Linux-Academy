import { getSupabase } from '@/lib/supabase';
import { QUIZ_ID } from '@/lib/constants';
import { friendlyDbError } from '@/utils/errors';
import type { SaveAttemptInput } from './result.types';

/**
 * Result persistence — the ONLY place that writes quiz attempts/answers.
 * UI layers go through useResults(); nothing queries Supabase directly.
 * Throws plain Errors with user-safe messages (see utils/errors).
 */
export const resultService = {
  async saveAttempt(input: SaveAttemptInput): Promise<{ attemptId: string }> {
    const client = getSupabase();
    if (!client) throw new Error('Database is not configured.');
    const { data: session } = await client.auth.getSession();
    const user = session.session?.user;
    if (!user) throw new Error('You need to sign in to save progress.');

    const { data: attempt, error: attemptError } = await client
      .from('quiz_attempts')
      .insert({
        user_id: user.id,
        quiz_id: QUIZ_ID,
        score: input.score,
        total_questions: input.totalQuestions,
        percentage: input.percentage,
        generation_mode: input.generationMode,
        completed_at: new Date().toISOString(),
      })
      .select('id')
      .single();
    if (attemptError || !attempt) {
      throw new Error(friendlyDbError(attemptError?.message ?? 'insert failed'));
    }

    const rows = input.answers.map((a) => ({
      attempt_id: attempt.id as string,
      question_id: a.questionId,
      selected_answer: a.selected,
      is_correct: a.correct,
    }));
    if (rows.length > 0) {
      const { error: answersError } = await client.from('quiz_answers').insert(rows);
      if (answersError) {
        throw new Error(friendlyDbError(answersError.message));
      }
    }
    return { attemptId: attempt.id as string };
  },
};
