/**
 * Database types mirroring supabase/migrations/*.sql by hand.
 *
 * IMPORTANT: these are a stand-in until a Supabase project exists — then
 * replace this file with `supabase gen types typescript` output. Keep the
 * exported shape (Database with Tables) so services need no changes.
 *
 * TECHNICAL DEBT (tracked in docs/architecture/tech-debt.md):
 * - [ ] Replace these hand-maintained types with generated types once a real
 *       Supabase project/database exists:
 *         npx supabase gen types typescript --project-id <PROJECT_ID> > src/types/database.types.ts
 * - Keep this file centralized: do NOT create duplicate database type files,
 *   and do NOT recreate these tables' shapes in feature folders (feature
 *   types must model UI/domain concepts, not re-declare the schema).
 * - After regeneration, verify `npx tsc --noEmit` and the services in
 *   src/features/ that consume these types, then update docs/backend/supabase.md,
 *   docs/backend/database.md, docs/database/schema.md, CHANGELOG.md.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface ProfileRow {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessageRow {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestionRow {
  id: string;
  quiz_id: string;
  topic: string;
  question: string;
  question_type: string;
  difficulty: string;
  options: Json;
  correct_answer: string;
  explanation: string;
  hint: string;
  source: string;
  created_by: string | null;
  created_at: string;
}

export interface QuizAttemptRow {
  id: string;
  user_id: string | null;
  quiz_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  generation_mode: string;
  started_at: string;
  completed_at: string | null;
}

export interface QuizAnswerRow {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  answered_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      contact_messages: {
        Row: ContactMessageRow;
        Insert: Partial<ContactMessageRow> & { name: string; email: string; message: string };
        Update: Partial<ContactMessageRow>;
        Relationships: [];
      };
      quiz_questions: {
        Row: QuizQuestionRow;
        Insert: Partial<QuizQuestionRow> & { topic: string; question: string; correct_answer: string };
        Update: Partial<QuizQuestionRow>;
        Relationships: [];
      };
      quiz_attempts: {
        Row: QuizAttemptRow;
        Insert: Partial<QuizAttemptRow> & { score: number; total_questions: number };
        Update: Partial<QuizAttemptRow>;
        Relationships: [];
      };
      quiz_answers: {
        Row: QuizAnswerRow;
        Insert: Partial<QuizAnswerRow> & { attempt_id: string; question_id: string; selected_answer: string };
        Update: Partial<QuizAnswerRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
