"""Money value object. Amounts are Decimal; floats are rejected everywhere."""

from __future__ import annotations

from dataclasses import dataclass
from decimal import ROUND_HALF_UP, Decimal

from app.shared.errors import DomainError

_CENT = Decimal("0.01")


class CurrencyMismatchError(DomainError):
    code = "currency_mismatch"


class InvalidAmountError(DomainError):
    code = "invalid_amount"


def _to_decimal(value: Decimal | int | str) -> Decimal:
    if isinstance(value, float):
        raise InvalidAmountError("Floats are not allowed for money; use Decimal, int or str.")
    try:
        return Decimal(value)
    except ArithmeticError as exc:
        raise InvalidAmountError(f"Not a valid amount: {value!r}") from exc


@dataclass(frozen=True, slots=True)
class Money:
    """An amount of money in one currency, always held at two decimal places."""

    amount: Decimal
    currency: str

    def __post_init__(self) -> None:
        if len(self.currency) != 3 or not self.currency.isupper():
            raise InvalidAmountError(
                f"Currency must be a 3-letter upper-case code: {self.currency!r}"
            )
        amount = _to_decimal(self.amount)
        if not amount.is_finite():
            raise InvalidAmountError("Amount must be finite.")
        object.__setattr__(self, "amount", amount.quantize(_CENT, rounding=ROUND_HALF_UP))

    @classmethod
    def of(cls, amount: Decimal | int | str, currency: str) -> Money:
        return cls(_to_decimal(amount), currency)

    @classmethod
    def zero(cls, currency: str) -> Money:
        return cls(Decimal(0), currency)

    def __add__(self, other: Money) -> Money:
        self._require_same_currency(other)
        return Money(self.amount + other.amount, self.currency)

    def __sub__(self, other: Money) -> Money:
        self._require_same_currency(other)
        return Money(self.amount - other.amount, self.currency)

    def __neg__(self) -> Money:
        return Money(-self.amount, self.currency)

    def times(self, factor: Decimal | int | str) -> Money:
        """Multiply by a quantity or rate; the result is rounded half-up to cents."""
        return Money(self.amount * _to_decimal(factor), self.currency)

    def is_negative(self) -> bool:
        return self.amount < 0

    def __lt__(self, other: Money) -> bool:
        self._require_same_currency(other)
        return self.amount < other.amount

    def __le__(self, other: Money) -> bool:
        self._require_same_currency(other)
        return self.amount <= other.amount

    def _require_same_currency(self, other: Money) -> None:
        if self.currency != other.currency:
            raise CurrencyMismatchError(f"Cannot combine {self.currency} with {other.currency}.")
