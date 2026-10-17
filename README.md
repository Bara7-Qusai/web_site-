# Pharmacy Management System

Four-branch pharmacy management system: a modular monolith (FastAPI, PostgreSQL) with a
React + TypeScript frontend.

* Requirements and assumption register: [`docs/requirements.md`](docs/requirements.md)
* Architecture and module boundaries: [`docs/architecture.md`](docs/architecture.md)
* Naming and coding conventions: [`docs/conventions.md`](docs/conventions.md)
* Phased plan and open items: [`docs/implementation-plan.md`](docs/implementation-plan.md)

## Backend quality checks

```bash
cd backend
python3 -m venv .venv && . .venv/bin/activate
pip install -e ".[dev]"

ruff check .          # lint
ruff format --check . # formatting
mypy                  # strict types
lint-imports          # architecture contracts
pytest                # tests + coverage gate (default 80%; --cov-fail-under=N to override)
```

CI (`.github/workflows/ci.yml`) runs exactly these commands.
