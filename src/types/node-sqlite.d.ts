/**
 * Minimal typings for Node's built-in `node:sqlite` module.
 * The repo's @types/node predates these declarations; upgrading the
 * package just for this would churn the lockfile, so we declare the
 * small surface we actually use (parameterized queries only).
 */
declare module 'node:sqlite' {
  export interface StatementResult {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  }

  export interface StatementSync {
    get(...params: unknown[]): unknown;
    run(...params: unknown[]): StatementResult;
    all(...params: unknown[]): unknown[];
  }

  export class DatabaseSync {
    constructor(path?: string);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
