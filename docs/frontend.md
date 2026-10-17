# Frontend

Companion to [`architecture.md`](architecture.md). `[A-nn]` marks entries in the assumption
register in [`requirements.md`](requirements.md).

## Stack

React 19, TypeScript (strict), Vite, React Router, TanStack Query, i18next, and
`openapi-fetch` for the typed API client. Tests: Vitest + Testing Library (unit/component),
Playwright (end to end). Lint: ESLint with `typescript-eslint` strict type-checked rules.
Package manager: npm with a committed lockfile. Version choices are explained in A-34.

## Layout

```
frontend/
  src/
    app/          shell: providers, layout, routes, navigation, 404 and error pages
      features.ts the list of mounted features (navigation order)
    features/     one folder per business module, created when it gets a UI   [A-41]
      system/     backend health check (the only feature so far)
        index.ts  public interface: a FeatureRoute, imported by app/features.ts only
        api/ components/ pages/ ...    (more folders on demand: hooks, types, state)
    shared/       code with no business knowledge
      api/        generated schema, typed client, React context for it
      i18n/       languages, locales, language switcher, direction handling
      ui/         Button, LoadingState, ErrorState, ErrorBoundary, Spinner
      config/     env access;  styles/  global CSS;  feature.ts  FeatureRoute type
    test/         test setup and helpers (not shipped)
  e2e/            Playwright specs
```

Feature folders for the other 14 business modules are deliberately **not** created yet.
An empty folder, or a page with no working behaviour, would be a placeholder. A module
gets `src/features/<module>/` when its first real screen is built, using the same names as
the backend package (`inventory`, `sales`, ...). Navigation lists only mounted features.
`[A-41, A-42]`

## Dependency rules (enforced by ESLint `no-restricted-imports`)

| From | May not import |
|------|----------------|
| `features/*` | other features, `app/` (use relative imports inside a feature) |
| `shared/*` | `features/`, `app/` |
| `app/*` | anything inside a feature except its public `index.ts` |

A feature that needs something from another feature should receive it from the shell
(props, context) or move the common part into `shared/` if it is truly reusable. The rules
were checked by writing a violation of each and seeing ESLint fail.

## Business logic

Components display and collect. Rules about money, stock, permissions and so on belong in
the backend domain layer; the frontend may mirror a rule only for fast feedback, never as the
only enforcement. Data access is in `api/` hooks next to the feature; components call the
hooks. No pharmacy data is hardcoded; there are no placeholder metrics or inert buttons.

## API contract

1. FastAPI generates the OpenAPI schema; `backend/scripts/export_openapi.py` writes it.
2. The schema is committed as `contracts/openapi.json` (the reviewable contract). `[A-38]`
3. `npm run api:generate` turns it into `src/shared/api/schema.d.ts` (committed, generated;
   do not edit).
4. `createApiClient` wraps `openapi-fetch` with those types; features get the client from
   `useApiClient()`, which also lets tests inject a fake network layer.

Regenerate after any backend API change:

```bash
(cd backend && python scripts/export_openapi.py > ../contracts/openapi.json)
(cd frontend && npm run api:generate)
```

CI re-exports and regenerates and fails if either committed file differs.

**Limitation:** the backend currently exposes only `GET /health`. The generated client
covers exactly that; no business endpoints or types have been invented. Authentication,
error envelopes and pagination types will appear when the backend defines them.

The browser reaches the backend through same-origin paths (`/health`, `/api`). Vite
forwards them to FastAPI in dev and preview; production is expected to serve both behind
one origin, so the backend needs no CORS configuration `[A-37]`. Only `VITE_`-prefixed
variables reach the bundle and they are public: never put secrets there. The proxy
target is read at build/dev time and is not bundled (verified by searching `dist/`).

## Internationalisation and RTL

English (LTR) and Arabic (RTL). The initial language is the stored choice, else the
browser language, else English; the switcher stores the choice in `localStorage` (failure
tolerated). Changing language updates `<html lang>` and `<html dir>`, and CSS uses logical
properties (`margin-inline`, `inset-inline-start`, ...) so one stylesheet serves both. `[A-39]`

Translations are TypeScript objects (`shared/i18n/locales`). `ar.ts` is typed against
`en.ts`, so a missing or extra key fails `tsc`, and `t('...')` keys are type-checked. `[A-40]`
**The Arabic strings have not been reviewed by a native speaker.**

## Commands

```bash
cd frontend
npm ci                 # install exactly from the lockfile
npm run dev            # http://localhost:5173, proxies /health and /api to :8000
npm run lint
npm run typecheck
npm test               # Vitest
npm run build          # tsc + vite build
npm run api:generate   # regenerate API types from ../contracts/openapi.json
npm run test:e2e       # Playwright; starts uvicorn (backend venv on PATH) and the built app
```

For `dev`, start the backend too: `cd backend && python -m uvicorn app.main:app --reload`.
For `test:e2e`, put the backend's Python on `PATH` (or set `E2E_BACKEND_COMMAND`), and run
`npx playwright install chromium` once, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to an
existing Chromium.
