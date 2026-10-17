# Software Engineering Architecture and Code Quality Requirements

Status: **living document**. Sections 1–4 are the original requirements, preserved
verbatim (the original text was truncated mid-list in section 4). Sections 5–12 and the
bullets marked *(assumed)* in section 4 were **not** supplied and were written as
defaults. Every assumed item carries an ID such as `[A-07]` and is listed in the
[Assumption Register](#13-assumption-register) so it can be reviewed, confirmed, or
changed. When the original text for any assumed item turns up, it replaces the assumption
and the register entry is closed.

---

## Original requirements (sections 1–4, verbatim)

**SOFTWARE ENGINEERING ARCHITECTURE AND CODE QUALITY REQUIREMENTS**

Act as a Principal Software Architect and Senior Software Engineer.
Build the four-branch Pharmacy Management System using professional software engineering practices. The system must be modular, maintainable, testable, secure, documented, and easy for another engineering team to understand and extend.

### 1. Architectural Style

Use a Modular Monolith with pragmatic Clean Architecture and selected Domain-Driven Design principles.
Organize the backend by business domains, not by creating one giant collection of generic controllers, services, and models.
Each module must have clearly defined responsibilities, public interfaces, dependencies, and tests.
Start with these modules:

* Identity and Access Management
* Branch Management
* Product Catalog
* Inventory and Batch Management
* Sales and Point of Sale
* Payments
* Purchases and Suppliers
* Returns and Refunds
* Inter-Branch Transfers
* Cash Management
* Finance
* Reporting and Analytics
* Notifications and Email
* Audit Logging
* System Configuration

Do not introduce microservices unless a documented requirement justifies the additional operational complexity.

### 2. Dependency Rules

Enforce these dependency rules:

* Domain must not depend on FastAPI, SQLAlchemy, PostgreSQL, Redis, or frontend frameworks.
* Application orchestrates use cases and depends on domain rules and defined interfaces.
* Infrastructure implements persistence, email, background jobs, and other external integrations.
* Presentation handles HTTP requests, response schemas, authentication integration, and dependency wiring.
* Frontend communicates with the backend through typed API clients.
* Business rules must not be implemented exclusively in frontend components or API route handlers.

Use dependency inversion where it provides meaningful decoupling.
Avoid circular imports and circular module dependencies.

### 3. Code Organization

Organize backend modules consistently using appropriate folders for:

* domain/entities
* domain/value_objects
* domain/services
* application/use_cases
* application/dto
* application/interfaces
* infrastructure/repositories
* infrastructure/services
* presentation/routes
* presentation/schemas
* tests

Use the equivalent frontend organization for feature modules, reusable components, API clients, hooks, state management, and shared types.
Do not create unnecessary files, abstract classes, or design patterns merely to satisfy a checklist. Choose abstractions according to actual business requirements.

### 4. Engineering Principles

Apply SOLID, DRY, KISS, Separation of Concerns, and explicit interfaces.
Use:

* Type hints and clear naming.
* Small, cohesive functions

*(The original text ended here. The bullets below are assumed.)*

* Immutable value objects; entities that protect their own invariants. `[A-01]`
* Errors modelled as typed domain exceptions, not strings or bare `Exception`. `[A-01]`
* No dead code, commented-out code, or speculative generality. `[A-01]`
* Comments explain *why*, never *what*. `[A-01]`

---

## Sections 5–12 (assumed defaults)

Everything below is an assumed default. Items tagged `[A-nn]` are in the register.

### 5. Testing Standards

* Backend: **pytest**, with `pytest-cov`. A **configurable coverage gate** applies to the
  backend: the default floor is 80 % line + branch coverage, set in
  `backend/pyproject.toml` (`[tool.coverage.report] fail_under`), overridable with
  `--cov-fail-under=N` locally and by the repository variable `BACKEND_COVERAGE_MIN` in CI.
  `[A-02]`
* Frontend unit/component tests: **Vitest** (+ Testing Library when components exist).
  End-to-end: **Playwright**. `[A-03]`
* Test pyramid: many fast unit tests of domain and application code (no I/O), fewer
  integration tests against a real PostgreSQL, a small set of Playwright journeys for
  critical flows (sale, refund, transfer, cash close). `[A-04]`
* Domain tests use no mocks of the domain; application tests fake the interfaces they
  depend on with small in-memory implementations; infrastructure tests hit a real
  PostgreSQL (never SQLite) so locking and `NUMERIC` behave as in production. `[A-04]`
* Concurrency-sensitive behaviour (overselling, duplicate submissions via idempotency
  keys, double refunds) must have a test that exercises concurrent access. `[A-04]`
* Tests live in each module's `tests/` folder and mirror the layer they test. Cross-cutting
  tests (architecture contracts, app smoke) live in `backend/tests/`. `[A-05]`
* A bug fix starts with a failing test that reproduces it.
* Tests are deterministic: time comes from an injected clock, IDs from an injected
  generator where the value matters; no sleeping; no dependence on test order.

### 6. Naming Conventions

Full detail in [`docs/conventions.md`](conventions.md). Summary: `[A-06]`

* Python: `snake_case` functions/variables/modules, `PascalCase` classes,
  `UPPER_SNAKE_CASE` constants. Use-case classes are verb phrases (`CompleteSale`);
  repository interfaces end in `Repository`; value objects are nouns (`Money`,
  `Quantity`); domain events are past tense (`SaleCompleted`).
* Database: plural `snake_case` tables, `<singular>_id` foreign keys, `created_at` /
  `updated_at` as `timestamptz`, money as `NUMERIC(14,2)`, constraints and indexes named
  by a fixed convention.
* HTTP: kebab-case plural resource paths under `/api/v1`, JSON fields in `snake_case`.
* TypeScript: `PascalCase` components and types, `camelCase` functions/variables,
  `kebab-case` file names for non-components; feature folders mirror backend module names.

### 7. Code Quality

* **Ruff** for linting and formatting (single tool; no Black/isort/flake8). `[A-07]`
* **mypy** in strict mode for backend code. `[A-08]`
* **ESLint** with `typescript-eslint` for the frontend; TypeScript `strict: true`. `[A-09]`
* **import-linter** contracts enforce the dependency rules in section 2 and module
  ordering; they run in CI and fail the build. `[A-10]`
* Money is `Decimal`/`Money` only; floats are never used for money. A lint rule or test
  guards `float` annotations in monetary code paths. `[A-11]`
* Time is timezone-aware UTC (Ruff `DTZ` rules on); naive `datetime` is rejected.
* Complexity guard: Ruff `C901` with max complexity 10; functions over ~40 lines need
  justification in review. `[A-12]`
* Quality checks are established **before** business features and are never skipped,
  disabled, or quarantined to make a build pass.

### 8. CI/CD

* **GitHub Actions**, workflow `.github/workflows/ci.yml`, triggered on pull requests and
  pushes to `main`. `[A-13]`
* Backend job: install, `ruff check`, `ruff format --check`, `mypy`, `lint-imports`,
  `pytest` with coverage gate. Integration tests run against a PostgreSQL service
  container once the database phase lands. `[A-13]`
* Frontend job: install, ESLint, `tsc --noEmit`, Vitest, build. Playwright runs as a
  separate job once there is a journey to run. `[A-13]`
* Contract job: export the OpenAPI schema from FastAPI, regenerate the typed frontend
  client, and fail if the committed client differs. `[A-14]`
* Migration job: apply Alembic migrations to an empty PostgreSQL, then verify
  `alembic check` reports no drift. `[A-15]`
* Third-party actions are pinned to a major version at minimum; workflow permissions
  default to `contents: read`. Deployment (CD) is **out of scope** until a hosting target
  is chosen. `[A-16]`

### 9. Security

* Authentication: short-lived access tokens plus rotating refresh tokens; passwords
  hashed with Argon2id; lockout/throttling on repeated failures. `[A-17]`
* Authorization: role- and permission-based, **plus** branch scope. Branch scope is
  enforced in the repository layer from the authenticated request context; hiding data
  in the UI is never sufficient (Phase 1 decision).
* Secrets only via environment/secret store; none in the repository; `.env.example` lists
  names without values. Secret scanning runs in CI. `[A-18]`
* All input validated at the boundary (Pydantic schemas) and re-validated by domain
  invariants. SQL only through parameterised SQLAlchemy constructs.
* Sensitive actions (price change, stock adjustment, refund, cash variance, role change)
  write an audit record in the same transaction as the action.
* Dependency vulnerability scanning (`pip-audit`, `npm audit`) runs in CI, initially
  non-blocking. `[A-19]`
* Patient/customer data collected is minimised; no personal data in logs. `[A-20]`

### 10. Database Transactions

* One request = one unit of work = one database transaction, owned by the application
  layer (use case), never by route handlers or repositories. `[A-21]`
* `stock_movements` is an append-only ledger; `inventory_balances` is updated in the same
  transaction using `SELECT … FOR UPDATE` so concurrent sales cannot oversell
  (Phase 1 decision).
* Sales, payments, and refunds accept a client **idempotency key**, persisted in
  `idempotency_records`, so duplicate submissions return the original result
  (Phase 1 decision).
* Outbound email and other side effects use an **outbox**: the outbox row is written in
  the business transaction; a background worker (Celery) delivers with retries
  (Phase 1 decision).
* Money: `Decimal` in code, `NUMERIC(14,2)` in PostgreSQL, currency code stored with the
  amount; rounding mode is half-up at the line level. `[A-22]`
* Schema changes only via **Alembic** migrations, reviewed like code; migrations are
  forward-only in production and must be backward compatible with the previous release
  where feasible. `[A-23]`
* Default isolation level `READ COMMITTED`; operations needing stronger guarantees use
  explicit row locks rather than raising isolation globally. `[A-24]`

### 11. Documentation

* `docs/requirements.md` (this file), `docs/architecture.md`, `docs/conventions.md`,
  `docs/implementation-plan.md` are maintained alongside code; changes to behaviour
  or structure update the relevant doc in the same pull request. `[A-25]`
* Significant, hard-to-reverse decisions are recorded as short ADRs in `docs/adr/`. `[A-25]`
* Each module's `__init__.py` docstring states its responsibility, what it may depend on,
  and where its public interface lives. `[A-26]`
* API contract is the FastAPI-generated **OpenAPI** schema; routes and schemas carry
  summaries and examples. The frontend uses a typed client generated from that schema.
* Public functions and classes have docstrings only where the name and types do not
  already explain them.

### 12. Implementation Workflow

* Work proceeds in **phases** (see [`implementation-plan.md`](implementation-plan.md)).
  Each phase has exit criteria; quality checks are set up before business features.
* Every phase reports: files changed, checks and tests actually executed, results,
  assumptions made, and outstanding issues. A check is reported as passing only if it
  was run and succeeded.
* Small, focused commits with descriptive messages; work happens on a feature branch
  and lands via pull request with CI green. `[A-27]`
* Before adding configuration, inspect the repository for an existing equivalent; do not
  duplicate tool configuration or overwrite working code.
* Definition of done for a feature: behaviour implemented in the correct layer, tests at
  the right levels, migrations (if any), OpenAPI/client regenerated, docs updated, CI
  green. `[A-27]`

---

## 13. Assumption Register

Status values: **Open** (assumed, awaiting confirmation), **Confirmed**, **Replaced**.

| ID | Assumption | Where | Status |
|----|-----------|-------|--------|
| A-01 | Remaining section 4 bullets (immutability, typed errors, no dead code, comments explain why) | §4 | Open |
| A-02 | Coverage gate default 80 % line+branch; overridable via CLI and `BACKEND_COVERAGE_MIN` | §5 | Open |
| A-03 | Vitest + Testing Library for unit/component tests; Playwright for E2E | §5 | Open |
| A-04 | Test pyramid shape, real PostgreSQL for integration, concurrency tests required | §5 | Open |
| A-05 | Tests live in each module's `tests/`; cross-cutting tests in `backend/tests/` | §5 | Open |
| A-06 | Naming conventions as in `docs/conventions.md` | §6 | Open |
| A-07 | Ruff is the only linter/formatter; line length 100; rule set in `backend/pyproject.toml` | §7 | Open |
| A-08 | mypy strict | §7 | Open |
| A-09 | ESLint + typescript-eslint, TS `strict` | §7 | Open |
| A-10 | import-linter contracts: domain isolation, layer direction, module ordering, shared/core isolation | §7 | Open |
| A-11 | Floats forbidden for money | §7 | Open |
| A-12 | Max cyclomatic complexity 10 | §7 | Open |
| A-13 | CI job structure and triggers | §8 | Open |
| A-14 | CI fails on OpenAPI/typed-client drift | §8 | Open |
| A-15 | CI applies migrations to empty PostgreSQL and runs `alembic check` | §8 | Open |
| A-16 | Actions pinned to major versions; read-only default permissions; no CD yet | §8 | Open |
| A-17 | Argon2id, access+refresh tokens, login throttling | §9 | Open |
| A-18 | Secrets via env/secret store; secret scanning in CI | §9 | Open |
| A-19 | `pip-audit` / `npm audit` initially non-blocking | §9 | Open |
| A-20 | Minimise personal data; none in logs | §9 | Open |
| A-21 | Unit of work owned by application layer; one request = one transaction | §10 | Open |
| A-22 | Half-up rounding at line level; `NUMERIC(14,2)` | §10 | Open |
| A-23 | Alembic forward-only migrations in production | §10 | Open |
| A-24 | `READ COMMITTED` + explicit row locks | §10 | Open |
| A-25 | Docs set and ADR folder | §11 | Open |
| A-26 | Module docstring states responsibility/dependencies/public interface | §11 | Open |
| A-27 | PR-based workflow, definition of done | §12 | Open |
| A-28 | Python 3.13 and Node 22 LTS as runtimes | tooling | Open |
| A-29 | Module order for cross-module imports (see `docs/architecture.md`) | §1/§2 | Open |
| A-30 | Domain code uses plain dataclasses; Pydantic is allowed only in application DTOs and presentation | §2 | Open |
| A-31 | Module public interface is `app/modules/<module>/public.py` | §1 | Open |
| A-32 | Backend lives in `backend/`, frontend in `frontend/` | §3 | Open |
| A-33 | PostgreSQL 16, FastAPI, SQLAlchemy 2, Celery + Redis for background jobs | §1/§10 | Open |

Phase 1 decisions carried over from the earlier design discussion (Money, stock ledger,
idempotency, branch isolation, outbox) are recorded in sections 9 and 10 and treated as
decided, not assumed.
