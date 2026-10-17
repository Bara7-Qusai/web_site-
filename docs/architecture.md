# Architecture

Companion to [`requirements.md`](requirements.md). Items marked `[A-nn]` are assumptions
from its register.

## Style

A **modular monolith**: one deployable backend, divided into business modules with
explicit boundaries, using pragmatic Clean Architecture inside each module. No
microservices; there is no documented requirement that justifies the operational cost.

```
backend/app/
  core/       settings, db session, security, logging   (framework glue; may import shared)
  shared/     Money, errors, clock, ids, unit of work   (no framework or module imports)
  modules/    the 15 business modules                    (may import core, shared, lower modules)
frontend/src/
  features/<module>/   api, components, hooks, pages, types
  shared/              api client, ui kit, utilities
```

## Layers inside a module

Folders are created only when a module has something to put in them. A module that has
no persistence yet has no `infrastructure/`.

```
modules/<module>/
  __init__.py        docstring: responsibility, allowed dependencies          [A-26]
  public.py          the only file other modules may import                   [A-31]
  domain/            entities/ value_objects/ services/   (pure Python)
  application/       use_cases/ dto/ interfaces/          (orchestration, ports)
  infrastructure/    repositories/ services/              (SQLAlchemy, email, jobs)
  presentation/      routes/ schemas/                     (FastAPI, auth, wiring)
  tests/
```

| Layer | Responsibility | May import |
|-------|----------------|------------|
| domain | Business rules, invariants, value objects | stdlib, `shared` |
| application | Use cases, transaction boundary, ports (interfaces) | domain, `shared` |
| infrastructure | Implements ports: DB, email, jobs | application, domain, `shared`, SQLAlchemy etc. |
| presentation | HTTP, schemas, auth integration, dependency wiring | all layers of its own module, `core` |

Domain code uses plain dataclasses; Pydantic belongs to application DTOs and
presentation schemas `[A-30]`. Business rules never live only in route handlers or
frontend components. The use case owns the unit of work (one request, one transaction)
`[A-21]`.

Dependency inversion is used where it decouples something real (repositories, the clock,
mailer, id generator, unit of work). It is not applied to things that will never have a
second implementation.

## Module map and allowed dependencies `[A-29]`

Modules are ordered. A module may import only the **public interface** (`public.py`) of
modules **below** it. Siblings on one line are independent of each other. This also
rules out circular module dependencies.

```
reporting
finance
returns | transfers | purchasing
sales | cash
payments
inventory
catalog
branches | identity
audit | notifications | settings
```

| Module | Package | Responsibility |
|--------|---------|----------------|
| Identity and Access | `identity` | Users, roles, permissions, authentication, branch assignment |
| Branch Management | `branches` | The four branches, their details and status |
| Product Catalog | `catalog` | Products, categories, pricing, units, regulatory flags |
| Inventory and Batches | `inventory` | Batches, expiry, stock ledger and balances, adjustments |
| Sales and POS | `sales` | Carts, sales, line items, discounts, receipts |
| Payments | `payments` | Payment methods, payments, refunds' money movement |
| Purchases and Suppliers | `purchasing` | Suppliers, purchase orders, goods receipt |
| Returns and Refunds | `returns` | Customer returns, restocking decisions, refunds |
| Inter-Branch Transfers | `transfers` | Transfer requests, dispatch, receipt, in-transit stock |
| Cash Management | `cash` | Cash drawers, shifts, cash in/out, variance |
| Finance | `finance` | Receivables/payables, expenses, ledgers, period close |
| Reporting and Analytics | `reporting` | Read models, dashboards, exports (read-only) |
| Notifications and Email | `notifications` | Outbox, templates, delivery, retries |
| Audit Logging | `audit` | Append-only audit trail |
| System Configuration | `settings` | Tax, currency, receipt, per-branch configuration |

Lower modules that everyone needs (`audit`, `notifications`, `settings`) are reached
through narrow interfaces so higher modules do not depend on their internals. A lower
module that needs to react to a higher one does so through a domain event published to
the outbox, never by importing upward.

This order is a starting hypothesis. If a real use case needs an upward import, change the
order (and this document) deliberately, or introduce an event; do not bypass the contract.

## Enforcement

Architecture rules are executable, in `backend/pyproject.toml` (`[tool.importlinter]`),
run by `lint-imports` locally and in CI `[A-10]`:

| Contract | Rule |
|----------|------|
| domain-is-framework-free | `modules.*.domain` must not import FastAPI, Starlette, SQLAlchemy, Alembic, psycopg, Redis, Celery or Pydantic |
| domain-is-innermost | `modules.*.domain` must not import `application`, `infrastructure`, `presentation` |
| application-is-inward | `modules.*.application` must not import `infrastructure` or `presentation` |
| infrastructure-is-not-presentation | `modules.*.infrastructure` must not import `presentation` |
| shared-is-independent | `shared` must not import `core` or `modules` |
| core-does-not-import-modules | `core` must not import `modules` |
| module-order | the layer ordering above |

Not yet enforced (listed in [`implementation-plan.md`](implementation-plan.md) as an open
item): "other modules may import only `public.py`". import-linter cannot express "everything
but `public`" per target with wildcards, so it needs generated contracts or a small custom
check, to be added when the first cross-module import appears.

Frontend: ESLint `no-restricted-imports` keeps features from importing each other's
internals; features talk to the backend only through the generated typed client `[A-14]`.

## Cross-cutting decisions (decided in Phase 1)

* Money is a `Decimal`-backed value object, `NUMERIC(14,2)` plus currency code; never float.
* Stock is an append-only `stock_movements` ledger; `inventory_balances` updates in the
  same transaction with `SELECT … FOR UPDATE`.
* Idempotency keys on sales, payments, refunds, stored in `idempotency_records`.
* Branch isolation enforced in the repository layer from request context.
* Email via transactional outbox; Celery delivers.
