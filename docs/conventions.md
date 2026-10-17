# Naming and Coding Conventions

All items here are assumed defaults `[A-06]`; see the register in
[`requirements.md`](requirements.md).

## Python

| Thing | Convention | Example |
|-------|-----------|---------|
| Module / package | `snake_case`, singular noun or domain word | `stock_movement.py` |
| Class | `PascalCase` | `Batch`, `Money` |
| Function / variable | `snake_case`, verb for functions | `reserve_stock` |
| Constant | `UPPER_SNAKE_CASE` | `MAX_DISCOUNT_PERCENT` |
| Use case | verb phrase class with one public `execute` | `CompleteSale` |
| Command / query DTO | noun + `Command` / `Query` / `Result` | `CompleteSaleCommand` |
| Repository port | `<Aggregate>Repository` in `application/interfaces` | `BatchRepository` |
| Repository adapter | technology prefix in `infrastructure/repositories` | `SqlAlchemyBatchRepository` |
| Domain event | past tense | `SaleCompleted` |
| Domain error | noun phrase ending in `Error`, subclass of `DomainError` | `InsufficientStockError` |
| Test file | `test_<unit>.py`; test name states behaviour | `test_sale_rejects_expired_batch` |
| Private | single leading underscore; no name mangling | `_round_line` |

* Public cross-module API is `modules/<module>/public.py` and nothing else `[A-31]`.
* Absolute imports (`from app.shared.money import Money`); no relative imports across layers.
* No abbreviations except well-known ones (`id`, `qty` is **not** one: write `quantity`).
* Booleans read as predicates: `is_expired`, `has_stock`.

## Database

* Tables: plural `snake_case` (`stock_movements`). Columns `snake_case`.
* Primary key `id` (UUID); foreign key `<singular>_id`.
* Every table: `created_at`, `updated_at` as `timestamptz` (UTC).
* Money: `NUMERIC(14,2)` plus `currency` `CHAR(3)`. Quantities: `NUMERIC(14,3)` where
  fractional units exist, otherwise integer.
* Constraint names follow one SQLAlchemy naming convention (`pk_`, `fk_`, `uq_`, `ix_`,
  `ck_` prefixes) so Alembic autogenerate output is stable.
* Migrations: one logical change each; message in imperative form.

## HTTP API

* Base path `/api/v1`; kebab-case plural resources (`/purchase-orders`).
* JSON bodies and query parameters use `snake_case`.
* Non-idempotent creates (sales, payments, refunds) require an `Idempotency-Key` header.
* Errors use one problem-details style envelope with a stable machine-readable `code`.
* Each route sets `summary`, `tags` (= module), and typed `response_model`.

## TypeScript / React

| Thing | Convention |
|-------|-----------|
| Component, type, interface | `PascalCase`; component file `PascalCase.tsx` |
| Function, variable, hook | `camelCase`; hooks start with `use` |
| Other files | `kebab-case.ts` |
| Feature folder | same as backend module package: `features/inventory` |
| Constants | `UPPER_SNAKE_CASE` |

* Feature layout: `api/`, `components/`, `hooks/`, `pages/`, `types/` (create on demand).
* Server data goes through the generated client and a query cache; no ad-hoc `fetch`.
* No business rules in components; components display and collect.

## Git

* Branch: `<type>/<short-description>` unless the platform assigns one.
* Commit: imperative subject line (≤72 chars), body explains why.
