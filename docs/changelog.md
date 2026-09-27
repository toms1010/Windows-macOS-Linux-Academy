# Changelog

## 2026-09-27

### Added
- Single mobile navigation system: hamburger (brand-left/hamburger-right,
  44px targets, `aria-expanded`/`aria-controls`) opening the full
  `SidebarDrawer` (overlay, Esc, scroll-lock, focus management, active route).
  Drawer quick-links cover the 9 primary routes with icons.
- `src/components/common/navSections.ts`: single nav data source.
- Mobile full-width search row; responsive `SearchBar` widths; `overflow-x-clip`
  page guard.

### Changed
- `Navbar` menu state lifted to `Layout` (one source of truth); old inline
  dropdown menu removed; tablet hamburger opens the drawer; mobile brand
  truncates gracefully with `| Academy` from 380px.
- `Sidebar` split into shared `SidebarNav` (desktop aside unchanged).

### Verification
- TypeScript: PASS · Lint: PASS · Build: PASS (37/37)
- Routes: 9/9 mobile routes 200; hamburger ARIA + drawer id verified in output

## 2026-09-27

### Added
- `docs/` tree: architecture (4), backend (6), database (3) + changelog.
- Migration `005_quiz_source_columns.sql` (`source`, `generation_mode`).
- Quiz generator Local/AI modes, source attribution, attempt persistence
  (`services/quizAttempts.ts`).
- Supabase auth pages, `AuthProvider`, `AuthGuard`, profile; migrations
  001–004; contact API + SQLite backend.

### Changed
- Consolidated to single feature service layer (`src/features/*/`; removed
  top-level `services/`, `lib/auth.ts`, `lib/validation.ts`, `types/quiz.ts`,
  `components/auth/AuthProvider.tsx`, empty `src/hooks/`).
- Centralized env (`lib/env.ts`), constants (`lib/constants.ts`), errors
  (`utils/errors.ts`), contact validation (`validation/contact.ts`).
- Quiz rebuilt as state machine; roadmap gained 4-state tracking.

### Fixed
- Corrupted `.next` dev cache (vendor-chunks MODULE_NOT_FOUND) — cleared.
- `tsconfig` modernized (`ES2017`, `bundler`) after deprecation errors.

### Security
- Ownership-only RLS on all user tables; anon key only; secrets gitignored.
- Contact rate limiting (10/min/IP), duplicate guard, generic error JSON.

### Documentation
- New `docs/` system; README backend/architecture sections.

## 2026-09-27

### Technical Debt
- Debt register created: `docs/architecture/tech-debt.md` (TD-1 hand-mirrored
  DB types, TD-2 static quiz-bank location, TD-3 SQLite fallback) with
  resolution criteria and docs-to-update mapping.
- Matching `Technical Debt` headers added in code: `src/types/database.types.ts`,
  `src/data/quizBank.ts`, `src/lib/db.ts` (corrected paths/importers to actuals).

### Documentation
- `docs/architecture/decisions.md` points at the debt register for ADRs 001/004/006.
- Verified: all 9 RLS policies, 5 tables, service APIs, env vars, and folder
  tree match the implementation (drift check).

### Verification
- TypeScript: PASS
- Lint: PASS
- Build: NOT RUN (docs + comment-only code changes; last build 37/37 green)
