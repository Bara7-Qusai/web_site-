"""Write the FastAPI OpenAPI schema to stdout as stable, sorted JSON.

Usage: python scripts/export_openapi.py > ../contracts/openapi.json
"""

import json
import sys

from app.main import create_app


def main() -> None:
    schema = create_app().openapi()
    sys.stdout.write(json.dumps(schema, indent=2, sort_keys=True) + "\n")


if __name__ == "__main__":
    main()
