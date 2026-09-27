# Authentication

Service: `src/features/auth/auth.service.ts` — `signUp` (with `full_name`
metadata), `signIn`, `signOut`, `getSessionUser`, `sendPasswordReset`,
`updatePassword`, `getProfileName`, `saveProfileName`. All throw user-safe
`Error`s (mapped in `src/utils/errors.ts`); no raw AuthApiError reaches UI.

State: `src/features/auth/useAuth.tsx` — `AuthProvider` + `useAuth`
(`configured`, `user`, `session`, `loading`, `signOut`). Restores the session
on load; `onAuthStateChange` handles `SIGNED_IN`, `SIGNED_OUT`,
`TOKEN_REFRESHED`, `USER_UPDATED`.

Pages: `/signup` (name/email/password/confirm; honest verify-email panel),
`/login` (show/hide password, `?next=` redirect, configured users bounce to
`/profile`), `/forgot-password` (neutral wording, no enumeration),
`/update-password` (recovery-session gate), `/profile` (guarded; own
`profiles` row upsert).

Guards: `src/components/auth/AuthGuard.tsx` → logged-out visitors go to
`/login?next=<path>`; unconfigured backends get an explanatory card.
Navbar shows Sign In, or truncated email → profile + sign-out.

Errors are friendly (`The email or password is incorrect.`, …). No passwords,
tokens, or service keys are ever stored or logged client-side.
