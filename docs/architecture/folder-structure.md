# Folder Structure (actual, verified)

```text
windows-linux-academy/
├── docs/
│   ├── originals/              # archived HTML prototypes (reference only)
│   ├── architecture/           # overview, folder-structure, data-flow, decisions
│   ├── backend/                # supabase, authentication, database, services, security, ai-generation
│   ├── database/               # schema, tables, rls-policies
│   └── changelog.md
├── supabase/
│   └── migrations/             # 001_profiles … 005_quiz_source_columns (.sql)
├── public/                     # static assets (images/ currently empty)
├── src/
│   ├── pages/                  # routes (+ pages/api/contact.ts, health.ts)
│   │   ├── login.tsx, signup.tsx, forgot-password.tsx, update-password.tsx
│   │   ├── profile.tsx (AuthGuard), quiz.tsx, roadmap.tsx, contact.tsx
│   │   ├── cpu-scheduling.tsx, virtual-memory.tsx, filesystem-explorer.tsx
│   │   ├── system-calls.tsx, terminal-simulator.tsx, permissions.tsx
│   │   └── …content pages (os, kernel, comparison, evolution, …)
│   ├── components/
│   │   ├── auth/               # AuthCard, AuthGuard (presentation only)
│   │   ├── quiz/               # GeneratorPanel
│   │   ├── contact/            # ContactForm
│   │   ├── common/             # Layout, Navbar, Sidebar, Footer, SearchBar, …
│   │   ├── labs/               # LabHeader + lab modules (Permissions, CPU, VM, …)
│   │   ├── pages/              # static visuals (Timeline, KernelDiagram, …)
│   │   └── ui/                 # GlassCard, CodeBlock, InteractiveTable
│   ├── features/               # single service layer, one dir per domain
│   │   ├── auth/               # auth.service.ts, auth.types.ts, useAuth.tsx
│   │   ├── questions/          # question.service.ts, question.types.ts, question.validation.ts
│   │   ├── quiz/               # quiz.service.ts, quiz.types.ts
│   │   └── results/            # result.service.ts, result.types.ts, useResults.ts
│   ├── lib/                    # supabase.ts, env.ts, constants.ts, db.ts, rateLimit.ts
│   ├── types/                  # database.types.ts, contact.ts, node-sqlite.d.ts
│   ├── validation/             # contact.ts
│   ├── utils/                  # errors.ts
│   ├── data/                   # quizBank.ts
│   └── styles/                 # globals.css
├── .env.example
├── package.json                # @supabase/supabase-js v2
└── tailwind.config.js
```

Notes: there is deliberately no top-level `services/`, `hooks/`, `repositories/`,
or `api/` folder — those responsibilities live in `features/` and `pages/api/`.
`src/types/quiz.ts` and `src/lib/validation.ts` were consolidated away; do not
reintroduce them.
