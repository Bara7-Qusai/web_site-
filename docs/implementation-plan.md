# Implementation Plan

Quality gates come first; business features come after. Each phase ends with exit
criteria that were actually run. Status values: **Done** (exit criteria met and verified),
**In progress**, **Planned**. Detailed per-phase results (commands, outcomes) are reported
when each phase completes.

| # | Phase | Scope | Exit criteria | Status |
|---|-------|-------|---------------|--------|
| 0 | Inspection | Inventory the repo and local tooling | Findings recorded | Done |
| 1 | Docs and backend skeleton | Requirements, architecture, conventions; `backend/` with 15 module packages, `core`, `shared`; Ruff, mypy, pytest+coverage, import-linter configured | `ruff check`, `ruff format --check`, `mypy`, `lint-imports`, `pytest` pass; a deliberate violation of each contract is shown to fail `lint-imports` | Done |
| 2 | CI | GitHub Actions: backend job (+ frontend and contract jobs added in phases 3 and 4) | Workflow file valid; backend job commands identical to those run locally; green run on GitHub | In progress (backend, frontend, contract and e2e jobs written and replayed locally; not yet run on GitHub) |
| 3 | Frontend skeleton | Vite + React + TS, ESLint, Vitest, Playwright config, typed client generation from OpenAPI | `eslint`, `tsc --noEmit`, `vitest run`, `vite build` pass; client regenerated without drift | Done locally (GitHub run pending) |
| 4 | Persistence foundation | SQLAlchemy base, naming convention, session/unit of work, Alembic, PostgreSQL service in CI | Migration applies to empty DB; `alembic check` clean; integration test uses real PostgreSQL | Planned |
| 5 | Cross-cutting backend | Errors envelope, clock, id generator, idempotency records, audit hook, outbox table | Unit + integration tests; coverage gate enforced | Planned |
| 6 | Identity and branches | Auth, roles/permissions, branch scope in repositories | Branch-isolation tests prove cross-branch reads are blocked | Planned |
| 7 | Catalog and inventory | Products, batches, stock ledger, row-locked balances | Concurrency test: no oversell under parallel sales | Planned |
| 8 | Sales and payments | POS flow, idempotent completion, payments | Duplicate-submission test returns original result | Planned |
| 9 | Purchasing, returns, transfers | Receiving, returns/refunds, inter-branch transfers | Ledger stays consistent across flows | Planned |
| 10 | Cash and finance | Shifts, drawers, variance, ledgers | Close-of-day reconciliation tests | Planned |
| 11 | Notifications, reporting, settings | Outbox delivery via Celery, read models, configuration | Retry behaviour tested; reports match ledger | Planned |
| 12 | Hardening | Security review, audit review, performance checks, docs | Open items below closed or accepted | Planned |

## Open items

* **Frontend feature folders** exist only for `system`. Each business module gets one when
  its first real screen is built (see `frontend.md`).
* **Arabic translations** need native-speaker review. **No frontend formatter or coverage
  gate** yet (A-36, A-44).
* **Generated client** covers only `GET /health` until the backend defines business
  endpoints.

* **Public-interface-only imports** between modules are not yet enforced mechanically
  (see `architecture.md`, Enforcement). Add generated contracts or a custom check when the
  first cross-module import is written.
* **Assumption register** (`requirements.md` §13) is entirely *Open*; each entry needs
  confirmation or replacement by the original text.
* **Deployment target** is undecided, so CD is out of scope.
* **Currency and tax rules** (single currency? tax rates per branch?) are unspecified and
  will be needed before Phase 8.
