import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { ContactMessage } from '@/types/contact';

/**
 * SQLite backend (Node built-in `node:sqlite` — no extra dependencies).
 *
 * TECHNICAL DEBT (tracked in docs/architecture/tech-debt.md): intentionally
 * retained while Supabase credentials/project config are unavailable — a
 * temporary compatibility fallback, NOT a second permanent backend. Do NOT
 * expand it (no new tables/domains here). Retirement requires, in order:
 * verify Supabase auth + DB + RLS + services work → migrate consumers
 * (currently: pages/api/contact.ts, pages/api/health.ts) → remove this file
 * and related config → typecheck/lint/build → verify flows manually →
 * update docs/architecture/overview.md, data-flow.md, folder-structure.md,
 * docs/backend/supabase.md, services.md, security.md, docs/database/schema.md,
 * CHANGELOG.md.
 *
 * - Single shared connection, cached on globalThis so dev hot-reloads
 *   don't open a new database per request.
 * - All queries are parameterized; no string-interpolated SQL anywhere.
 * - Location defaults to `./data/contact.db`, overridable with CONTACT_DB_PATH.
 *   On Vercel (serverless, ephemeral filesystem) it defaults to /tmp, which
 *   is the only writable directory — data there does not persist between
 *   invocations, so configure Supabase for durable storage in production.
 */

function dbPath(): string {
  if (process.env.CONTACT_DB_PATH) return process.env.CONTACT_DB_PATH;
  if (process.env.VERCEL) return path.join('/tmp', 'contact.db');
  return path.join(process.cwd(), 'data', 'contact.db');
}

declare global {
  // eslint-disable-next-line no-var
  var __contactDb: DatabaseSync | undefined;
}

function initSchema(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      feedback TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'NEW',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_contact_messages_created
      ON contact_messages (created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_contact_messages_status
      ON contact_messages (status);
  `);
}

export function getDb(): DatabaseSync {
  if (!globalThis.__contactDb) {
    const file = dbPath();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const db = new DatabaseSync(file);
    initSchema(db);
    globalThis.__contactDb = db;
  }
  return globalThis.__contactDb;
}

export function dbIsUp(): boolean {
  try {
    getDb().prepare('SELECT 1').get();
    return true;
  } catch {
    return false;
  }
}

interface ContactRow {
  id: string;
  name: string;
  email: string;
  feedback: string;
  status: ContactMessage['status'];
  created_at: string;
  updated_at: string;
}

function toMessage(row: ContactRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    feedback: row.feedback,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function insertContactMessage(name: string, email: string, feedback: string): ContactMessage {
  const db = getDb();
  const now = new Date().toISOString();
  const row: ContactRow = {
    id: randomUUID(),
    name,
    email,
    feedback,
    status: 'NEW',
    created_at: now,
    updated_at: now,
  };
  db.prepare(
    'INSERT INTO contact_messages (id, name, email, feedback, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(row.id, row.name, row.email, row.feedback, row.status, row.created_at, row.updated_at);
  return toMessage(row);
}

/**
 * Idempotency guard: was this exact message already stored recently?
 * Used to make double-clicks / network retries safe.
 */
export function hasRecentDuplicate(name: string, email: string, feedback: string, windowSeconds = 60): boolean {
  const db = getDb();
  const cutoff = new Date(Date.now() - windowSeconds * 1000).toISOString();
  const row = db
    .prepare(
      'SELECT id FROM contact_messages WHERE name = ? AND email = ? AND feedback = ? AND created_at >= ? LIMIT 1'
    )
    .get(name, email, feedback, cutoff) as { id: string } | undefined;
  return row !== undefined;
}
