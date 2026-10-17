"""Base error type for business-rule violations."""


class DomainError(Exception):
    """A business rule was violated.

    ``code`` is a stable, machine-readable identifier the API layer maps to a response.
    """

    code = "domain_error"

    def __init__(self, message: str) -> None:
        super().__init__(message)
        self.message = message
